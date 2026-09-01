/**
 * /admin/settings — the company details every page shows.
 *
 * One row, so no list: this is the header, the footer, the contact page and
 * every WhatsApp and call link on the site, plus the wording of the
 * "Places & mountain views" section shared by every tour page.
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
  select:
    "id, name, short_name, tagline, address, phones, socials, whatsapp_message, views_eyebrow, views_title, views_subtitle, views_footnote, views_elevation_label, views_mountain_label, views_note_label, views_note_text, way_eyebrow, way_title, way_subtitle, way_footnote, way_day_label, way_high_point_label",
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
    {
      name: "views_eyebrow",
      kind: "text",
      label: "Small label above the heading",
      section: "Places & mountain views",
      placeholder: "Places & mountain views",
      help: "Leave empty to hide it.",
    },
    {
      name: "views_title",
      kind: "text",
      label: "Heading",
      section: "Places & mountain views",
      placeholder: "See what you will experience",
    },
    {
      name: "views_subtitle",
      kind: "textarea",
      label: "Introduction",
      section: "Places & mountain views",
      rows: 3,
      help: "Shown under the heading. Leave empty to hide it.",
    },
    {
      name: "views_footnote",
      kind: "textarea",
      label: "Small print under the photos",
      section: "Places & mountain views",
      rows: 3,
      help: "Leave empty to hide it.",
    },
    {
      name: "views_elevation_label",
      kind: "text",
      label: "Label — viewpoint elevation",
      section: "Places & mountain views",
      placeholder: "Viewpoint elevation",
      help: "Shown beside a photo's details when a visitor opens it.",
    },
    {
      name: "views_mountain_label",
      kind: "text",
      label: "Label — mountain / ridge",
      section: "Places & mountain views",
      placeholder: "Mountain / ridge",
    },
    {
      name: "views_note_label",
      kind: "text",
      label: "Label — photo note",
      section: "Places & mountain views",
      placeholder: "Photo note",
    },
    {
      name: "views_note_text",
      kind: "text",
      label: "Shared photo note",
      section: "Places & mountain views",
      placeholder: "View conditions vary by season and weather.",
      help: "Used for every photo that has no note of its own. Leave empty to hide the note.",
    },
    {
      name: "way_eyebrow",
      kind: "text",
      label: "Small label above the heading",
      section: "The way",
      placeholder: "The way",
      help: "Leave empty to hide it.",
    },
    {
      name: "way_title",
      kind: "text",
      label: "Heading",
      section: "The way",
      placeholder: "Follow the route, stop by stop",
    },
    {
      name: "way_subtitle",
      kind: "textarea",
      label: "Introduction",
      section: "The way",
      rows: 3,
      help: "Shown under the heading. Leave empty to hide it.",
    },
    {
      name: "way_footnote",
      kind: "textarea",
      label: "Small print under the route",
      section: "The way",
      rows: 3,
      help: "Leave empty to hide it.",
    },
    {
      name: "way_day_label",
      kind: "text",
      label: "Label — day",
      section: "The way",
      placeholder: "Day",
      help: "Marks where each day of the itinerary begins, as in “Day 3”.",
    },
    {
      name: "way_high_point_label",
      kind: "text",
      label: "Label — highest point",
      section: "The way",
      placeholder: "Highest point",
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
