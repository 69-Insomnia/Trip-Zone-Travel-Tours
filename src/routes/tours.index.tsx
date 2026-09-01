import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TourCard } from "@/components/TourCard";
import { Reveal } from "@/components/Reveal";
import { BookingCTA } from "@/components/BookingCTA";
import { PageHero } from "@/components/PageHero";
import { fetchTours } from "@/data/queries";
import { formatNpr, startingPrice, type Tour } from "@/data/tours";
import { breadcrumbJsonLd, faqJsonLd, seoHead, tourCollectionJsonLd } from "@/lib/seo";

type ToursSearch = { destination?: string | undefined; type?: string | undefined };

export const Route = createFileRoute("/tours/")({
  loader: () => fetchTours(),
  validateSearch: (search: Record<string, unknown>): ToursSearch => ({
    destination:
      typeof search["destination"] === "string" ? (search["destination"] as string) : undefined,
    type: typeof search["type"] === "string" ? (search["type"] as string) : undefined,
  }),
  head: ({ loaderData }) => ({
    ...seoHead({
      title: "Nepal Tour Packages & Prices | Trip Zone Travel & Tours",
      description:
        "Compare Nepal tour and trekking packages with durations, itineraries and per-person prices, including Char Dham, Gosaikunda, Aama Yangri and Dhorpatan.",
      path: "/tours",
      image: "/photos/char-dham.jpg",
    }),
    scripts: [
      // Breadcrumbs do not depend on loaderData, so they are emitted even when
      // the tour list fails to load.
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Tours" }]),
        ),
      },
      ...(loaderData
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(tourCollectionJsonLd(loaderData)),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify(faqJsonLd(tourPackageQuestions(loaderData))),
            },
          ]
        : []),
    ],
  }),
  component: ToursPage,
});

function tourPackageQuestions(tours: Tour[]) {
  const prices = tours.map(startingPrice);
  const minimum = prices.length ? Math.min(...prices) : 0;
  const maximum = prices.length ? Math.max(...prices) : 0;
  const names = tours.map((tour) => tour.name).join(", ");

  return [
    {
      question: "What tour packages does Trip Zone Travel & Tours offer?",
      answer: `Trip Zone currently publishes ${tours.length} packages: ${names}. The collection includes pilgrimage tours, Himalayan road trips, nature tours and short treks.`,
    },
    {
      question: "How much does a Trip Zone Nepal tour package cost?",
      answer:
        minimum && maximum
          ? `Published prices currently range from ${formatNpr(minimum)} to ${formatNpr(maximum)} per person. The final price depends on the destination, duration, vehicle, group size and room arrangement.`
          : "Each package page lists the current per-person price and available transport options.",
    },
    {
      question: "What is included in a Trip Zone tour package?",
      answer:
        "Inclusions vary by route. Packages commonly include transport, hotel or lodge accommodation, meals and a guide or tour coordinator. Each tour page separately lists included and excluded services, so travellers can compare the exact package before booking.",
    },
    {
      question: "Where do Trip Zone tours depart from?",
      answer:
        "Most Trip Zone tours depart from Kathmandu. The 2026 Char Dham pilgrimage may also arrange departures for travellers from Morang, Sunsari or Jhapa according to the confirmed schedule and group plan.",
    },
    {
      question: "How can I book a Trip Zone tour?",
      answer:
        "Choose a package and contact Trip Zone by phone or WhatsApp at 9861509342 or 9813844496. Confirm the departure date, number of travellers, transport choice, room arrangement and current price before making the booking.",
    },
  ];
}

function ToursPage() {
  const { destination, type } = Route.useSearch();
  const tours = Route.useLoaderData();
  const packageQuestions = tourPackageQuestions(tours);

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
            <div className="hairline mb-10 rounded-xl bg-secondary/60 p-5 text-sm text-muted-foreground">
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

      <section className="section-y border-y border-border bg-surface">
        <div className="container-page grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="eyebrow">Package guide</span>
            <h2 className="display-section mt-4 text-ink">Planning a Nepal tour with Trip Zone</h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              These answers explain how the published prices, departures and inclusions work. The
              individual itinerary remains the final reference for each route.
            </p>
          </div>
          <div className="border-t border-border">
            {packageQuestions.map((item) => (
              <article
                key={item.question}
                className="grid gap-3 border-b border-border py-6 md:grid-cols-[14rem_1fr]"
              >
                <h3 className="text-base font-bold leading-snug text-ink">{item.question}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BookingCTA />
    </>
  );
}
