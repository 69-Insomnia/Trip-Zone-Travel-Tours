/**
 * /admin/destinations — the destination cards and the contact form dropdown.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { type AdminRow } from "@/data/admin";
import { asText, slugify } from "@/lib/admin-fields";

export const Route = createFileRoute("/admin/destinations")({
  component: AdminDestinationsPage,
});

const collection: Collection = {
  table: "destinations",
  select: "id, slug, name, description, image, tour_slug, sort_order, published",
  order: { column: "sort_order", ascending: true },
  title: "Destinations",
  description:
    "Shown on the destinations page, the home page grid and as the options in the contact form.",
  singular: "destination",
  labelOf: (row) => asText(row["name"]),
  previewPath: () => "/destinations",
  metaOf: (row) => asText(row["tour_slug"]),
  fields: [
    { name: "name", kind: "text", label: "Name", placeholder: "Kalinchowk" },
    {
      name: "slug",
      kind: "text",
      label: "Reference",
      help: "Internal identifier. Leave blank to build it from the name.",
    },
    { name: "description", kind: "textarea", label: "Description", rows: 3 },
    { name: "image", kind: "image", label: "Photo" },
    {
      name: "tour_slug",
      kind: "text",
      label: "Linked tour",
      help: "The web address of the tour this destination links to, e.g. sailung-kalinchowk-tour. Leave blank for no link.",
    },
    { name: "sort_order", kind: "number", label: "Order on the website", min: 0 },
    { name: "published", kind: "switch", label: "Visibility" },
  ],
  blank: (): AdminRow => ({
    slug: "",
    name: "",
    description: "",
    image: "/photos/hero-annapurna.jpg",
    tour_slug: null,
    sort_order: 99,
    published: true,
  }),
  beforeSave: (draft) => {
    const slug = asText(draft["slug"]).trim();
    const tour = asText(draft["tour_slug"]).trim();
    return {
      ...draft,
      slug: slug || slugify(asText(draft["name"])),
      tour_slug: tour === "" ? null : tour,
    };
  },
};

function AdminDestinationsPage() {
  return <CollectionEditor collection={collection} />;
}
