import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  HeartHandshake,
  Map,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SearchPanel } from "@/components/SearchPanel";
import { TourCard } from "@/components/TourCard";
import { DestinationCard } from "@/components/DestinationCard";
import { SectionHeading } from "@/components/SectionHeading";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BookingCTA } from "@/components/BookingCTA";
import { TravelVideo } from "@/components/TravelVideo";
import { BlogCard } from "@/components/BlogCard";
import { CompanyOverview } from "@/components/CompanyOverview";
import { Reveal } from "@/components/Reveal";
import { fetchBlogs } from "@/data/queries";
import { generalVideos } from "@/data/videos";
import { useDestinations, usePhoto, useTours, useVideos, useWhatsappLink } from "@/lib/content";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => fetchBlogs(),
  head: () =>
    seoHead({
      title: "Trip Zone Travel & Tours | Nepal Tour Packages",
      description:
        "Handpicked Nepal journeys to Manang, Muktinath, Pathivara, Halesi, Sailung, Kalinchowk, Gosaikunda and more with clear prices and comfortable transport.",
      path: "/",
      image: "/photos/hero-annapurna.jpg",
    }),
  component: Index,
});

function Index() {
  const blogs = Route.useLoaderData();
  const featured = useTours();
  const destinations = useDestinations();
  const hero = usePhoto("manang");
  const editorial = usePhoto("manangRoad");
  /** Company films — the per-tour footage lives on each tour page. */
  const generalFilms = generalVideos(useVideos());
  const whatsapp = useWhatsappLink();

  return (
    <>
      <section className="relative isolate z-20 bg-ink lg:min-h-[min(760px,92vh)]">
        <img
          src={hero.src}
          alt={hero.alt}
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,24,38,.95),rgba(8,24,38,.6)_52%,rgba(8,24,38,.12))]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="container-page relative grid items-end gap-8 pb-8 pt-28 sm:gap-10 lg:min-h-[min(760px,92vh)] lg:grid-cols-[1.05fr_.8fr] lg:pb-36 lg:pt-36">
          <div className="max-w-3xl text-primary-foreground">
            <span className="eyebrow text-accent">
              <span className="h-px w-7 bg-current" />
              Nepal, made personal
            </span>
            <h1 className="display-hero mt-5 max-w-3xl">
              Explore Nepal.
              <br />
              <span className="text-accent">Experience the journey.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              Scenic drives, sacred places and mountain air, planned by people who know the roads.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg">
                <Link to="/tours">
                  Explore tours <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  Plan my trip
                </a>
              </Button>
            </div>
          </div>
          {generalFilms.length > 0 ? (
            <div className="pb-1 lg:pb-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground/65">
                Trip Zone journey film
              </p>
              <TravelVideo items={generalFilms} />
            </div>
          ) : null}
        </div>
        <div className="container-page relative z-20 mt-1 pb-2 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:translate-y-1/2 lg:pb-0">
          <SearchPanel />
        </div>
      </section>

      <section className="relative z-10 border-b border-border bg-card">
        <div className="container-page grid divide-y divide-border pb-8 pt-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:pb-9 md:pt-10 lg:pt-32">
          {[
            [String(featured.length), "published tour packages"],
            ["3", "travel styles"],
            ["1:1", "support from first message"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="flex items-center gap-4 px-0 py-4 first:pt-0 last:pb-0 sm:justify-center sm:px-8 sm:py-0"
            >
              <span className="font-display text-3xl font-extrabold text-primary">{value}</span>
              <span className="max-w-[10rem] text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y pt-28 md:pt-36">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Curated journeys"
              title="Popular Nepal tours"
              subtitle="Handpicked routes with clear pricing, comfortable transport and the details you need to plan confidently."
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link to="/tours">
                View all tours <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((tour, i) => (
              <Reveal key={tour.slug} delay={i * 80}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="The Trip Zone difference"
            title="Travel with local confidence"
            subtitle="Thoughtful logistics and genuine Nepal knowledge at every stage of your journey."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                Compass,
                "Local expertise",
                "Experience Nepal through destination knowledge and carefully planned routes.",
              ],
              [
                ShieldCheck,
                "Transparent pricing",
                "See every transport option and per-person price before you book.",
              ],
              [
                HeartHandshake,
                "Personal service",
                "Flexible arrangements for couples, families and groups.",
              ],
              [
                Map,
                "Planned itineraries",
                "Accommodation, meals, transport and sightseeing arranged clearly.",
              ],
              [
                Users,
                "Comfortable transport",
                "Choose Jeep, Scorpio, Car, Bus or EV Van for your route.",
              ],
              [Sparkles, "Easy booking", "Reach our team quickly by phone or WhatsApp."],
            ].map(([Icon, title, copy]) => {
              const I = Icon as typeof Compass;
              return (
                <Reveal key={title as string}>
                  <div className="hairline h-full rounded-xl bg-card p-6 shadow-soft">
                    <I className="size-6 text-primary" />
                    <h3 className="mt-5 font-display text-xl text-ink">{title as string}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {copy as string}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="See more of Nepal"
            title="Destinations worth the detour"
            subtitle="From high valleys and sacred shrines to lakeside towns and preserved hill bazaars."
          />
          <div className="mt-12 grid auto-rows-[190px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.slice(0, 8).map((destination, i) => (
              <Reveal
                key={destination.slug}
                delay={i * 60}
                className={i === 0 || i === 5 ? "sm:row-span-2" : i === 3 ? "lg:col-span-2" : ""}
              >
                <DestinationCard destination={destination} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CompanyOverview />

      <section className="section-y bg-ink">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <img
              src={editorial.src}
              alt={editorial.alt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-xl object-cover"
              width="1280"
              height="960"
            />
          </Reveal>
          <Reveal delay={120}>
            <span className="eyebrow text-accent">
              Mountains. Culture. Spirituality. Adventure.
            </span>
            <h2 className="display-section mt-4 text-primary-foreground">
              A more considered way to see Nepal.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-primary-foreground/72">
              Trip Zone connects you with scenic drives, pilgrimage destinations, mountain
              landscapes and living culture, with a team that knows the roads and the rhythm of
              Nepal.
            </p>
            <Button asChild variant="accent" size="lg" className="mt-8">
              <Link to="/about">
                Meet Trip Zone <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Need to know"
            title="Questions, answered"
            subtitle="A few useful details before you choose your route."
          />
          <FaqAccordion />
        </div>
      </section>
      <section className="section-y bg-surface">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="From the journal"
              title="Useful ideas for the road"
              subtitle="Route notes and practical travel guides from the places we know best."
            />
            <Button asChild variant="outline" className="shrink-0">
              <Link to="/blogs">
                Read all guides <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
