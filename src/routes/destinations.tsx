import { createFileRoute } from "@tanstack/react-router";
import { DestinationCard } from "@/components/DestinationCard";
import { BookingCTA } from "@/components/BookingCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { destinations } from "@/data/tours";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Nepal Destinations | Trip Zone" },
      {
        name: "description",
        content: "Explore the destinations covered by Trip Zone Travel & Tours across Nepal.",
      },
    ],
  }),
  component: DestinationsPage,
});

function DestinationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Go beyond the usual"
        title="Places that stay with you."
        subtitle="High valleys, sacred shrines, lakeside towns and quiet hilltop viewpoints across Nepal."
        image="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=88"
        imageAlt="Himalayan mountains in Nepal"
      />
      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Nepal, in chapters"
            title="Choose your next horizon"
            subtitle="Browse the landscapes and towns featured across our curated journeys."
          />
          <div className="mt-12 grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination, i) => (
              <Reveal
                key={destination.slug}
                delay={i * 50}
                className={i === 0 || i === 5 ? "sm:row-span-2" : i === 3 ? "lg:col-span-2" : ""}
              >
                <DestinationCard destination={destination} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
