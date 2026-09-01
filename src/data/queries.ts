/**
 * Content queries.
 *
 * Every page reads its content through this module. Rows come from Supabase and
 * are mapped onto the same types the components already use, so editing a row in
 * the Supabase dashboard changes the live site.
 *
 * If the database is unreachable or not configured, each query falls back to the
 * bundled snapshot in the other src/data files. The site stays up; it just stops
 * reflecting edits until the database answers again.
 */

import { reportQueryFailure, supabase } from "@/lib/supabase";
import {
  destinations as fallbackDestinations,
  faqs as fallbackFaqs,
  testimonials as fallbackTestimonials,
  tours as fallbackTours,
  type Destination,
  type ItineraryDay,
  type PriceOption,
  type Tour,
} from "./tours";
import { blogs as fallbackBlogs, type BlogPost, type BlogSection } from "./blogs";
import { galleryItems as fallbackGallery, type GalleryItem } from "./gallery";
import { videoSource, videos as fallbackVideos, type Video } from "./videos";
import { allPhotos as fallbackPhotos, type Photo, type PhotoKey } from "./photos";
import {
  getTourViews,
  tourViewCopy,
  tourViews,
  type TourView,
  type TourViewCopy,
} from "./tour-views";
import { tourWayCopy, type TourWayCopy } from "./tour-way";
import { site as fallbackSite } from "./site";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";

export type SiteSettings = {
  name: string;
  shortName: string;
  tagline: string;
  address: string;
  phones: string[];
  /** First phone number, guaranteed present — used for call and WhatsApp links. */
  primaryPhone: string;
  socials: { label: string; url: string }[];
  whatsappMessage: string;
  /** Wording of the "Places & mountain views" section on every tour page. */
  viewsSection: TourViewCopy;
  /** Wording of the route section on every tour page. */
  waySection: TourWayCopy;
};

export type Faq = { q: string; a: string };
export type Testimonial = { name: string; location: string; tour: string; quote: string };

/** Photos by key, as stored in the `photos` table. */
export type PhotoMap = Record<string, Photo>;

/** The content every page needs — fetched once by the root route. */
export type SharedContent = {
  site: SiteSettings;
  tours: Tour[];
  destinations: Destination[];
  videos: Video[];
  photos: PhotoMap;
  faqs: Faq[];
  testimonials: Testimonial[];
};

// --------------------------------------------------------------------- helpers

const FALLBACK_WHATSAPP_MESSAGE =
  "Hello Trip Zone, I would like to know more about your Nepal tour packages.";

export const fallbackSiteSettings: SiteSettings = {
  name: fallbackSite.name,
  shortName: fallbackSite.shortName,
  tagline: fallbackSite.tagline,
  address: fallbackSite.address,
  phones: [...fallbackSite.phones],
  primaryPhone: fallbackSite.phones[0],
  socials: [...fallbackSite.socials],
  whatsappMessage: FALLBACK_WHATSAPP_MESSAGE,
  viewsSection: tourViewCopy,
  waySection: tourWayCopy,
};

/** Runs a query, falling back to the bundled snapshot on any failure. */
async function withFallback<T>(what: string, fallback: T, run: () => Promise<T>): Promise<T> {
  if (!supabase) return fallback;
  try {
    return await run();
  } catch (error) {
    reportQueryFailure(what, error);
    return fallback;
  }
}

/** Turns a PostgREST error into a throw so `withFallback` can catch it. */
function unwrap<T>(result: { data: T | null; error: { message: string } | null }): NonNullable<T> {
  if (result.error) throw new Error(result.error.message);
  if (result.data === null) throw new Error("no rows returned");
  return result.data as NonNullable<T>;
}

/**
 * Reads a `jsonb` array column. A value written double-encoded (a JSON string
 * holding an array) is parsed rather than crashing the page that renders it.
 */
function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

// ----------------------------------------------------------------- row mappers

type TourViewRow = {
  title: string;
  place: string;
  elevation: string;
  mountain_name: string;
  mountain_elevation: string;
  description: string;
  image: string;
  image_alt: string;
  photo_note: string;
  credit: string;
  credit_url: string;
  sort_order: number;
};

