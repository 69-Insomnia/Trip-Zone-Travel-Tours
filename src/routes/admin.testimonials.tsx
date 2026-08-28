/**
 * /admin/testimonials — traveller quotes.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { type AdminRow } from "@/data/admin";
import { asText } from "@/lib/admin-fields";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsPage,
});

const collection: Collection = {
  table: "testimonials",
  select: "id, name, location, tour, quote, rating, sort_order, published",
  order: { column: "sort_order", ascending: true },
  title: "Testimonials",
  description: "Traveller quotes. Hide them all and the section disappears from the page.",
  singular: "testimonial",
  labelOf: (row) => asText(row["name"]),
  previewPath: () => "/",
  metaOf: (row) => asText(row["tour"]),
  fields: [
    { name: "name", kind: "text", label: "Traveller" },
    { name: "location", kind: "text", label: "Where they are from" },
    { name: "tour", kind: "text", label: "Tour they took" },
    { name: "quote", kind: "textarea", label: "Quote", rows: 4 },
    { name: "rating", kind: "number", label: "Rating out of 5", min: 1, max: 5 },
    { name: "sort_order", kind: "number", label: "Order on the page", min: 0 },
    { name: "published", kind: "switch", label: "Visibility" },
  ],
  blank: (): AdminRow => ({
    name: "",
    location: "",
    tour: "",
    quote: "",
    rating: 5,
    sort_order: 99,
    published: true,
  }),
};

function AdminTestimonialsPage() {
  return <CollectionEditor collection={collection} />;
}
