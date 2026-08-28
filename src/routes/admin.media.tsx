/**
 * /admin/media — the films on the home page and tour pages, and the registry of
 * decorative photographs the pages pull from by key.
 */

import { createFileRoute } from "@tanstack/react-router";
import { Film, Images } from "lucide-react";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type AdminRow } from "@/data/admin";
import { asText } from "@/lib/admin-fields";

export const Route = createFileRoute("/admin/media")({
  component: AdminMediaPage,
});

const videos: Collection = {
  table: "videos",
  select: "id, key, title, src, poster_src, poster_alt, tour_slugs, sort_order, published",
  order: { column: "sort_order", ascending: true },
  title: "Films",
  description:
    "A film with no tours listed is a company film and plays on the home page. Listing tours puts it in the hero of those tour pages.",
  singular: "film",
  labelOf: (row) => asText(row["title"]),
  previewPath: () => "/",
  metaOf: (row) => asText(row["src"]),
  fields: [
    { name: "title", kind: "text", label: "Title" },
    {
      name: "key",
      kind: "text",
      label: "Reference",
      help: "Internal identifier, must be unique.",
    },
    {
      name: "src",
      kind: "text",
      label: "Video file",
      placeholder: "/Muktinath Tour.MP4",
      help: "A file in the public folder, or a full URL.",
    },
    { name: "poster_src", kind: "image", label: "Poster image" },
    { name: "poster_alt", kind: "text", label: "Poster description" },
    {
      name: "tour_slugs",
      kind: "stringList",
      label: "Shown on these tours",
      placeholder: "muktinath-tour",
      help: "Web addresses of tours. Leave empty to show it on the home page instead.",
    },
    { name: "sort_order", kind: "number", label: "Order", min: 0 },
    { name: "published", kind: "switch", label: "Visibility" },
  ],
  blank: (): AdminRow => ({
    key: "",
    title: "",
    src: "",
    poster_src: "/photos/hero-annapurna.jpg",
    poster_alt: "",
    tour_slugs: [],
    sort_order: 99,
    published: true,
  }),
};

const photos: Collection = {
  table: "photos",
  select: "key, src, alt, position, credit",
  order: { column: "key", ascending: true },
  idKey: "key",
  title: "Page photographs",
  description:
    "Photographs the pages request by name — heroes, the about page, section backgrounds. Change the file and the page follows.",
  singular: "photograph",
  labelOf: (row) => asText(row["key"]),
  previewPath: () => "/gallery",
  metaOf: (row) => asText(row["src"]),
  fields: [
    {
      name: "key",
      kind: "text",
      label: "Name",
      help: "The name a page asks for, e.g. manang. Renaming one makes the page fall back to its built-in photo.",
    },
    { name: "src", kind: "image", label: "Photo" },
    { name: "alt", kind: "text", label: "Description for screen readers" },
    {
      name: "position",
      kind: "text",
      label: "Focus point",
      placeholder: "center 40%",
      help: "Optional. Which part of the photo to keep in view when it is cropped.",
    },
    { name: "credit", kind: "text", label: "Credit" },
  ],
  blank: (): AdminRow => ({ key: "", src: "", alt: "", position: null, credit: null }),
  beforeSave: (draft) => {
    const position = asText(draft["position"]).trim();
    const credit = asText(draft["credit"]).trim();
    return {
      ...draft,
      position: position === "" ? null : position,
      credit: credit === "" ? null : credit,
    };
  },
};

function AdminMediaPage() {
  return (
    <Tabs defaultValue="films" className="space-y-5">
      <TabsList className="h-11 border border-border bg-card p-1 shadow-soft">
        <TabsTrigger value="films" className="h-8 gap-2 px-4 font-bold">
          <Film className="size-4" aria-hidden="true" />
          Films
        </TabsTrigger>
        <TabsTrigger value="photos" className="h-8 gap-2 px-4 font-bold">
          <Images className="size-4" aria-hidden="true" />
          Page photos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="films" className="mt-0">
        <CollectionEditor collection={videos} />
      </TabsContent>
      <TabsContent value="photos" className="mt-0">
        <CollectionEditor collection={photos} />
      </TabsContent>
    </Tabs>
  );
}
