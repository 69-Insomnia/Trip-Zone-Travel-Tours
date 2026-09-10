/**
 * Adds FAQs written in src/data/tours.ts that are not in the database yet.
 *
 * The seed script deletes every FAQ before re-inserting, so it cannot be used
 * once the admin panel is live — it would throw away answers edited there. This
 * only ever inserts. A question already present is left exactly as it is, which
 * means an answer reworded in /admin/faqs survives running this again.
 *
 * Matching is on the question text after trimming, so a question edited in the
 * admin panel reads as a new one here and would be inserted a second time. The
 * dry run lists what would be added for that reason — read it before writing.
 *
 * Usage:
 *   npm run db:sync-faqs -- --dry-run
 *   npm run db:sync-faqs
 */

import { connect } from "./env.mjs";
import { faqs } from "../../src/data/tours.ts";

const dryRun = process.argv.slice(2).includes("--dry-run");
const sql = connect();

try {
  const existing = await sql`select question, sort_order from faqs`;
  const known = new Set(existing.map((row) => row.question.trim()));

  // Continue past the highest sort_order in use rather than the source index:
  // the admin panel reorders rows freely, so a source index would drop new
  // questions into the middle of an order somebody chose deliberately.
  let next = existing.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1;

  const missing = faqs.filter((faq) => !known.has(faq.q.trim()));

  if (missing.length === 0) {
    console.log(`Nothing to add — all ${faqs.length} questions are already in the database.`);
  } else if (dryRun) {
    console.log(`Would add ${missing.length} of ${faqs.length} question(s):`);
    for (const faq of missing) console.log(`  + ${faq.q}`);
  } else {
    await sql.begin(async (tx) => {
      for (const faq of missing) {
        await tx`
          insert into faqs (question, answer, sort_order)
          values (${faq.q}, ${faq.a}, ${next})
        `;
        next += 1;
      }
    });
    console.log(`Added ${missing.length} question(s):`);
    for (const faq of missing) console.log(`  + ${faq.q}`);
  }

  const [{ total, live }] = await sql`
    select count(*)::int as total, count(*) filter (where published)::int as live from faqs
  `;
  console.log(`\nfaqs: ${total} row(s), ${live} published.`);
} finally {
  await sql.end();
}
