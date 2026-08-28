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

function sitemapEntry(path: string, lastModified?: string) {
  return [
    "  <url>",
    `    <loc>${escapeXml(absoluteUrl(path))}</loc>`,
    ...(lastModified ? [`    <lastmod>${escapeXml(lastModified)}</lastmod>`] : []),
    "  </url>",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [tours, blogs] = await Promise.all([fetchTours(), fetchBlogs()]);
        const entries = [
          ...staticPages.map((path) => sitemapEntry(path)),
          ...tours.map((tour) => sitemapEntry(`/tours/${tour.slug}`)),
          ...blogs.map((blog) => {
            const date = new Date(blog.publishedAt);
            const lastModified = Number.isNaN(date.valueOf())
              ? undefined
              : date.toISOString().slice(0, 10);
            return sitemapEntry(`/blogs/${blog.slug}`, lastModified);
          }),
        ];

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`,
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
