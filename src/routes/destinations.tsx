import { createFileRoute } from "@tanstack/react-router";
import { DestinationCard } from "@/components/DestinationCard";
import { BookingCTA } from "@/components/BookingCTA";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { useDestinations, usePhoto } from "@/lib/content";
import { breadcrumbJsonLd, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    ...seoHead({
      title: "Nepal Travel Destinations | Trip Zone Travel & Tours",
      description:
        "Explore Himalayan valleys, pilgrimage sites, lakes, hill towns and nature destinations covered by Trip Zone tours across Nepal.",
      path: "/destinations",
      image: "/photos/manang.jpg",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Destinations" }]),
        ),
      },
    ],
  }),
  component: DestinationsPage,
});

function DestinationsPage() {
  const destinations = useDestinations();
  // Matches this route's og:image, so the social card and the hero agree.
  const hero = usePhoto("manang");

  return (
    <>
      <PageHero
        eyebrow="Go beyond the usual"
        title="Places that stay with you."
        subtitle="High valleys, sacred shrines, lakeside towns and quiet hilltop viewpoints across Nepal."
        image={hero.src}
        imageAlt={hero.alt}
      >
        <Breadcrumbs tone="light" items={[{ label: "Home", to: "/" }, { label: "Destinations" }]} />
      </PageHero>
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