type TourRow = {
  slug: string;
  name: string;
  region: string;
  duration: string;
  nights: number;
  days: number;
  type: Tour["type"];
  summary: string;
  overview: string;
  image: string;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  travel_notes: string[] | null;
  tour_prices: { transport: string; price: number; note: string | null; sort_order: number }[];
  tour_itinerary: { day: number; route: string }[];
  /** Only present on the detail select. */
  tour_views?: TourViewRow[];
};

function mapTourView(row: TourViewRow): TourView {
  return {
    title: row.title,
    place: row.place,
    elevation: row.elevation,
    mountainName: row.mountain_name,
    mountainElevation: row.mountain_elevation,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    ...(row.photo_note ? { photoNote: row.photo_note } : {}),
    // Most of these photographs are CC BY-SA, which the licence requires us to
    // credit wherever the photograph is shown.
    ...(row.credit ? { credit: row.credit } : {}),
    ...(row.credit_url ? { creditUrl: row.credit_url } : {}),
  };
}

function mapTour(row: TourRow): Tour {
  const prices: PriceOption[] = [...row.tour_prices]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) =>
      p.note
        ? { transport: p.transport, price: p.price, note: p.note }
        : { transport: p.transport, price: p.price },
    );

  const itinerary: ItineraryDay[] = [...row.tour_itinerary]
    .sort((a, b) => a.day - b.day)
    .map((d) => ({ day: d.day, route: d.route }));

  // Only the detail select asks for the view photographs.
  const views = row.tour_views
    ? [...row.tour_views].sort((a, b) => a.sort_order - b.sort_order).map(mapTourView)
    : undefined;

  return {
    slug: row.slug,
    name: row.name,
    region: row.region,
    duration: row.duration,
    nights: row.nights,
    days: row.days,
    type: row.type,
    summary: row.summary,
    overview: row.overview,
    image: row.image,
    prices,
    highlights: row.highlights ?? [],
    itinerary,
    included: row.included ?? [],
    excluded: row.excluded ?? [],
    travelNotes: row.travel_notes ?? [],
    ...(views ? { views } : {}),
  };
}

const TOUR_SELECT =
  "slug, name, region, duration, nights, days, type, summary, overview, image, highlights, included, excluded, travel_notes, tour_prices(transport, price, note, sort_order), tour_itinerary(day, route)";

/**
 * The detail page also needs the view photographs. They are deliberately left
 * out of `TOUR_SELECT` so the list pages — and the shared content every page
 * loads — do not carry ten photo records per tour.
 */
const TOUR_DETAIL_SELECT = `${TOUR_SELECT}, tour_views(title, place, elevation, mountain_name, mountain_elevation, description, image, image_alt, photo_note, credit, credit_url, sort_order)`;

type BlogRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  location: string;
  image: string;
  published_at: string;
  read_time: string;
  introduction: string;
  sections: BlogSection[] | null;
};

const blogDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function mapBlog(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    location: row.location,
    image: row.image,
    publishedAt: blogDate.format(new Date(`${row.published_at}T00:00:00Z`)),
    readTime: row.read_time,
    introduction: row.introduction,
    sections: asArray<BlogSection>(row.sections).map((s) =>
      s.bullets?.length
        ? { heading: s.heading, paragraphs: s.paragraphs, bullets: s.bullets }
        : { heading: s.heading, paragraphs: s.paragraphs },
    ),
  };
}

const BLOG_SELECT =
  "slug, title, excerpt, category, location, image, published_at, read_time, introduction, sections";

// --------------------------------------------------------------------- queries

type SiteSettingsRow = {
  name: string;
  short_name: string;
  tagline: string;
  address: string;
  phones: string[] | null;
  socials: { label: string; url: string }[] | null;
  whatsapp_message: string | null;
  views_eyebrow: string | null;
  views_title: string | null;
  views_subtitle: string | null;
  views_footnote: string | null;
  views_elevation_label: string | null;
  views_mountain_label: string | null;
  views_note_label: string | null;
  views_note_text: string | null;
  way_eyebrow: string | null;
  way_title: string | null;
  way_subtitle: string | null;
  way_footnote: string | null;
  way_day_label: string | null;
  way_high_point_label: string | null;
};

