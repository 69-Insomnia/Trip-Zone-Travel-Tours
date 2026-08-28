/** Checks an anonymous visitor can insert an inquiry but cannot read them back. */
import { createClient } from "@supabase/supabase-js";
import { loadEnv, connect } from "./env.mjs";

const env = loadEnv();
const anon = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});

const marker = "verify-script-check";
const insert = await anon.from("inquiries").insert({
  name: "Verification Script",
  phone: "9800000000",
  message: `${marker} — automated check that the contact form reaches the database.`,
  status: "new",
  source: "website",
});
console.log("anon insert:", insert.error ? `FAIL ${insert.error.message}` : "PASS");

const read = await anon.from("inquiries").select("id").limit(1);
console.log("anon read blocked:", read.data?.length ? "FAIL (readable!)" : "PASS");

const escalate = await anon.from("inquiries").insert({
  name: "Escalation Test",
  phone: "9800000000",
  message: "should be rejected by policy",
  status: "won",
});
console.log("status forced by policy:", escalate.error ? "PASS" : "FAIL (accepted 'won')");

const sql = connect();
const rows =
  await sql`select count(*)::int as n from inquiries where message like ${"%" + marker + "%"}`;
console.log("rows stored:", rows[0].n);
await sql`delete from inquiries where message like ${"%" + marker + "%"}`;
const left = await sql`select count(*)::int as n from inquiries`;
console.log("inquiries after cleanup:", left[0].n);
await sql.end();
