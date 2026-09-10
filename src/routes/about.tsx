import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, MapPinned, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/BookingCTA";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { usePhoto, useSite } from "@/lib/content";
import { breadcrumbJsonLd, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    ...seoHead({
      title: "About Trip Zone Travel & Tours | Kathmandu, Nepal",
      description:
        "Learn how Trip Zone Travel & Tours plans comfortable, locally guided Nepal journeys for groups, couples and families.",
      path: "/about",
      image: "/photos/boudhanath.jpg",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About" }]),
        ),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const hero = usePhoto("boudhanath");
  const site = useSite();

  return (
    <>
      <PageHero
        eyebrow="About Trip Zone"
        title="Nepal, planned with local care."
        subtitle={`${site.name} helps travellers experience Nepal through scenic journeys, pilgrimage routes, mountain landscapes and cultural towns.`}
        image={hero.src}
        imageAlt={hero.alt}
      >
        <Breadcrumbs tone="light" items={[{ label: "Home", to: "/" }, { label: "About" }]} />
      </PageHero>
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Our approach"
              title="Thoughtful journeys, clear details"
              subtitle="We combine destination knowledge with practical planning so your time on the road feels comfortable, flexible and well looked after."
            />
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              From a short weekend escape to a multi-day pilgrimage, we organize transport,
              accommodation, meals and sightseeing around the route you actually want to take. Group
              and private arrangements are welcome.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {site.name} is based at {site.address}, and our packages run from Kathmandu across the
              Gandaki, Koshi and Bagmati regions — Manang and Mustang behind the Annapurna range,
              Pathivara in Taplejung, Halesi Mahadev in Khotang, Kalinchowk and Sailung across
              Dolakha and Ramechhap, Ama Yangri in Helambu, Gosaikunda in Langtang and Dhorpatan in
              Baglung. Beyond Nepal, we operate an overland Char Dham pilgrimage to Yamunotri,
              Gangotri, Kedarnath and Badrinath in Uttarakhand, India.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="hairline rounded-xl bg-card p-5 shadow-soft">
                <Mountain className="size-6 text-primary" />
                <h3 className="mt-3 font-display text-lg text-ink">Routes we know</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nine packages from 2-day weekend trips to a 15-day pilgrimage, each with a
                  published day-by-day itinerary.
                </p>
              </div>
              <div className="hairline rounded-xl bg-card p-5 shadow-soft">
                <MapPinned className="size-6 text-forest" />
                <h3 className="mt-3 font-display text-lg text-ink">Comfort in motion</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Scorpio and Jeep for hill roads, cars for small groups, EV vans and electric SUVs
                  for quiet long-distance travel, tourist buses for large departures.
                </p>
              </div>
              <div className="hairline rounded-xl bg-card p-5 shadow-soft">
                <HeartHandshake className="size-6 text-accent" />
                <h3 className="mt-3 font-display text-lg text-ink">Personal service</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reach us on {site.phones[0]} or {site.phones[1]} by phone or WhatsApp, before
                  departure and throughout your trip.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="What a package covers"
            title="What is included, stated plainly"
            subtitle="The same details appear on every package page, so you can compare routes without chasing quotes."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <div className="hairline rounded-xl bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg text-ink">Included in the price</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Transport in your chosen vehicle, hotel accommodation for the nights stated in the
                package duration, and breakfast, lunch and dinner throughout.
              </p>
            </div>
            <div className="hairline rounded-xl bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg text-ink">Not included</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Drinks and mineral water, personal expenses, entrance fees where applicable, and
                extra costs caused by natural calamities or strikes.
              </p>
            </div>
            <div className="hairline rounded-xl bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg text-ink">Groups and private trips</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Private vehicles for couples and families, and customized departure dates and
                itineraries for groups of roughly 25 to 30 travellers.
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Per-person prices vary with the vehicle and group size and are listed on each package
            page. Contact us to confirm current availability, pickup point and the final quote for
            your dates.
          </p>
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