const SITE_SETTINGS_SELECT =
  "name, short_name, tagline, address, phones, socials, whatsapp_message, views_eyebrow, views_title, views_subtitle, views_footnote, views_elevation_label, views_mountain_label, views_note_label, views_note_text, way_eyebrow, way_title, way_subtitle, way_footnote, way_day_label, way_high_point_label";

/**
 * The heading and the three detail labels fall back when blank — the section
 * cannot render without them. The eyebrow, intro, small print and shared note
 * are taken as stored, so clearing one in /admin hides that line.
 */
function mapViewsSection(row: SiteSettingsRow): TourViewCopy {
  return {
    eyebrow: row.views_eyebrow ?? tourViewCopy.eyebrow,
    title: row.views_title || tourViewCopy.title,
    subtitle: row.views_subtitle ?? tourViewCopy.subtitle,
    footnote: row.views_footnote ?? tourViewCopy.footnote,
    elevationLabel: row.views_elevation_label || tourViewCopy.elevationLabel,
    mountainLabel: row.views_mountain_label || tourViewCopy.mountainLabel,
    noteLabel: row.views_note_label || tourViewCopy.noteLabel,
    noteText: row.views_note_text ?? tourViewCopy.noteText,
  };
}

/** Same rule for the route section: headings and labels fall back, prose does not. */
function mapWaySection(row: SiteSettingsRow): TourWayCopy {
  return {
    eyebrow: row.way_eyebrow ?? tourWayCopy.eyebrow,
    title: row.way_title || tourWayCopy.title,
    subtitle: row.way_subtitle ?? tourWayCopy.subtitle,
    footnote: row.way_footnote ?? tourWayCopy.footnote,
    dayLabel: row.way_day_label || tourWayCopy.dayLabel,
    highPointLabel: row.way_high_point_label || tourWayCopy.highPointLabel,
  };
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  return withFallback("Site settings", fallbackSiteSettings, async () => {
    const { data, error } = await supabase!
      .from("site_settings")
      .select(SITE_SETTINGS_SELECT)
      .eq("id", 1)
      .single();
    if (error) throw new Error(error.message);
    const row = data as SiteSettingsRow | null;
    if (!row) throw new Error("no site_settings row");

    const phones = row.phones?.length ? row.phones : fallbackSiteSettings.phones;
    return {
      name: row.name,
      shortName: row.short_name,
      tagline: row.tagline,
      address: row.address,
      phones,
      primaryPhone: phones[0] ?? fallbackSiteSettings.primaryPhone,
      socials: asArray<{ label: string; url: string }>(row.socials)
        .map((social) => ({
          label: social.label.trim(),
          url: normalizeExternalUrl(social.url),
        }))
        .filter((social) => social.label && isValidExternalUrl(social.url)),
      whatsappMessage: row.whatsapp_message || FALLBACK_WHATSAPP_MESSAGE,
      viewsSection: mapViewsSection(row),
      waySection: mapWaySection(row),
    };
  });
}

export async function fetchTours(): Promise<Tour[]> {
  return withFallback("Tours", fallbackTours, async () => {
    const rows = unwrap(
      await supabase!.from("tours").select(TOUR_SELECT).order("sort_order", { ascending: true }),
    ) as TourRow[];
    return rows.length > 0 ? rows.map(mapTour) : fallbackTours;
  });
}

export async function fetchTour(slug: string): Promise<Tour | undefined> {
  const bundled = fallbackTours.find((t) => t.slug === slug);
  // The bundled tour carries no views, so the snapshot supplies them: an
  // unreachable database still renders the section. A reachable one is the only
  // source of truth, so deleting a tour's views in /admin hides the section.
  const fallback = bundled ? { ...bundled, views: getTourViews(slug) } : undefined;
  return withFallback(`Tour "${slug}"`, fallback, async () => {
    const { data, error } = await supabase!
      .from("tours")
      .select(TOUR_DETAIL_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapTour(data as TourRow) : undefined;
  });
}

export async function fetchDestinations(): Promise<Destination[]> {
  return withFallback("Destinations", fallbackDestinations, async () => {
    const rows = unwrap(
      await supabase!
        .from("destinations")
        .select("slug, name, description, image, tour_slug")
        .order("sort_order", { ascending: true }),
    );
    if (rows.length === 0) return fallbackDestinations;
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description,
      image: row.image,
      ...(row.tour_slug ? { tour: row.tour_slug } : {}),
    }));
  });
}

