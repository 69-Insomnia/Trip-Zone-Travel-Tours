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

  // Notices are silenced on this connection, so the bucket the admin uploader
  // writes to is reported here rather than from inside the schema.
  const [bucket] = await sql`
    select public, file_size_limit from storage.buckets where id = 'media'
  `;
  if (bucket) {
    const limit = Math.round(Number(bucket.file_size_limit) / (1024 * 1024));
    console.log(
      `Media bucket: media (${bucket.public ? "public" : "PRIVATE — uploads will not display"}, up to ${limit} MB per file)`,
    );
  } else {
    console.log(
      'Media bucket: missing. Create a public bucket named "media" under Storage in the\n' +
        "  Supabase dashboard, then run the media uploads block of schema.sql from the SQL editor.",
    );
  }
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
