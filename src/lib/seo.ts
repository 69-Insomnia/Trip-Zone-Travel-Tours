import type { BlogPost } from "@/data/blogs";
import type { Tour } from "@/data/tours";

const configuredSiteUrl = (import.meta.env["VITE_SITE_URL"] as string | undefined)?.trim();

export const SITE_URL = (configuredSiteUrl || "https://tripzonetravelandtours.com").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "Trip Zone Travel & Tours";
export const CONTACT_EMAIL = "chamlingsubash55@gmail.com";

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, `${SITE_URL}/`).href;
}

/**
 * Default social card. Must stay at or above 1200x630 and reasonably close to
 * 1.91:1 - every platform crops to that box, so a letterbox panorama (which is
 * what the page heroes are) loses its subject entirely. `manang.jpg` is
 * 1920x1069, the closest asset to that ratio.
 */
export const DEFAULT_SOCIAL_IMAGE = "/photos/manang.jpg";

type SeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  robots?: string;
};

export function seoHead({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  robots,
}: SeoOptions) {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl(image);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonical },
      { property: "og:image", content: socialImage },
      { property: "og:image:alt", content: `${SITE_NAME} - Nepal travel` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: socialImage },
      { name: "twitter:image:alt", content: `${SITE_NAME} - Nepal travel` },
      ...(robots ? [{ name: "robots", content: robots }] : []),
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

/**
 * Normalises an operator-entered Nepali number to E.164. `phones` is editable
 * from the admin panel, so a value may already carry a +977 prefix or a trunk
 * 0 and this has to be idempotent. Length is the only safe discriminator for a
 * duplicated country code: a 10-digit Nepali mobile can itself begin with 977,
 * so stripping on prefix alone would corrupt valid numbers.
 */
function toE164Nepal(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("977")) digits = digits.slice(3);
  return `+977${digits.replace(/^0+/, "")}`;
}

export function organizationJsonLd(site: {
  name: string;
  address: string;
  phones: string[];
  socials: { url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl(DEFAULT_SOCIAL_IMAGE),
    email: CONTACT_EMAIL,
    telephone: site.phones.map(toE164Nepal),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    areaServed: [
      { "@type": "Country", name: "Nepal" },
      { "@type": "Country", name: "India" },
    ],
    sameAs: site.socials.map((social) => social.url),
    // priceRange is a qualitative range indicator, not a currency code. Kept
    // symbolic so it cannot drift out of sync with the tour price data.
    priceRange: "$$",
  };
}

export function tourJsonLd(tour: Tour) {
  const url = absoluteUrl(`/tours/${tour.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "TouristTrip"],
    "@id": `${url}#tour`,
    name: tour.name,
    description: tour.summary,
    image: [absoluteUrl(tour.image)],
    url,
    category: `${tour.type} tour package`,
    touristType: tour.type,
    // Neither Trip nor Product defines `duration`, so the trip length goes in
    // additionalProperty rather than an invented field. The human-readable
    // string is kept alongside the numbers because that is what the page shows.
    additionalProperty: [
      { "@type": "PropertyValue", name: "Duration", value: tour.duration },
      { "@type": "PropertyValue", name: "Days", value: tour.days, unitText: "days" },
      { "@type": "PropertyValue", name: "Nights", value: tour.nights, unitText: "nights" },
      { "@type": "PropertyValue", name: "Region", value: tour.region },
    ],
    // TouristTrip.itinerary ranges over ItemList | Place, so plain strings are
    // discarded by consumers. Emit an ordered ItemList instead.
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.itinerary.length,
      itemListElement: tour.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.day,
        name: `Day ${day.day}: ${day.route}`,
      })),
    },
    provider: { "@id": `${SITE_URL}/#organization` },
    offers: tour.prices.map((option) => ({
      "@type": "Offer",
      name: `${option.transport} package`,
      url,
      price: option.price,
      priceCurrency: "NPR",
      availability: "https://schema.org/InStock",
      seller: { "@id": `${SITE_URL}/#organization` },
      ...(option.note ? { description: option.note } : {}),
    })),
  };
}

export function articleJsonLd(blog: BlogPost) {
  const url = absoluteUrl(`/blogs/${blog.slug}`);
  const published = new Date(blog.publishedAt);
  const publishedIso = Number.isNaN(published.valueOf())
    ? blog.publishedAt
    : published.toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: blog.title,
    description: blog.excerpt,
    image: [absoluteUrl(blog.image)],
    datePublished: publishedIso,
    // BlogPost carries no updatedAt, so the honest floor is "never modified
    // since publication". Add an updatedAt field to the data model if posts
    // start getting edited, otherwise this silently becomes a false claim.
    dateModified: publishedIso,
    mainEntityOfPage: url,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: blog.location,
    articleSection: blog.category,
  };
}

/**
 * Site-level entity. Both Google and the AI crawlers use this to decide what
 * "Trip Zone" refers to and who published a given page, so it is emitted on
 * every route and points at the same #organization node the pages reference.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Blog index. `blogPost` is the documented inverse of BlogPosting.isPartOf. */
export function blogCollectionJsonLd(posts: BlogPost[]) {
  const url = absoluteUrl("/blogs");
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: `${SITE_NAME} travel journal`,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(`/blogs/${post.slug}`)}#article`,
      headline: post.title,
      url: absoluteUrl(`/blogs/${post.slug}`),
    })),
  };
}

/**
 * The services page. Modelled as an ItemList of Service rather than
 * hasOfferCatalog, because the page is a list of what is offered and the list
 * order is what the page shows. No price is asserted: the fares are quoted per
 * route, and inventing a single figure would be a false claim.
 */
export function serviceListJsonLd(services: { title: string; copy: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} travel services`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.copy,
        serviceType: service.title,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Nepal" },
      },
    })),
  };
}

export function tourCollectionJsonLd(tours: Tour[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trip Zone Nepal tour packages",
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tour.name,
      url: absoluteUrl(`/tours/${tour.slug}`),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Must mirror the visible <Breadcrumbs> trail on the same page - Google
 * requires the markup and the rendered trail to correspond. The final crumb is
 * the current page, so it carries no `item`.
 */
export function breadcrumbJsonLd(trail: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: absoluteUrl(crumb.path) } : {}),
    })),
  };
}
