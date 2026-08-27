/**
 * Applies scripts/db/schema.sql to the Supabase database.
 *
 *   node scripts/db/migrate.mjs
 *
 * The schema is idempotent, so re-running is safe.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { connect, projectRoot } from "./env.mjs";

const sql = connect();

try {
  const schema = readFileSync(resolve(projectRoot, "scripts/db/schema.sql"), "utf8");
  await sql.unsafe(schema);

  const tables = await sql`
    select table_name, (select count(*) from pg_policies p
      where p.schemaname = 'public' and p.tablename = t.table_name) as policies
    from information_schema.tables t
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `;
  console.log("Schema applied. Tables:");
  for (const t of tables) console.log(`  ${t.table_name} (${t.policies} policy)`);
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
