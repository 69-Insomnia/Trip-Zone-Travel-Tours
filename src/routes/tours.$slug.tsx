import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle, Phone, X } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { TourCard } from "@/components/TourCard";
import { BookingCTA } from "@/components/BookingCTA";
import { TravelVideo } from "@/components/TravelVideo";
import { TourViews } from "@/components/TourViews";
import { TourWay } from "@/components/TourWay";
import { tourVideos } from "@/data/videos";
import { formatNpr, startingPrice, type Tour } from "@/data/tours";
import { fetchTour } from "@/data/queries";
import { telLink, whatsappLink } from "@/data/site";
import { useSite, useTours, useVideos } from "@/lib/content";
import { seoHead, tourJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/tours/$slug")({
  loader: async ({ params }) => {
    const tour = await fetchTour(params.slug);
    if (!tour) throw notFound();
    return { tour };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        ...seoHead({
          title: "Tour not found | Trip Zone Travel & Tours",
          description: "Browse all available Nepal tour packages from Trip Zone Travel & Tours.",
          path: "/tours",
          robots: "noindex, follow",
        }),
      };
    }
    const { tour } = loaderData;
    const title = `${tour.name} - ${tour.duration} | Trip Zone Travel & Tours`;
    const description = `${tour.summary} From ${formatNpr(startingPrice(tour))} per person.`;
    return {
      ...seoHead({
        title,
        description,
        path: `/tours/${tour.slug}`,
        image: tour.image,
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(tourJsonLd(tour)),
        },
      ],
    };
  },
  component: TourDetail,
  notFoundComponent: TourNotFound,
});

function TourNotFound() {
  return (
    <section className="section-y pt-36">
      <div className="container-page text-center">
        <h1 className="display-section text-ink">That tour isn't listed</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The package you're looking for may have been renamed. Browse all Trip Zone packages
          instead.
        </p>
        <Button asChild variant="accent" size="lg" className="mt-8">
          <Link to="/tours">View all tours</Link>
        </Button>
      </div>
    </section>
  );
}

