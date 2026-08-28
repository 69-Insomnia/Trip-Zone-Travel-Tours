import { createFileRoute } from "@tanstack/react-router";
import { CarFront, ClipboardCheck, Headset, Route as RouteIcon } from "lucide-react";
import { BookingCTA } from "@/components/BookingCTA";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/PageHero";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () =>
    seoHead({
      title: "Nepal Travel Services | Trip Zone Travel & Tours",
      description:
        "Comfortable transport, itinerary planning, accommodation coordination and personal support for travel across Nepal.",
      path: "/services",
      image: "/photos/manang-road.jpg",
    }),
  component: ServicesPage,
});

const services = [
  [
    CarFront,
    "Comfortable transport",
    "Choose the vehicle that fits your group and route: Jeep, Scorpio, Car, Bus or EV Van.",
  ],
  [
    ClipboardCheck,
    "Itinerary planning",
    "We organize the practical details around the journey, from transport and hotels to meals and sightseeing.",
  ],
  [
    Headset,
    "Personal support",
    "Reach the Trip Zone team by phone or WhatsApp before and during your trip.",
  ],
  [
    RouteIcon,
    "Flexible arrangements",
    "Private vehicles, group departures and custom plans are available on request.",
  ],
];
function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Travel services"
        title="The details that make a journey work."
        subtitle="Practical, personal support for discovering Nepal at your own pace."
        image="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=88"
        imageAlt="Road winding through the Himalayan foothills"
        imagePosition="center 58%"
      />
      <section className="section-y">
        <div className="container-page grid gap-5 md:grid-cols-2">
          {services.map(([Icon, title, copy], i) => {
            const I = Icon as typeof CarFront;
            return (
              <Reveal key={title as string} delay={i * 80}>
                <article className="hairline h-full rounded-xl bg-card p-7 shadow-soft">
                  <I className="size-7 text-primary" />
                  <h2 className="mt-6 font-display text-2xl text-ink">{title as string}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {copy as string}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
