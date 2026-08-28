/**
 * Seeds the database from the content files in src/data.
 *
 *   node --import ./scripts/db/register-ts.mjs scripts/db/seed.mjs
 *
 * Rows are upserted on their natural key (slug / key), so re-running keeps the
 * database in step with the files without creating duplicates. Anything edited
 * in the Supabase dashboard is overwritten by a re-seed — after go-live the
 * database is the source of truth and this script is only for a fresh project.
 */

import { connect } from "./env.mjs";
import { tours, destinations, faqs, testimonials } from "../../src/data/tours.ts";
import { blogs } from "../../src/data/blogs.ts";
import { allPhotos, photoCredit } from "../../src/data/photos.ts";
import { videos } from "../../src/data/videos.ts";
import { galleryItems } from "../../src/data/gallery.ts";
import { site } from "../../src/data/site.ts";

const sql = connect();

/** Matches the default WhatsApp message in src/data/site.ts. */
const waMessage = "Hello Trip Zone, I would like to know more about your Nepal tour packages.";

try {
  await sql.begin(async (tx) => {
    // ---------------------------------------------------------- site settings
    await tx`
      insert into site_settings (id, name, short_name, tagline, address, phones, socials, whatsapp_message)
      values (1, ${site.name}, ${site.shortName}, ${site.tagline}, ${site.address},
              ${sql.array([...site.phones])}, ${sql.json([...site.socials])}, ${waMessage})
      on conflict (id) do update set
        name = excluded.name, short_name = excluded.short_name, tagline = excluded.tagline,
        address = excluded.address, phones = excluded.phones, socials = excluded.socials,
        whatsapp_message = excluded.whatsapp_message
    `;

    // ----------------------------------------------------------------- photos
    for (const [key, p] of Object.entries(allPhotos)) {
      await tx`
        insert into photos (key, src, alt, position, credit)
        values (${key}, ${p.src}, ${p.alt}, ${p.position ?? null}, ${photoCredit})
        on conflict (key) do update set
          src = excluded.src, alt = excluded.alt, position = excluded.position,
          credit = excluded.credit
      `;
    }

    // ------------------------------------------------- tours + prices + days
    for (const [i, tour] of tours.entries()) {
      const [row] = await tx`
        insert into tours (slug, name, region, duration, nights, days, type, summary, overview,
                           image, highlights, included, excluded, travel_notes, sort_order)
        values (${tour.slug}, ${tour.name}, ${tour.region}, ${tour.duration}, ${tour.nights},
                ${tour.days}, ${tour.type}, ${tour.summary}, ${tour.overview}, ${tour.image},
                ${sql.array(tour.highlights)}, ${sql.array(tour.included)},
                ${sql.array(tour.excluded)}, ${sql.array(tour.travelNotes ?? [])}, ${i})
        on conflict (slug) do update set
          name = excluded.name, region = excluded.region, duration = excluded.duration,
          nights = excluded.nights, days = excluded.days, type = excluded.type,
          summary = excluded.summary, overview = excluded.overview, image = excluded.image,
          highlights = excluded.highlights, included = excluded.included,
          excluded = excluded.excluded, travel_notes = excluded.travel_notes,
          sort_order = excluded.sort_order
        returning id
      `;

      // Children are replaced wholesale — simpler and always consistent.
      await tx`delete from tour_prices where tour_id = ${row.id}`;
      for (const [j, price] of tour.prices.entries()) {
        await tx`
          insert into tour_prices (tour_id, transport, price, note, sort_order)
          values (${row.id}, ${price.transport}, ${price.price}, ${price.note ?? null}, ${j})
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

    // ----------------------------------------------------------- destinations
    for (const [i, d] of destinations.entries()) {
      await tx`
        insert into destinations (slug, name, description, image, tour_slug, sort_order)
        values (${d.slug}, ${d.name}, ${d.description}, ${d.image}, ${d.tour ?? null}, ${i})
        on conflict (slug) do update set
          name = excluded.name, description = excluded.description, image = excluded.image,
          tour_slug = excluded.tour_slug, sort_order = excluded.sort_order
      `;
    }

    // ----------------------------------------------------------------- videos
    for (const [i, v] of videos.entries()) {
      await tx`
        insert into videos (key, title, src, poster_src, poster_alt, tour_slugs, sort_order)
        values (${v.key}, ${v.title}, ${v.src}, ${v.posterSrc}, ${v.posterAlt},
                ${sql.array(v.tours)}, ${i})
        on conflict (key) do update set
          title = excluded.title, src = excluded.src, poster_src = excluded.poster_src,
          poster_alt = excluded.poster_alt, tour_slugs = excluded.tour_slugs,
          sort_order = excluded.sort_order
      `;
    }

    // ---------------------------------------------------------------- gallery
    await tx`delete from gallery_items`;
    for (const [i, g] of galleryItems.entries()) {
      await tx`
        insert into gallery_items (title, place, category, image, size_class, sort_order)
        values (${g.title}, ${g.place}, ${g.category}, ${g.image}, ${g.size ?? null}, ${i})
      `;
    }

    // ------------------------------------------------------------------ blogs
    for (const [i, b] of blogs.entries()) {
      const publishedAt = new Date(b.publishedAt);
      if (Number.isNaN(publishedAt.getTime())) {
        throw new Error(`Blog "${b.slug}" has an unparseable publishedAt: ${b.publishedAt}`);
      }
      await tx`
        insert into blogs (slug, title, excerpt, category, location, image, published_at,
                           read_time, introduction, sections)
        values (${b.slug}, ${b.title}, ${b.excerpt}, ${b.category}, ${b.location}, ${b.image},
                ${publishedAt.toISOString().slice(0, 10)}, ${b.readTime}, ${b.introduction},
                ${sql.json(b.sections)})
        on conflict (slug) do update set
          title = excluded.title, excerpt = excluded.excerpt, category = excluded.category,
          location = excluded.location, image = excluded.image,
          published_at = excluded.published_at, read_time = excluded.read_time,
          introduction = excluded.introduction, sections = excluded.sections
      `;
      void i;
    }

    // ------------------------------------------------------------------- faqs
    await tx`delete from faqs`;
    for (const [i, f] of faqs.entries()) {
      await tx`insert into faqs (question, answer, sort_order) values (${f.q}, ${f.a}, ${i})`;
    }

    // ----------------------------------------------------------- testimonials
    await tx`delete from testimonials`;
    for (const [i, t] of testimonials.entries()) {
      await tx`
        insert into testimonials (name, location, tour, quote, sort_order)
        values (${t.name}, ${t.location}, ${t.tour}, ${t.quote}, ${i})
      `;
    }
  });

  const counts = await sql`
    select 'tours' as t, count(*) from tours
    union all select 'tour_prices', count(*) from tour_prices
    union all select 'tour_itinerary', count(*) from tour_itinerary
    union all select 'destinations', count(*) from destinations
    union all select 'photos', count(*) from photos
    union all select 'videos', count(*) from videos
    union all select 'gallery_items', count(*) from gallery_items
    union all select 'blogs', count(*) from blogs
    union all select 'faqs', count(*) from faqs
    union all select 'testimonials', count(*) from testimonials
    union all select 'site_settings', count(*) from site_settings
    union all select 'inquiries', count(*) from inquiries
  `;
  console.log("Seed complete:");
  for (const row of counts) console.log(`  ${row.t.padEnd(16)} ${row.count}`);
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
