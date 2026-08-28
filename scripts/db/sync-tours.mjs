/**
 * Upserts selected tours from src/data/tours.ts without touching other content.
 *
 * Usage:
 *   node --import ./scripts/db/register-ts.mjs scripts/db/sync-tours.mjs tour-slug [...]
 */

import { connect } from "./env.mjs";
import { tours } from "../../src/data/tours.ts";

const requested = new Set(process.argv.slice(2));
if (requested.size === 0) {
  console.error("Provide at least one tour slug to sync.");
  process.exit(1);
}

const selected = tours.filter((tour) => requested.has(tour.slug));
const missing = [...requested].filter((slug) => !selected.some((tour) => tour.slug === slug));
if (missing.length > 0) {
  console.error(`Unknown tour slug${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`);
  process.exit(1);
}

const sql = connect();

try {
  await sql.begin(async (tx) => {
    for (const tour of selected) {
      const sortOrder = tours.findIndex((candidate) => candidate.slug === tour.slug);
      const [row] = await tx`
        insert into tours (slug, name, region, duration, nights, days, type, summary, overview,
                           image, highlights, included, excluded, travel_notes, sort_order)
        values (${tour.slug}, ${tour.name}, ${tour.region}, ${tour.duration}, ${tour.nights},
                ${tour.days}, ${tour.type}, ${tour.summary}, ${tour.overview}, ${tour.image},
                ${sql.array(tour.highlights)}, ${sql.array(tour.included)},
                ${sql.array(tour.excluded)}, ${sql.array(tour.travelNotes ?? [])}, ${sortOrder})
        on conflict (slug) do update set
          name = excluded.name, region = excluded.region, duration = excluded.duration,
          nights = excluded.nights, days = excluded.days, type = excluded.type,
          summary = excluded.summary, overview = excluded.overview, image = excluded.image,
          highlights = excluded.highlights, included = excluded.included,
          excluded = excluded.excluded, travel_notes = excluded.travel_notes,
          sort_order = excluded.sort_order, published = true
        returning id
      `;

      await tx`delete from tour_prices where tour_id = ${row.id}`;
      for (const [priceOrder, price] of tour.prices.entries()) {
        await tx`
          insert into tour_prices (tour_id, transport, price, note, sort_order)
          values (${row.id}, ${price.transport}, ${price.price}, ${price.note ?? null}, ${priceOrder})
        `;
      }

      await tx`delete from tour_itinerary where tour_id = ${row.id}`;
      for (const day of tour.itinerary) {
        await tx`
          insert into tour_itinerary (tour_id, day, route)
          values (${row.id}, ${day.day}, ${day.route})
        `;
      }
    }
  });

  const verified = await sql`
    select t.slug, t.duration,
           count(distinct p.id)::int as prices,
           count(distinct i.id)::int as itinerary_days,
           cardinality(t.travel_notes)::int as travel_notes
    from tours t
    left join tour_prices p on p.tour_id = t.id
    left join tour_itinerary i on i.tour_id = t.id
    where t.slug = any(${sql.array([...requested])})
    group by t.id
    order by t.sort_order
  `;

  console.log(`Synced ${selected.length} tour package${selected.length === 1 ? "" : "s"}:`);
  for (const tour of verified) {
    console.log(
      `  ${tour.slug}: ${tour.duration}, ${tour.prices} price option(s), ${tour.itinerary_days} day(s), ${tour.travel_notes} note(s)`,
    );
  }
} catch (error) {
  console.error("Tour sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
