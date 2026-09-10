import { createFileRoute } from "@tanstack/react-router";
import { fetchBlogs, fetchTours } from "@/data/queries";
import { absoluteUrl } from "@/lib/seo";

const staticPages = [
  "/",
  "/tours",
  "/destinations",
  "/gallery",
  "/blogs",
  "/about",
  "/services",
  "/contact",
];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sitemapEntry(path: string, lastModified?: string, images: string[] = []) {
  return [
    "  <url>",
    `    <loc>${escapeXml(absoluteUrl(path))}</loc>`,
    ...(lastModified ? [`    <lastmod>${escapeXml(lastModified)}</lastmod>`] : []),
    ...images.flatMap((image) => [
      "    <image:image>",
      `      <image:loc>${escapeXml(absoluteUrl(image))}</image:loc>`,
      "    </image:image>",
    ]),
    "  </url>",
  ].join("\n");
}

/**
 * Image sitemap entries are only emitted for first-party assets. Tour and blog
 * records are editable from the admin panel, so a cross-domain image can still
 * appear here; those need Search Console cross-submission verification on the
 * hosting domain, which we do not have, so submitting them would just produce
 * warnings.
 *
 * `image:loc` is the only child element Google still reads - title, caption,
 * license and geo_location were all dropped in 2022.
 */
function firstPartyImages(...candidates: (string | undefined)[]) {
  return candidates.filter((image): image is string => !!image && !/^https?:\/\//i.test(image));
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [tours, blogs] = await Promise.all([fetchTours(), fetchBlogs()]);
        const entries = [
          ...staticPages.map((path) => sitemapEntry(path)),
          ...tours.map((tour) =>
            sitemapEntry(`/tours/${tour.slug}`, undefined, firstPartyImages(tour.image)),
          ),
          ...blogs.map((blog) => {
            const date = new Date(blog.publishedAt);
            const lastModified = Number.isNaN(date.valueOf())
              ? undefined
              : date.toISOString().slice(0, 10);
            return sitemapEntry(`/blogs/${blog.slug}`, lastModified, firstPartyImages(blog.image));
          }),
        ];

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join("\n")}\n</urlset>`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600, s-maxage=86400",
            },
          },
        );
      },
    },
  },
});
