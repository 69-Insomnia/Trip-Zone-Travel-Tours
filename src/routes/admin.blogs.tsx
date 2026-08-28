/**
 * /admin/blogs — travel guides, including the body of each article.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { type AdminRow } from "@/data/admin";
import { asSections, asText, slugify } from "@/lib/admin-fields";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogsPage,
});

const collection: Collection = {
  table: "blogs",
  select:
    "id, slug, title, excerpt, category, location, image, published_at, read_time, introduction, sections, published",
  order: { column: "published_at", ascending: false },
  title: "Blog posts",
  description: "Travel guides listed on /blogs, newest first.",
  singular: "blog post",
  labelOf: (row) => asText(row["title"]),
  previewPath: (row) => `/blogs/${asText(row["slug"])}`,
  metaOf: (row) =>
    `${asText(row["published_at"]).slice(0, 10)} · ${asSections(row["sections"]).length} sections`,
  fields: [
    { name: "title", kind: "text", label: "Title", section: "Post basics" },
    {
      name: "slug",
      kind: "text",
      label: "Web address",
      section: "Post basics",
      help: "Appears in the URL as /blogs/…. Leave blank to build it from the title.",
    },
    {
      name: "category",
      kind: "text",
      label: "Category",
      placeholder: "Trekking",
      section: "Post basics",
    },
    {
      name: "location",
      kind: "text",
      label: "Location",
      placeholder: "Manang",
      section: "Post basics",
    },
    { name: "published_at", kind: "date", label: "Published on", section: "Post basics" },
    {
      name: "read_time",
      kind: "text",
      label: "Reading time",
      placeholder: "6 min read",
      section: "Post basics",
    },
    {
      name: "excerpt",
      kind: "textarea",
      label: "Excerpt",
      section: "Story & imagery",
      rows: 2,
      help: "The teaser shown on the blog list.",
    },
    { name: "image", kind: "image", label: "Cover photo", section: "Story & imagery" },
    {
      name: "introduction",
      kind: "textarea",
      label: "Introduction",
      rows: 4,
      section: "Article content",
    },
    { name: "sections", kind: "sections", label: "Article body", section: "Article content" },
    { name: "published", kind: "switch", label: "Visibility", section: "Publishing" },
  ],
  blank: (): AdminRow => ({
    slug: "",
    title: "",
    excerpt: "",
    category: "Guide",
    location: "Nepal",
    image: "/photos/hero-annapurna.jpg",
    published_at: new Date().toISOString().slice(0, 10),
    read_time: "5 min read",
    introduction: "",
    sections: [],
    published: true,
  }),
  beforeSave: (draft) => {
    const slug = asText(draft["slug"]).trim();
    return slug ? draft : { ...draft, slug: slugify(asText(draft["title"])) };
  },
};

function AdminBlogsPage() {
  return <CollectionEditor collection={collection} />;
}
