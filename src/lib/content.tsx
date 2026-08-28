/**
 * Shared content context.
 *
 * The root route loads the content every page needs — site settings, tours,
 * destinations, films, FAQs and testimonials — and provides it here so the
 * header, footer and shared sections read from the database without each one
 * running its own query.
 *
 * The default value is the bundled snapshot, so a component rendered outside the
 * provider (tests, isolated stories) still has sensible content.
 */

import { createContext, useContext, type ReactNode } from "react";
import { fallbackSiteSettings, type SharedContent } from "@/data/queries";
import { destinations, faqs, testimonials, tours } from "@/data/tours";
import { videos } from "@/data/videos";
import { allPhotos, type Photo, type PhotoKey } from "@/data/photos";
import { whatsappLink } from "@/data/site";

const fallbackContent: SharedContent = {
  site: fallbackSiteSettings,
  tours,
  destinations,
  videos,
  photos: allPhotos,
  faqs,
  testimonials,
};

const ContentContext = createContext<SharedContent>(fallbackContent);

export function ContentProvider({
  content,
  children,
}: {
  content: SharedContent;
  children: ReactNode;
}) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}

export function useSite() {
  return useContent().site;
}

export function useTours() {
  return useContent().tours;
}

export function useDestinations() {
  return useContent().destinations;
}

export function useFaqs() {
  return useContent().faqs;
}

export function useTestimonials() {
  return useContent().testimonials;
}

export function useVideos() {
  return useContent().videos;
}

/**
 * A registered photo, as stored in the database. Keys are checked at compile
 * time against the bundled registry, and an unknown row falls back to it.
 */
export function usePhoto(key: PhotoKey): Photo {
  const photos = useContent().photos;
  return photos[key] ?? allPhotos[key];
}

/** WhatsApp link to the primary number, using the message stored in the database. */
export function useWhatsappLink(message?: string) {
  const site = useSite();
  return whatsappLink(site.primaryPhone, message ?? site.whatsappMessage);
}
