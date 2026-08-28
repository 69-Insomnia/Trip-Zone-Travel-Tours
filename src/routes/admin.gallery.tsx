/**
 * /admin/gallery — the photo wall on /gallery.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { type AdminRow } from "@/data/admin";
import { asText } from "@/lib/admin-fields";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGalleryPage,
});

const collection: Collection = {
  table: "gallery_items",
  select: "id, title, place, category, image, size_class, sort_order, published",
  order: { column: "sort_order", ascending: true },
  title: "Gallery",
  description: "The photo wall on /gallery. The first photo is also its page banner.",
  singular: "photo",
  labelOf: (row) => asText(row["title"]),
  previewPath: () => "/gallery",
  metaOf: (row) => `${asText(row["place"])} · ${asText(row["category"])}`,
  fields: [
    { name: "title", kind: "text", label: "Caption" },
    { name: "place", kind: "text", label: "Place" },
    { name: "category", kind: "text", label: "Category", placeholder: "Mountains" },
    { name: "image", kind: "image", label: "Photo" },
    {
      name: "size_class",
      kind: "text",
      label: "Tile size",
      help: "Optional layout classes, e.g. sm:col-span-2 sm:row-span-2 to make this photo larger.",
    },
    { name: "sort_order", kind: "number", label: "Order on the page", min: 0 },
    { name: "published", kind: "switch", label: "Visibility" },
  ],
  blank: (): AdminRow => ({
    title: "",
    place: "",
    category: "Mountains",
    image: "/photos/hero-annapurna.jpg",
    size_class: null,
    sort_order: 99,
    published: true,
  }),
  beforeSave: (draft) => {
    const size = asText(draft["size_class"]).trim();
    return { ...draft, size_class: size === "" ? null : size };
  },
};

function AdminGalleryPage() {
  return <CollectionEditor collection={collection} />;
}
