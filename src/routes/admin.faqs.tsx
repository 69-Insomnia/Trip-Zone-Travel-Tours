/**
 * /admin/faqs — frequently asked questions.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { type AdminRow } from "@/data/admin";
import { asText } from "@/lib/admin-fields";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqsPage,
});

const collection: Collection = {
  table: "faqs",
  select: "id, question, answer, sort_order, published",
  order: { column: "sort_order", ascending: true },
  title: "FAQs",
  description: "Questions shown on the home page and individual tour pages.",
  singular: "question",
  labelOf: (row) => asText(row["question"]),
  previewPath: () => "/",
  fields: [
    { name: "question", kind: "text", label: "Question" },
    { name: "answer", kind: "textarea", label: "Answer", rows: 4 },
    { name: "sort_order", kind: "number", label: "Order on the page", min: 0 },
    { name: "published", kind: "switch", label: "Visibility" },
  ],
  blank: (): AdminRow => ({
    question: "",
    answer: "",
    sort_order: 99,
    published: true,
  }),
};

function AdminFaqsPage() {
  return <CollectionEditor collection={collection} />;
}
