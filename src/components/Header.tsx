import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Clock, MapPin, Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { useSite, useTours, useWhatsappLink } from "@/lib/content";
import { cn } from "@/lib/utils";

const desktopNav = [
  { label: "Tours", to: "/tours" },
  { label: "Destinations", to: "/destinations" },
  { label: "Gallery", to: "/gallery" },
  { label: "Blogs", to: "/blogs" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
];

const mobileNav = [{ label: "Home", to: "/" }, ...desktopNav, { label: "Contact", to: "/contact" }];

export function Header() {
  const site = useSite();
  const tours = useTours();
  const whatsapp = useWhatsappLink();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileToursOpen, setMobileToursOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navTone = scrolled
    ? "text-muted-foreground hover:text-ink"
    : "text-primary-foreground/80 hover:text-primary-foreground";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-xl"
          : "bg-gradient-to-b from-ink/55 to-transparent",
      )}
    >
      <div className="container-page">
        <div className="grid h-[4.75rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
            <BrandLogo />
            <span className="min-w-0">
              <span
                className={cn(
                  "block font-display text-base font-extrabold leading-tight",
                  scrolled ? "text-ink" : "text-white",
                )}
              >
                Trip Zone
              </span>
              <span
                className={cn(
                  "block text-[0.58rem] font-extrabold uppercase tracking-[0.2em]",
                  scrolled ? "text-muted-foreground" : "text-white/65",
                )}
              >
                Travel &amp; Tours
              </span>
            </span>
          </Link>

          <nav className="hidden items-center justify-center gap-7 lg:flex" aria-label="Main">
            {desktopNav.map((item) =>
              item.to === "/tours" ? (
                <div key={item.to} className="group relative">
                  <Link
                    to="/tours"
                    aria-haspopup="true"
                    className={cn(
                      "relative flex items-center gap-1 rounded-lg px-3 py-3 text-[0.78rem] font-extrabold transition-all duration-200 after:absolute after:inset-x-3 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform group-hover:bg-white/10 group-hover:after:scale-x-100",
                      navTone,
                    )}
                    activeProps={{ className: "after:scale-x-100" }}
                  >
                    Tours{" "}
                    <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                  </Link>

                  <div className="invisible fixed left-1/2 top-[4.35rem] z-50 w-[min(74rem,calc(100vw-3rem))] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="grid max-h-[min(36rem,calc(100vh-6rem))] grid-cols-[14rem_1fr] overflow-y-auto rounded-xl border border-border bg-card text-ink shadow-panel">
                      <div className="sticky top-0 flex min-h-full flex-col justify-between bg-ink p-5 text-primary-foreground">
                        <div>
                          <span className="text-[0.63rem] font-extrabold uppercase tracking-[0.16em] text-accent">
                            Explore Nepal
                          </span>
                          <p className="mt-3 font-display text-xl font-extrabold leading-tight">
                            Choose a journey that fits your pace.
                          </p>
                          <p className="mt-3 text-xs leading-relaxed text-primary-foreground/65">
                            Mountain roads, pilgrimage routes and short scenic escapes planned from
                            Kathmandu.
                          </p>
                        </div>
                        <Link
                          to="/tours"
                          className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-accent"
                        >
                          All tour packages <ArrowRight className="size-4" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-3 content-start gap-1 p-3">
                        {tours.map((tour) => (
                          <Link
                            key={tour.slug}
                            to="/tours/$slug"
                            params={{ slug: tour.slug }}
                            className="group/item grid min-w-0 grid-cols-[4rem_1fr] items-center gap-2.5 rounded-lg p-2.5 transition-colors hover:bg-secondary"
                          >
                            <img
                              src={tour.image}
                              alt=""
                              className="aspect-[1.25] w-full rounded-md object-cover"
                              loading="lazy"
                              width="80"
                              height="64"
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-extrabold group-hover/item:text-primary">
                                {tour.name}
                              </span>
                              <span className="mt-1 flex items-center gap-1.5 text-[0.62rem] font-semibold text-muted-foreground">
                                <span className="flex min-w-0 items-center gap-1">
                                  <MapPin className="size-3 shrink-0" />
                                  <span className="truncate">{tour.region}</span>
                                </span>
                                <span className="flex shrink-0 items-center gap-1">
                                  <Clock className="size-3" />
                                  {tour.duration}
                                </span>
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-lg px-3 py-3 text-[0.78rem] font-extrabold transition-all duration-200 after:absolute after:inset-x-3 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:bg-white/10 hover:after:scale-x-100",
                    navTone,
                  )}
                  activeProps={{ className: "after:scale-x-100" }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild variant={scrolled ? "ghost" : "glass"} size="icon" className="size-9">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us">
                <MessageCircle />
              </a>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link to="/contact">Plan a trip</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "grid size-11 place-items-center rounded-xl border lg:hidden",
              scrolled || open
                ? "border-border bg-card text-ink"
                : "border-white/25 bg-white/10 text-white backdrop-blur",
            )}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/*
       * Closed state is marked with `inert` alone, deliberately. Tapping a link
       * in this drawer closes it, so on that render the link still holds focus
       * and an `aria-hidden` here would be hiding a focused element from screen
       * readers — the browser blocks that and logs a warning. `inert` covers
       * both jobs: it drops the subtree from the accessibility tree and moves
       * focus out instead of trapping it behind a hidden ancestor.
       */}
      <div
        inert={!open}
        className={cn(
          "overflow-hidden border-b border-border bg-background transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[calc(100vh-4.75rem)] overflow-y-auto opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container-page py-5">
          <nav className="flex flex-col" aria-label="Mobile">
            {mobileNav.map((item) =>
              item.to === "/tours" ? (
                <div key={item.to} className="border-b border-border/70">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/tours"
                      onClick={() => setOpen(false)}
                      className="flex-1 py-3.5 font-display text-lg font-extrabold text-ink"
                    >
                      Tours
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileToursOpen((value) => !value)}
                      className="grid size-10 place-items-center text-ink"
                      aria-expanded={mobileToursOpen}
                      aria-label="Show tour packages"
                    >
                      <ChevronDown
                        className={cn(
                          "size-5 transition-transform",
                          mobileToursOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                  <div
                    inert={!mobileToursOpen}
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows,opacity] duration-300",
                      mobileToursOpen
                        ? "grid-rows-[1fr] pb-3 opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 space-y-1">
                      {tours.map((tour) => (
                        <Link
                          key={tour.slug}
                          to="/tours/$slug"
                          params={{ slug: tour.slug }}
                          onClick={() => setOpen(false)}
                          className="grid grid-cols-[3.5rem_1fr] items-center gap-3 rounded-xl p-2.5 hover:bg-secondary"
                        >
                          <img
                            src={tour.image}
                            alt=""
                            className="aspect-[1.2] w-full rounded-lg object-cover"
                            loading="lazy"
                            width="70"
                            height="58"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-extrabold leading-snug text-ink">
                              {tour.name}
                            </span>
                            <span className="text-[0.68rem] font-semibold text-muted-foreground">
                              {tour.duration}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="rounded-xl border-b border-border/70 px-3 py-3.5 font-display text-lg font-extrabold text-ink transition-colors hover:bg-secondary hover:text-primary last:border-0"
                  activeProps={{ className: "text-primary" }}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button asChild variant="whatsapp">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                WhatsApp {site.primaryPhone}
              </a>
            </Button>
            <Button asChild variant="accent">
              <Link to="/contact" onClick={() => setOpen(false)}>
                Plan a trip
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
