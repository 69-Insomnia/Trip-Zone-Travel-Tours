import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, X } from "lucide-react";
import { useState } from "react";
import { BookingCTA } from "@/components/BookingCTA";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { cn } from "@/lib/utils";

type GalleryItem = {
  title: string;
  place: string;
  category: string;
  image: string;
  size?: string;
};

const gallery: GalleryItem[] = [
  {
    title: "Above the tree line",
    place: "Manang Valley",
    category: "Mountain",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=88",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Desert light",
    place: "Mustang",
    category: "Landscape",
    image:
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Morning over the hills",
    place: "Sailung",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "The long road north",
    place: "Annapurna region",
    category: "Road trip",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Snowline shrine",
    place: "Kalinchowk",
    category: "Pilgrimage",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Blue hour in the valley",
    place: "Pokhara",
    category: "Slow travel",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "Sacred mountain air",
    place: "Muktinath",
    category: "Pilgrimage",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=88",
  },
  {
    title: "A city of courtyards",
    place: "Kathmandu",
    category: "Culture",
    image:
      "https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1600&q=88",
  },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Nepal Travel Gallery | Trip Zone" },
      {
        name: "description",
        content:
          "A visual collection of mountain roads, sacred places and Nepal landscapes from Trip Zone journeys.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <>
      <PageHero
        eyebrow="The Trip Zone gallery"
        title="Nepal, frame by frame."
        subtitle="A glimpse of the high roads, quiet valleys, sacred places and small moments that make a journey worth taking."
        image={gallery[0].image}
        imageAlt="Mountain landscape in Nepal"
        imagePosition="center 42%"
      />

      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="From the road"
            title="The places we return to"
            subtitle="Browse a visual diary from the destinations and routes covered by Trip Zone Travel & Tours."
          />
          <div className="mt-12 grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[210px] lg:grid-cols-4">
            {gallery.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setSelected(item)}
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-ink text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  item.size,
                )}
                aria-label={`Open ${item.title}, ${item.place}`}
              >
                <img
                  src={item.image}
                  alt={`${item.title}, ${item.place}`}
                  className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
                  <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-accent">
                    {item.category}
                  </span>
                  <span className="mt-1 block font-display text-xl font-extrabold">
                    {item.title}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/70">
                    {item.place} <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={selected.image}
              alt={`${selected.title}, ${selected.place}`}
              className="max-h-[82vh] w-full rounded-2xl object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                {selected.category}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">{selected.title}</h2>
              <p className="mt-1 text-sm text-white/70">{selected.place}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/85"
              aria-label="Close image viewer"
              title="Close image viewer"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <BookingCTA
        title="Ready to see it in person?"
        subtitle="Tell us which place caught your eye and we will help shape the route."
      />
    </>
  );
}
