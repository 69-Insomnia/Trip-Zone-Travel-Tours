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
  image = "/photos/hero-annapurna.jpg",
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
      ...(robots ? [{ name: "robots", content: robots }] : []),
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
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
    image: absoluteUrl("/photos/hero-annapurna.jpg"),
    email: CONTACT_EMAIL,
    telephone: site.phones.map((phone) => `+977${phone.replace(/\D/g, "")}`),
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
    priceRange: "NPR",
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
    itinerary: tour.itinerary.map((day) => `Day ${day.day}: ${day.route}`),
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

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: blog.title,
    description: blog.excerpt,
    image: [absoluteUrl(blog.image)],
    datePublished: Number.isNaN(published.valueOf()) ? blog.publishedAt : published.toISOString(),
    mainEntityOfPage: url,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: blog.location,
    articleSection: blog.category,
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
