/**
 * Field descriptions for the admin editors.
 *
 * A collection page declares its columns as data and the editor renders the
 * right control for each one, so adding a field to a table means adding one
 * line here rather than writing another form.
 */

export type Field = {
  /** Column name in the table. */
  name: string;
  label: string;
  help?: string;
  /** Optional heading used to group related controls in longer forms. */
  section?: string;
  /** Widen a control to the full form width. */
  wide?: boolean;
} & (
  | { kind: "text"; placeholder?: string }
  | { kind: "textarea"; rows?: number }
  | { kind: "number"; min?: number; max?: number }
  | { kind: "date" }
  | { kind: "switch" }
  | { kind: "select"; options: readonly string[] }
  | { kind: "image" }
  | { kind: "video" }
  | { kind: "stringList"; placeholder?: string }
  | { kind: "tourSlugs" }
  | { kind: "linkList" }
  | { kind: "sections" }
  | { kind: "prices" }
  | { kind: "itinerary" }
  | { kind: "views" }
);

export type Link = { label: string; url: string };
export type Section = { heading: string; paragraphs: string[]; bullets?: string[] };
export type Price = { transport: string; price: number; note: string | null };
export type Day = { day: number; route: string };

/** A photograph in the "Places & mountain views" section of a tour page. */
export type View = {
  title: string;
  place: string;
  elevation: string;
  mountainName: string;
  mountainElevation: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Blank means "use the shared photo note from /admin/settings". */
  photoNote: string;
  /**
   * Photographer and licence, filled in by scripts/media/fetch-view-photos.mjs
   * for photographs taken from Wikimedia Commons. Blank for an uploaded photo.
   */
  credit: string;
  /** Page the credit links to. */
  creditUrl: string;
};

/** `jsonb` and `text[]` columns can come back as a JSON string; accept both. */
function parsed(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function asText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function asNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function asBool(value: unknown): boolean {
  return value === true || value === "true";
}

export function asStringList(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : parsed(value);
  return Array.isArray(raw) ? raw.map(asText) : [];
}

export function asLinkList(value: unknown): Link[] {
  const raw = Array.isArray(value) ? value : parsed(value);
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    return { label: asText(entry["label"]), url: asText(entry["url"]) };
  });
}

export function asSections(value: unknown): Section[] {
  const raw = Array.isArray(value) ? value : parsed(value);
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    const bullets = asStringList(entry["bullets"]);
    return {
      heading: asText(entry["heading"]),
      paragraphs: asStringList(entry["paragraphs"]),
      ...(bullets.length > 0 ? { bullets } : {}),
    };
  });
}

export function asPrices(value: unknown): Price[] {
  const raw = Array.isArray(value) ? value : parsed(value);
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const entry = (item ?? {}) as Record<string, unknown>;
      return {
        transport: asText(entry["transport"]),
        price: asNumber(entry["price"]),
        note: entry["note"] === null || entry["note"] === undefined ? null : asText(entry["note"]),
        sort: asNumber(entry["sort_order"]),
      };
    })
    .sort((a, b) => a.sort - b.sort)
    .map(({ transport, price, note }) => ({ transport, price, note }));
}

export function asDays(value: unknown): Day[] {
  const raw = Array.isArray(value) ? value : parsed(value);
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const entry = (item ?? {}) as Record<string, unknown>;
      return { day: asNumber(entry["day"]), route: asText(entry["route"]) };
    })
    .sort((a, b) => a.day - b.day);
}

/**
 * Reads a tour's view rows. Both the snake_case column names and the camelCase
 * names this function emits are accepted, so re-reading a draft the editor has
 * already touched keeps the renamed columns instead of blanking them.
 */
export function asViews(value: unknown): View[] {
  const raw = Array.isArray(value) ? value : parsed(value);
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const entry = (item ?? {}) as Record<string, unknown>;
      const either = (camel: string, snake: string) => asText(entry[camel] ?? entry[snake]);
      return {
        title: asText(entry["title"]),
        place: asText(entry["place"]),
        elevation: asText(entry["elevation"]),
        mountainName: either("mountainName", "mountain_name"),
        mountainElevation: either("mountainElevation", "mountain_elevation"),
        description: asText(entry["description"]),
        image: asText(entry["image"]),
        imageAlt: either("imageAlt", "image_alt"),
        photoNote: either("photoNote", "photo_note"),
        credit: asText(entry["credit"]),
        creditUrl: either("creditUrl", "credit_url"),
        sort: asNumber(entry["sort_order"]),
      };
    })
    .sort((a, b) => a.sort - b.sort)
    .map(({ sort, ...view }) => view);
}

/** Moves an item without mutating the original array. */
export function moved<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item === undefined) return items;
  next.splice(to, 0, item);
  return next;
}

/** "Kalinchowk & Sailung Tour" -> "kalinchowk-sailung-tour" */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
