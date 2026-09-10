import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { ContentProvider } from "@/lib/content";
import { fetchSharedContent } from "@/data/queries";
import { absoluteUrl, DEFAULT_SOCIAL_IMAGE, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  /**
   * Content the header, footer and shared sections need on every page. Loaded
   * once here and handed down through ContentProvider, so a row edited in
   * Supabase changes the whole site.
   */
  loader: () => fetchSharedContent(),
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Trip Zone Travel & Tours — Nepal Tour Packages" },
      {
        name: "description",
        content:
          "Nepal tour packages to Manang, Muktinath, Kalinchowk, Halesi and Pathivara with comfortable Jeep, Car, Bus and EV Van transport. Koteshwor, Kathmandu.",
      },
      { name: "author", content: "Trip Zone Travel & Tours Pvt. Ltd." },
      { property: "og:site_name", content: "Trip Zone Travel & Tours" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: absoluteUrl(DEFAULT_SOCIAL_IMAGE) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#153b4a" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Every hero is now a first-party photo, so nothing on the LCP path is
      // cross-origin. The gallery grid still hotlinks Unsplash though, and
      // warming DNS + TLS here is cheaper than paying for it on that route.
      { rel: "preconnect", href: "https://images.unsplash.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
    // websiteJsonLd does not depend on the loader, so it stays outside the
    // branch and still identifies the site if the settings fetch fails.
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd()),
      },
      ...(loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(organizationJsonLd(loaderData.site)),
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const content = Route.useLoaderData();

  // The admin area is a workspace, not a page of the website: it brings its own
  // sidebar and must not sit inside the public header, footer and WhatsApp
  // button. Toasts stay — the editors use them to confirm saves.
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <QueryClientProvider client={queryClient}>
      <ContentProvider content={content}>
        {isAdmin ? (
          <Outlet />
        ) : (
          <>
            <a
              href="#main"
              className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-lg bg-card px-4 py-2 text-sm font-bold text-ink shadow-panel transition-transform focus:translate-y-0"
            >
              Skip to main content
            </a>
            <Header />
            <main id="main">
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
          </>
        )}
        <Toaster position="top-center" />
      </ContentProvider>
    </QueryClientProvider>
  );
}
