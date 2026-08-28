/**
 * /admin/settings — the company details every page shows.
 *
 * One row, so no list: this is the header, the footer, the contact page and
 * every WhatsApp and call link on the site.
 */

import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor, type Collection } from "@/components/admin/CollectionEditor";
import { type AdminRow } from "@/data/admin";
import { asLinkList, asText } from "@/lib/admin-fields";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

const collection: Collection = {
  table: "site_settings",
  select: "id, name, short_name, tagline, address, phones, socials, whatsapp_message",
  singleton: true,
  title: "Site settings",
  description:
    "Used by the header, the footer, the contact page and every call and WhatsApp link on the website.",
  singular: "settings",
  labelOf: (row) => asText(row["name"]),
  previewPath: () => "/",
  fields: [
    { name: "name", kind: "text", label: "Company name", section: "Brand" },
    {
      name: "short_name",
      kind: "text",
      label: "Short name",
      help: "Used where space is tight.",
      section: "Brand",
    },
    { name: "tagline", kind: "text", label: "Tagline", section: "Brand" },
    { name: "address", kind: "text", label: "Address", section: "Contact details" },
    {
      name: "phones",
      kind: "stringList",
      label: "Phone numbers",
      section: "Contact details",
      placeholder: "+977 9800000000",
      help: "The first number is the one used for WhatsApp and the call button.",
    },
    {
      name: "socials",
      kind: "linkList",
      label: "Social links",
      section: "Contact details",
      help: "Add the full public profile URL. Use the preview button to confirm that it opens the correct page.",
    },
    {
      name: "whatsapp_message",
      kind: "textarea",
      label: "Default WhatsApp message",
      section: "Messaging",
      rows: 3,
      help: "Pre-filled when a visitor taps the floating WhatsApp button.",
    },
  ],
  beforeSave: (draft) => ({
    ...draft,
    socials: asLinkList(draft["socials"])
      .map((link) => ({
        label: link.label.trim(),
        url: normalizeExternalUrl(link.url),
      }))
      .filter((link) => link.label || link.url),
  }),
  validate: (draft) => {
    const socials = asLinkList(draft["socials"]);
    for (const [index, link] of socials.entries()) {
      if (!link.label.trim()) return `Social link ${index + 1} needs a platform name.`;
      if (!link.url.trim()) return `${link.label.trim()} needs a profile URL.`;
      if (!isValidExternalUrl(link.url)) {
        return `${link.label.trim()} has an invalid URL. Use a full address such as https://facebook.com/your-page.`;
      }
    }
    return null;
  },
  blank: (): AdminRow => ({ id: 1 }),
};

function AdminSettingsPage() {
  return <CollectionEditor collection={collection} />;
}
