import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TourCard } from "@/components/TourCard";
import { Reveal } from "@/components/Reveal";
import { BookingCTA } from "@/components/BookingCTA";
import { tours } from "@/data/tours";
import { PageHero } from "@/components/PageHero";

type ToursSearch = { destination?: string | undefined; type?: string | undefined };

export const Route = createFileRoute("/tours/")({
  validateSearch: (search: Record<string, unknown>): ToursSearch => ({
    destination:
      typeof search["destination"] === "string" ? (search["destination"] as string) : undefined,
    type: typeof search["type"] === "string" ? (search["type"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nepal Tour Packages & Prices — Trip Zone Travel & Tours" },
      {
        name: "description",
        content:
          "All Trip Zone Nepal tour packages with durations and per-person prices: Manang, Muktinath, Pathivara, Halesi Mahadev and Sailung & Kalinchowk.",
      },
      { property: "og:title", content: "Nepal Tour Packages & Prices — Trip Zone" },
      {
        property: "og:description",
        content: "Handpicked Nepal journeys with transparent per-person pricing by vehicle type.",
      },
    ],
  }),
  component: ToursPage,
});

function ToursPage() {
  const { destination, type } = Route.useSearch();

  const filtered = tours.filter((t) => {
    const byType = !type || t.type === type;
    const byDestination =
      !destination ||
      t.name.toLowerCase().includes(destination.toLowerCase()) ||
      t.region.toLowerCase().includes(destination.toLowerCase()) ||
      t.highlights.some((h) => h.toLowerCase().includes(destination.toLowerCase()));
    return byType && byDestination;
  });

  const results = filtered.length > 0 ? filtered : tours;

  return (
    <>
      <PageHero
        eyebrow="Curated departures"
        title="Nepal Tour Packages"
        subtitle="Every package below shows its real duration and per-person price by vehicle. Dates, group sizes and vehicles can be adjusted on request."
        image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=88"
        imageAlt="Mountain valley road in Nepal"
      >
        <Breadcrumbs tone="light" items={[{ label: "Home", to: "/" }, { label: "Tours" }]} />
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          {filtered.length === 0 ? (
            <div className="hairline mb-10 rounded-2xl bg-secondary/60 p-5 text-sm text-muted-foreground">
              No package matches that search yet — showing all {tours.length} Trip Zone packages
              instead. Message us and we'll arrange a custom itinerary.
            </div>
          ) : null}
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tour, i) => (
              <Reveal key={tour.slug} delay={i * 80}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}
