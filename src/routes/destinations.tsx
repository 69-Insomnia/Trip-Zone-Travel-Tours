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

      <section className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="How the map fits together"
            title="Four kinds of journey across Nepal"
            subtitle="Every destination above belongs to one of our packages. Here is how they group, and what each kind of trip asks of you."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="hairline rounded-xl bg-card p-7 shadow-soft">
              <h3 className="font-display text-xl text-ink">High Himalayan valleys</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Manang sits behind the Annapurna range at the head of the Marsyangdi valley, reached
                over two days from Kathmandu with an overnight at Dharapani, and returning through
                Bandipur on a four-day round trip. Mustang, north of the same massif, is Nepal's
                high desert — ochre cliffs, wind and Tibetan-influenced villages around Kagbeni and
                Jomsom. Both are long drives on mountain roads, and both reward the altitude gain
                with glacial lakes and monasteries you cannot see from the lowlands.
              </p>
            </article>
            <article className="hairline rounded-xl bg-card p-7 shadow-soft">
              <h3 className="font-display text-xl text-ink">Pilgrimage routes</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muktinath in Mustang is sacred to Hindu and Buddhist pilgrims alike. Pathivara Devi
                stands on a ridge in Taplejung in eastern Nepal, and Halesi Mahadev is a limestone
                cave temple in the Khotang hills. Gosaikunda, a high alpine lake in Langtang, draws
                pilgrims each Janai Purnima. Our longest pilgrimage runs overland for fifteen days
                to Yamunotri, Gangotri, Kedarnath and Badrinath in Uttarakhand, India.
              </p>
            </article>
            <article className="hairline rounded-xl bg-card p-7 shadow-soft">
              <h3 className="font-display text-xl text-ink">Ridges and sunrise viewpoints</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Kalinchowk in Dolakha carries a snow-dusted ridge and a wide Himalayan skyline above
                Kuri village. Sailung, across the district line in Ramechhap, is known for grassland
                hillocks and sunrise above the cloud line. Ama Yangri rises over Helambu in
                Sindhupalchok. These run as one-night, two-day trips — the practical choice for a
                weekend out of Kathmandu.
              </p>
            </article>
            <article className="hairline rounded-xl bg-card p-7 shadow-soft">
              <h3 className="font-display text-xl text-ink">Lakes, towns and open country</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Pokhara sits on Phewa Lake beneath the Annapurna foothills, and Bandipur is a
                hilltop Newari bazaar town on the way. Kathmandu itself holds Durbar Square and the
                Boudhanath stupa. Dhorpatan in Baglung, Nepal's only hunting reserve, is the
                quietest of our routes and the one that feels furthest from a road.
              </p>
            </article>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