export async function fetchVideos(): Promise<Video[]> {
  return withFallback("Videos", fallbackVideos, async () => {
    const rows = unwrap(
      await supabase!
        .from("videos")
        .select("key, title, src, poster_src, poster_alt, tour_slugs")
        .order("sort_order", { ascending: true }),
    );
    if (rows.length === 0) return fallbackVideos;
    return rows.map((row) => ({
      key: row.key,
      title: row.title,
      src: videoSource(row.src),
      posterSrc: row.poster_src,
      posterAlt: row.poster_alt ?? "",
      tours: row.tour_slugs ?? [],
    }));
  });
}

/** Every registered photo, keyed. Missing keys fall back to the bundled photo. */
export async function fetchPhotos(): Promise<PhotoMap> {
  return withFallback("Photos", fallbackPhotos as PhotoMap, async () => {
    const rows = unwrap(await supabase!.from("photos").select("key, src, alt, position"));
    if (rows.length === 0) return fallbackPhotos as PhotoMap;
    const map: PhotoMap = { ...fallbackPhotos };
    for (const row of rows) {
      map[row.key] = {
        src: row.src,
        alt: row.alt,
        ...(row.position ? { position: row.position } : {}),
      };
    }
    return map;
  });
}

const fallbackViewGallery: GalleryItem[] = Object.values(tourViews).flatMap((views) =>
  views.map((view) => ({
    title: view.title,
    place: view.place,
    category: view.mountainName || "Tour view",
    image: view.image,
    imageAlt: view.imageAlt,
    ...(view.credit ? { credit: view.credit } : {}),
    ...(view.creditUrl ? { creditUrl: view.creditUrl } : {}),
  })),
);

function mergeGalleryItems(...groups: GalleryItem[][]): GalleryItem[] {
  const seen = new Set<string>();
  return groups.flat().filter((item) => {
    if (!item.image || seen.has(item.image)) return false;
    seen.add(item.image);
    return true;
  });
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const fallback = mergeGalleryItems(fallbackGallery, fallbackViewGallery);
  return withFallback("Gallery", fallback, async () => {
    const [galleryResult, viewResult] = await Promise.all([
      supabase!
        .from("gallery_items")
        .select("title, place, category, image, size_class")
        .order("sort_order", { ascending: true }),
      supabase!
        .from("tour_views")
        .select("title, place, mountain_name, image, image_alt, credit, credit_url, sort_order")
        .order("sort_order", { ascending: true }),
    ]);

    const galleryRows = unwrap(galleryResult);
    const viewRows = unwrap(viewResult);
    const gallery = galleryRows.map((row) => ({
      title: row.title,
      place: row.place,
      category: row.category,
      image: row.image,
      ...(row.size_class ? { size: row.size_class } : {}),
    }));
    const viewGallery = viewRows.map((row) => ({
      title: row.title,
      place: row.place,
      category: row.mountain_name || "Tour view",
      image: row.image,
      imageAlt: row.image_alt,
      ...(row.credit ? { credit: row.credit } : {}),
      ...(row.credit_url ? { creditUrl: row.credit_url } : {}),
    }));

    return mergeGalleryItems(
      gallery.length > 0 ? gallery : fallbackGallery,
      viewGallery.length > 0 ? viewGallery : fallbackViewGallery,
    );
  });
}

export async function fetchBlogs(): Promise<BlogPost[]> {
  return withFallback("Blogs", fallbackBlogs, async () => {
    const rows = unwrap(
      await supabase!.from("blogs").select(BLOG_SELECT).order("published_at", { ascending: false }),
    ) as BlogRow[];
    return rows.length > 0 ? rows.map(mapBlog) : fallbackBlogs;
  });
}

