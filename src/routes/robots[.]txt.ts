import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";

/**
 * Served from a route rather than `public/robots.txt` so the `Sitemap:` line
 * follows `VITE_SITE_URL` like every other absolute URL on the site. A static
 * file has to hardcode one origin, which is wrong on every preview deployment
 * and silently wrong if the production domain ever changes.
 *
 * `Disallow: /admin` is a prefix match, so it also covers `/admin/*`.
 */
const LINES = ["User-agent: *", "Allow: /", "Disallow: /admin"];

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(`${[...LINES, "", `Sitemap: ${absoluteUrl("/sitemap.xml")}`].join("\n")}\n`, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        }),
    },
  },
});