function TourDetail() {
  const { tour } = Route.useLoaderData() as { tour: Tour };
  const site = useSite();
  const from = startingPrice(tour);
  const others = useTours()
    .filter((t) => t.slug !== tour.slug)
    .slice(0, 3);
  const films = tourVideos(tour.slug, useVideos());
  const views = tour.views ?? [];
  const waText = `Hello Trip Zone, I'm interested in the ${tour.name} (${tour.duration}). Please share availability.`;
  const bookLink = whatsappLink(site.primaryPhone, waText);

  return (
    <>
      {/* Hero — same two-column layout as the home page: copy left, film right */}
      <section className="relative isolate z-20 overflow-hidden bg-ink lg:min-h-[min(760px,92vh)]">
        <img
          src={tour.image}
          alt={`${tour.name} in ${tour.region}`}
          className="absolute inset-0 size-full object-cover"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,24,38,.95),rgba(8,24,38,.6)_52%,rgba(8,24,38,.12))]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="container-page relative grid items-end gap-8 pb-12 pt-28 sm:gap-10 lg:min-h-[min(760px,92vh)] lg:grid-cols-[1.05fr_.8fr] lg:pb-20 lg:pt-36">
          <div className="max-w-3xl">
            <Breadcrumbs
              tone="light"
              items={[
                { label: "Home", to: "/" },
                { label: "Tours", to: "/tours" },
                { label: tour.name },
              ]}
            />
            <span className="eyebrow mt-6 text-accent">{tour.region}</span>
            <h1 className="display-hero mt-3 max-w-3xl text-primary-foreground">{tour.name}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="text-sm font-semibold text-primary-foreground/85">
                {tour.duration}
              </span>
              <span className="text-sm text-primary-foreground/70">
                Price from{" "}
                <strong className="font-display text-2xl text-accent">{formatNpr(from)}</strong>
                <span className="text-primary-foreground/70"> /person</span>
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <a href={bookLink} target="_blank" rel="noopener noreferrer">
                  Book This Tour
                  <ArrowRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="glass" size="lg">
                <a href={telLink(site.primaryPhone)}>
                  <Phone aria-hidden="true" />
                  {site.primaryPhone}
                </a>
              </Button>
            </div>
          </div>
          {films.length > 0 ? (
            <div className="pb-1 lg:pb-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/65">
                {tour.name} on film
              </p>
              <TravelVideo items={films} />
            </div>
          ) : null}
        </div>
      </section>

      {/* Overview + pricing */}
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <span className="eyebrow">Tour overview</span>
            <h2 className="display-section mt-4 text-ink">About this journey</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {tour.overview}
            </p>

            {tour.highlights.length > 0 ? (
              <div className="mt-10">
                <h3 className="font-display text-xl text-ink">Tour highlights</h3>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {tour.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={120}>
            <aside className="hairline sticky top-24 rounded-xl bg-card p-7 shadow-soft">
              <h3 className="font-display text-lg text-ink">Price per person</h3>
              <ul className="mt-5 space-y-3">
                {tour.prices.map((p, i) => (
                  <li
                    key={`${p.transport}-${i}`}
                    className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      <span className="block font-semibold text-ink">{p.transport}</span>
                      {p.note ? <span className="text-xs">{p.note}</span> : null}
                    </span>
                    <span className="font-display text-lg whitespace-nowrap text-ink">
                      {formatNpr(p.price)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-2">
                <Button asChild variant="whatsapp">
                  <a href={bookLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden="true" />
                    Book on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Send an inquiry</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Duration: {tour.duration}. Prices are as quoted by Trip Zone and may vary with group
                size.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      <TourViews views={views} />

      {/* The route the itinerary below describes, read off it stop by stop */}
      <TourWay itinerary={tour.itinerary} views={views} />

      {/* Itinerary */}
      <section className="section-y bg-surface">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Day by day</span>
            <h2 className="display-section mt-4 text-ink">Itinerary</h2>
          </Reveal>

          {tour.itinerary.length > 0 ? (
            <ol className="relative mt-12 max-w-3xl border-l border-border pl-8 md:pl-12">
              {tour.itinerary.map((d, i) => (
                <Reveal as="li" key={d.day} delay={i * 110} className="relative pb-10 last:pb-0">
                  <span className="absolute top-1.5 -left-[2.3125rem] grid size-7 place-items-center rounded-full bg-primary text-[0.625rem] font-bold text-primary-foreground md:-left-[3.3125rem]">
                    {String(d.day).padStart(2, "0")}
                  </span>
                  <span className="eyebrow">Day {String(d.day).padStart(2, "0")}</span>
                  <p className="mt-2 font-display text-xl text-ink md:text-2xl">{d.route}</p>
                </Reveal>
              ))}
            </ol>
          ) : (
            <div className="hairline mt-10 max-w-2xl rounded-xl bg-card p-6 shadow-soft">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The detailed day-by-day itinerary for this package is available on request — we
                share it exactly as scheduled for your travel dates. Message us on{" "}
                <a
                  href={bookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  WhatsApp
                </a>{" "}
                and we'll send it over.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Included / excluded */}
      <section className="section-y">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="hairline h-full rounded-xl bg-card p-7 shadow-soft">
              <h3 className="font-display text-xl text-ink">Included</h3>
              <ul className="mt-5 space-y-3">
                {tour.included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="hairline h-full rounded-xl bg-secondary/50 p-7">
              <h3 className="font-display text-xl text-ink">Not included</h3>
              {tour.excluded.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {tour.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  The supplied package document does not specify exclusions for this tour. Confirm
                  any personal or entrance expenses with Trip Zone before booking.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {tour.travelNotes?.length ? (
        <section className="pb-20">
          <div className="container-page">
            <Reveal>
              <div className="hairline max-w-4xl rounded-xl bg-surface p-7 md:p-9">
                <span className="eyebrow">Before you travel</span>
                <h2 className="mt-3 font-display text-2xl text-ink">Travel notes</h2>
                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                  {tour.travelNotes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden="true" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Other tours */}
      <section className="pb-20">
        <div className="container-page">
          <h2 className="display-section text-ink">Other Trip Zone journeys</h2>
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((t, i) => (
              <Reveal key={t.slug} delay={i * 80}>
                <TourCard tour={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA
        title={`Ready for ${tour.name}?`}
        subtitle="Tell us your dates and we'll confirm availability."
      />
    </>
  );
}