export async function fetchBlog(slug: string): Promise<BlogPost | undefined> {
  const fallback = fallbackBlogs.find((b) => b.slug === slug);
  return withFallback(`Blog "${slug}"`, fallback, async () => {
    const { data, error } = await supabase!
      .from("blogs")
      .select(BLOG_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapBlog(data as BlogRow) : undefined;
  });
}

export async function fetchFaqs(): Promise<Faq[]> {
  return withFallback("FAQs", fallbackFaqs, async () => {
    const rows = unwrap(
      await supabase!
        .from("faqs")
        .select("question, answer")
        .order("sort_order", { ascending: true }),
    );
    if (rows.length === 0) return fallbackFaqs;
    return rows.map((row) => ({ q: row.question, a: row.answer }));
  });
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return withFallback("Testimonials", fallbackTestimonials, async () => {
    const rows = unwrap(
      await supabase!
        .from("testimonials")
        .select("name, location, tour, quote")
        .order("sort_order", { ascending: true }),
    );
    if (rows.length === 0) return fallbackTestimonials;
    return rows.map((row) => ({
      name: row.name,
      location: row.location,
      tour: row.tour,
      quote: row.quote,
    }));
  });
}

/** Everything the header, footer and shared sections need, in one round of queries. */
export async function fetchSharedContent(): Promise<SharedContent> {
  const [site, tours, destinations, videos, photos, faqs, testimonials] = await Promise.all([
    fetchSiteSettings(),
    fetchTours(),
    fetchDestinations(),
    fetchVideos(),
    fetchPhotos(),
    fetchFaqs(),
    fetchTestimonials(),
  ]);
  return { site, tours, destinations, videos, photos, faqs, testimonials };
}

/** Type-safe key list for `usePhoto`. */
export type { PhotoKey };

// ------------------------------------------------------------------- inquiries

export type InquiryInput = {
  name: string;
  phone: string;
  email?: string;
  destination?: string;
  travelDate?: string;
  travelers?: number;
  message: string;
  tourSlug?: string;
  travelTime?: string;
  pickupLocation?: string;
  vehicleName?: string;
  vehicleImage?: string;
  fareLabel?: string;
  quotedPrice?: number;
  source?: "website" | "vehicle-booking";
};

/**
 * Stores a contact form submission. Visitors can insert but never read these
 * rows, and `status`/`source` are fixed by the row level security policy.
 */
export async function submitInquiry(input: InquiryInput): Promise<void> {
  if (!supabase) throw new Error("The inquiry database is not configured.");
  const payload = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    destination: input.destination || null,
    travel_date: input.travelDate || null,
    travelers: input.travelers ?? null,
    message: input.message.trim(),
    tour_slug: input.tourSlug || null,
    travel_time: input.travelTime || null,
    pickup_location: input.pickupLocation?.trim() || null,
    vehicle_name: input.vehicleName?.trim() || null,
    vehicle_image: input.vehicleImage || null,
    fare_label: input.fareLabel?.trim() || null,
    quoted_price: input.quotedPrice ?? null,
    status: "new",
    source: input.source ?? "website",
  };
  const { error } = await supabase.from("inquiries").insert(payload);
  if (!error) return;

  // A deployment can receive bookings before the additive SQL migration has
  // been applied. Preserve the lead in the original schema as a temporary
  // fallback; the structured fields will be used automatically once migrated.
  if (input.source === "vehicle-booking") {
    const legacyMessage = [
      input.message.trim(),
      input.vehicleImage ? `Vehicle photo: ${input.vehicleImage}` : "",
      input.vehicleName ? `Vehicle: ${input.vehicleName}` : "",
      input.fareLabel ? `Fare: ${input.fareLabel}` : "",
      input.quotedPrice !== undefined ? `Quoted price: NPR ${input.quotedPrice}` : "",
      input.travelTime ? `Time: ${input.travelTime}` : "",
      input.pickupLocation ? `Pickup: ${input.pickupLocation}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const legacy = await supabase.from("inquiries").insert({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      destination: input.destination || null,
      travel_date: input.travelDate || null,
      travelers: input.travelers ?? null,
      message: legacyMessage.slice(0, 4000),
      tour_slug: input.tourSlug || null,
      status: "new",
      source: "website",
    });
    if (!legacy.error) return;
  }
  throw new Error(error.message);
}
