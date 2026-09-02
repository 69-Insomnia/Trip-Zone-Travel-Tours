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
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="hairline rounded-xl bg-card p-5 shadow-soft">
                <Mountain className="size-6 text-primary" />
                <h3 className="mt-3 font-display text-lg text-ink">Nepal expertise</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Routes shaped by local knowledge.
                </p>
              </div>
              <div className="hairline rounded-xl bg-card p-5 shadow-soft">
                <MapPinned className="size-6 text-forest" />
                <h3 className="mt-3 font-display text-lg text-ink">Comfort in motion</h3>
                <p className="mt-1 text-sm text-muted-foreground">Jeep, Car, Bus and EV options.</p>
              </div>
              <div className="hairline rounded-xl bg-card p-5 shadow-soft">
                <HeartHandshake className="size-6 text-accent" />
                <h3 className="mt-3 font-display text-lg text-ink">Personal service</h3>
                <p className="mt-1 text-sm text-muted-foreground">A real team on the other end.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
