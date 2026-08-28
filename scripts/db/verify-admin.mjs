/**
 * Checks that an administrator can sign in and write, and that an anonymous
 * visitor cannot.
 *
 *   node scripts/db/verify-admin.mjs <email> <password>
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "./env.mjs";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/db/verify-admin.mjs <email> <password>");
  process.exit(1);
}

const env = loadEnv();
const anon = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false },
});

let failures = 0;
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

// 1. anonymous visitor cannot write
{
  const { error } = await anon.from("faqs").insert({ question: "hack?", answer: "no" });
  check(!!error, "anonymous cannot insert content", error?.message ?? "insert succeeded!");
}

// 2. sign in
const { data: signIn, error: signInError } = await anon.auth.signInWithPassword({
  email,
  password,
});
check(
  !signInError && !!signIn?.session,
  "admin signs in",
  signInError?.message ?? signIn.user.email,
);
if (signInError) {
  await anon.auth.signOut();
  process.exit(1);
}

// 3. admin membership is visible to the client
{
  const { data, error } = await anon.from("admins").select("email").eq("user_id", signIn.user.id);
  check(
    !error && data?.length === 1,
    "admin row readable by its owner",
    error?.message ?? `${data?.length} row(s)`,
  );
}

// 4. admin can write, and the change is real
{
  const { data: before } = await anon.from("site_settings").select("tagline").eq("id", 1).single();
  const probe = "__admin write probe__";
  const { error: upErr } = await anon.from("site_settings").update({ tagline: probe }).eq("id", 1);
  check(!upErr, "admin can update site settings", upErr?.message ?? "");
  const { data: after } = await anon.from("site_settings").select("tagline").eq("id", 1).single();
  check(after?.tagline === probe, "update is persisted", after?.tagline ?? "");
  await anon.from("site_settings").update({ tagline: before.tagline }).eq("id", 1);
  const { data: restored } = await anon
    .from("site_settings")
    .select("tagline")
    .eq("id", 1)
    .single();
  check(restored?.tagline === before.tagline, "probe reverted", restored?.tagline ?? "");
}

// 5. admin can read the inquiries inbox
{
  const { error } = await anon.from("inquiries").select("id, name, status").limit(1);
  check(!error, "admin can read inquiries", error?.message ?? "");
}

await anon.auth.signOut();

// 6. after signing out, writes are refused again
{
  const { error } = await anon.from("faqs").insert({ question: "hack?", answer: "no" });
  check(!!error, "signed-out client cannot insert", error?.message ?? "insert succeeded!");
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exitCode = failures === 0 ? 0 : 1;
