/**
 * Replaces only the viewpoint rows for selected tours (or every tour).
 *
 * Usage:
 *   npm run db:sync-tour-views
 *   npm run db:sync-tour-views -- manang muktinath
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { connect, projectRoot } from "./env.mjs";
import { tourViews } from "../../src/data/tour-views.ts";

const requested = process.argv.slice(2);
const slugs = requested.length > 0 ? requested : Object.keys(tourViews);
const unknown = slugs.filter((slug) => !tourViews[slug]);

if (unknown.length > 0) {
  console.error(`Unknown tour slug${unknown.length > 1 ? "s" : ""}: ${unknown.join(", ")}`);
  process.exit(1);
}

for (const slug of slugs) {
  for (const view of tourViews[slug] ?? []) {
    if (!view.image.startsWith("/")) continue;
    const imagePath = resolve(projectRoot, "public", view.image.replace(/^\/+/, ""));
    if (!existsSync(imagePath)) {
      console.error(`Missing viewpoint image for ${slug}: ${view.image}`);
      process.exit(1);
    }
  }
}

const sql = connect();

try {
  await sql.begin(async (tx) => {
    for (const slug of slugs) {
      const [tour] = await tx`select id from tours where slug = ${slug}`;
      if (!tour) throw new Error(`Tour is missing from the database: ${slug}`);

      await tx`delete from tour_views where tour_id = ${tour.id}`;
      for (const [sortOrder, view] of (tourViews[slug] ?? []).entries()) {
        await tx`
          insert into tour_views (tour_id, title, place, elevation, mountain_name,
                                  mountain_elevation, description, image, image_alt,
                                  photo_note, credit, credit_url, sort_order)
          values (${tour.id}, ${view.title}, ${view.place}, ${view.elevation},
                  ${view.mountainName}, ${view.mountainElevation}, ${view.description},
                  ${view.image}, ${view.imageAlt}, ${view.photoNote ?? ""},
                  ${view.credit ?? ""}, ${view.creditUrl ?? ""}, ${sortOrder})
        `;
      }
    }
  });

  const rows = await sql`
    select t.slug, count(v.id)::int as views
    from tours t
    left join tour_views v on v.tour_id = t.id
    where t.slug = any(${sql.array(slugs)})
    group by t.id
    order by t.sort_order
  `;

  console.log(`Synced viewpoint images for ${rows.length} tour${rows.length === 1 ? "" : "s"}:`);
  for (const row of rows) console.log(`  ${row.slug}: ${row.views} view(s)`);
} catch (error) {
  console.error("Viewpoint sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
