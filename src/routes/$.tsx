import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { seoHead } from "@/lib/seo";

/**
 * Catch-all for URLs that match no route.
 *
 * The root has a `notFoundComponent`, but the root `head()` is static — it
 * cannot describe a 404, so an unresolvable URL used to be served with the home
 * page's title and no `noindex`. A splat route gets its own `head()`, which is
 * the same mechanism `/tours/$slug` and `/blogs/$slug` already use for a missing
 * record. Rendering title/meta inside the component instead would not work:
 * React 19 hoists them without deduping against what TanStack already emitted,
 * so the page ends up with two <title> tags and crawlers read the wrong one.
 *
 * The loader throws `notFound()` so the response keeps its 404 status. Without
 * it a matched splat route returns 200 and every mistyped URL becomes a soft
 * 404 — Google indexes those as thin duplicates of each other.
 */
export const Route = createFileRoute("/$")({
  loader: () => {
    throw notFound();
  },
  head: () =>
    seoHead({
      title: "Page not found | Trip Zone Travel & Tours",
      description:
        "This page is not available. Browse Nepal tour packages, destinations and travel services from Trip Zone Travel & Tours.",
      // Canonical points at the home page, matching how /tours/$slug and
      // /blogs/$slug canonicalise a missing record to their index. The URL
      // itself has no valid canonical form, and `noindex` is what actually
      // keeps it out of the index.
      path: "/",
      robots: "noindex, follow",
    }),
  component: NotFoundPage,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return (
    <section className="section-y pt-36">
      <div className="container-page text-center">
        <p className="font-display text-7xl font-bold text-primary">404</p>
        <h1 className="display-section mt-4 text-ink">This page isn't available</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The link may be out of date or mistyped. Start from the tour packages, or tell us where
          you want to go and we'll plan the route.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link to="/tours">Browse tour packages</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">Contact Trip Zone</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
