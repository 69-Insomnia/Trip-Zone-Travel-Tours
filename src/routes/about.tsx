import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, MapPinned, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingCTA } from "@/components/BookingCTA";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { photo } from "@/data/photos";

const hero = photo("boudhanath");

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Trip Zone Travel & Tours" },
      {
        name: "description",
        content:
          "Learn how Trip Zone Travel & Tours plans comfortable, local Nepal journeys for groups, couples and families.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Trip Zone"
        title="Nepal, planned with local care."
        subtitle="Trip Zone Travel & Tours Pvt. Ltd. helps travellers experience Nepal through scenic journeys, pilgrimage routes, mountain landscapes and cultural towns."
        image={hero.src}
        imageAlt={hero.alt}
      />
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
              <div className="hairline rounded-2xl bg-card p-5 shadow-soft">
                <Mountain className="size-6 text-primary" />
                <h3 className="mt-3 font-display text-lg text-ink">Nepal expertise</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Routes shaped by local knowledge.
                </p>
              </div>
              <div className="hairline rounded-2xl bg-card p-5 shadow-soft">
                <MapPinned className="size-6 text-forest" />
                <h3 className="mt-3 font-display text-lg text-ink">Comfort in motion</h3>
                <p className="mt-1 text-sm text-muted-foreground">Jeep, Car, Bus and EV options.</p>
              </div>
              <div className="hairline rounded-2xl bg-card p-5 shadow-soft">
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
