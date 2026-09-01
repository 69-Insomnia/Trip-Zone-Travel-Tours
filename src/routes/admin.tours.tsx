/**
 * /admin/tours — packages, their prices, their day-by-day itinerary and the
 * photographs in their "Places & mountain views" section.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { replaceTourChildren, type AdminRow } from "@/data/admin";
import { asDays, asPrices, asText, asViews, slugify } from "@/lib/admin-fields";

export const Route = createFileRoute("/admin/tours")({
  component: AdminToursPage,
});

const collection: Collection = {
  table: "tours",
  select:
    "id, slug, name, region, duration, nights, days, type, summary, overview, image, highlights, included, excluded, travel_notes, sort_order, published, tour_prices(transport, price, note, sort_order), tour_itinerary(day, route), tour_views(title, place, elevation, mountain_name, mountain_elevation, description, image, image_alt, photo_note, credit, credit_url, sort_order)",
  order: { column: "sort_order", ascending: true },
  title: "Tours",
  description:
    "Tour packages as they appear on the home page, the tours page and their own detail page.",
  singular: "tour",
  labelOf: (row) => asText(row["name"]),
  previewPath: (row) => `/tours/${asText(row["slug"])}`,
  metaOf: (row) => `${asText(row["region"])} · ${asText(row["duration"])}`,
  fields: [
    {
      name: "name",
      kind: "text",
      label: "Name",
      placeholder: "Muktinath Tour",
      section: "Tour basics",
    },
    {
      name: "slug",
      kind: "text",
      label: "Web address",
      section: "Tour basics",
      placeholder: "muktinath-tour",
      help: "Appears in the URL as /tours/…. Leave blank to build it from the name. Changing it breaks existing links.",
    },
    {
      name: "region",
      kind: "text",
      label: "Region",
      placeholder: "Mustang",
      section: "Tour basics",
    },
    {
      name: "type",
      kind: "select",
      label: "Type",
      options: ["Pilgrimage", "Mountain", "Nature"],
      section: "Tour basics",
    },
    {
      name: "duration",
      kind: "text",
      label: "Duration",
      section: "Tour basics",
      placeholder: "3 Nights 4 Days",
      help: "The wording shown on cards.",
    },
    { name: "nights", kind: "number", label: "Nights", min: 0, section: "Tour basics" },
    { name: "days", kind: "number", label: "Days", min: 1, section: "Tour basics" },
    {
      name: "summary",
      kind: "textarea",
      label: "Card summary",
      section: "Story & imagery",
      rows: 3,
      help: "One or two lines, shown on the tour card.",
    },
    { name: "overview", kind: "textarea", label: "Overview", rows: 6, section: "Story & imagery" },
    { name: "image", kind: "image", label: "Main photo", section: "Story & imagery" },
    {
      name: "highlights",
      kind: "stringList",
      label: "Highlights",
      placeholder: "Sunrise over…",
      section: "Story & imagery",
    },
    {
      name: "tour_prices",
      kind: "prices",
      label: "Prices — transport, NPR, note",
      section: "Pricing & itinerary",
    },
    {
      name: "tour_itinerary",
      kind: "itinerary",
      label: "Itinerary",
      section: "Pricing & itinerary",
      help: "Writing a day as its stops — “Kathmandu → Dharapani → Manang” — also draws the route section on this tour's page. A day written as a sentence hides that section for the whole tour.",
    },
    { name: "included", kind: "stringList", label: "What's included", section: "Package details" },
    {
      name: "excluded",
      kind: "stringList",
      label: "What's not included",
      section: "Package details",
    },
    { name: "travel_notes", kind: "stringList", label: "Travel notes", section: "Package details" },
    {
      name: "tour_views",
      kind: "views",
      label: "View photographs",
      section: "Places & mountain views",
      help: "The photo grid on this tour's page. Remove every view to hide the section on this tour. The heading and labels around the grid are in Settings.",
    },
    {
      name: "sort_order",
      kind: "number",
      label: "Order on the website",
      min: 0,
      section: "Publishing",
    },
    { name: "published", kind: "switch", label: "Visibility", section: "Publishing" },
  ],
  blank: (): AdminRow => ({
    slug: "",
    name: "",
    region: "",
    duration: "",
    nights: 1,
    days: 2,
    type: "Nature",
    summary: "",
    overview: "",
    image: "/photos/hero-annapurna.jpg",
    highlights: [],
    included: [],
    excluded: [],
    travel_notes: [],
    sort_order: 99,
    published: true,
    tour_prices: [],
    tour_itinerary: [],
    tour_views: [],
  }),
  beforeSave: (draft) => {
    const slug = asText(draft["slug"]).trim();
    return slug ? draft : { ...draft, slug: slugify(asText(draft["name"])) };
  },
  afterSave: async (id, draft) =>
    replaceTourChildren(
      id,
      asPrices(draft["tour_prices"]),
      asDays(draft["tour_itinerary"]),
      asViews(draft["tour_views"]),
    ),
};

function AdminToursPage() {
  return <CollectionEditor collection={collection} />;
}
