import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BookingCTA } from "@/components/BookingCTA";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";
import { fetchGallery } from "@/data/queries";
import { type GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  loader: () => fetchGallery(),
  head: () =>
    seoHead({
      title: "Nepal Travel Gallery | Trip Zone Travel & Tours",
      description:
        "See mountain roads, sacred places, villages and Himalayan landscapes featured across Trip Zone journeys in Nepal.",
      path: "/gallery",
    }),
  component: GalleryPage,
});

function GalleryPage() {
  const gallery = Route.useLoaderData();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : (gallery[selectedIndex] ?? null);
  const heroImage = gallery[0]?.image ?? "/photos/hero-annapurna.jpg";

  const move = useCallback(
    (direction: -1 | 1) => {
      setSelectedIndex((current) => {
        if (current === null || gallery.length < 2) return current;
        return (current + direction + gallery.length) % gallery.length;
      });
    },
    [gallery.length],
  );

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [move, selected]);

  return (
    <>
      <PageHero
        eyebrow="The Trip Zone gallery"
        title="Nepal, frame by frame."
        subtitle="A glimpse of the high roads, quiet valleys, sacred places and small moments that make a journey worth taking."
        image={heroImage}
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
            {gallery.map((item, index) => (
              <button
                key={`${item.image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-ink text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  item.size,
                )}
                aria-label={`Open ${item.title}, ${item.place}`}
              >
                <img
                  src={item.image}
                  alt={`${item.title}, ${item.place}`}
                  className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  width="960"
                  height="720"
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
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
            onTouchEnd={(event) => {
              const endX = event.changedTouches[0]?.clientX;
              if (touchStartX !== null && endX !== undefined) {
                const distance = endX - touchStartX;
                if (Math.abs(distance) >= 50) move(distance > 0 ? -1 : 1);
              }
              setTouchStartX(null);
            }}
          >
            <img
              key={selected.image}
              src={selected.image}
              alt={selected.imageAlt ?? `${selected.title}, ${selected.place}`}
              className="max-h-[82vh] w-full animate-in rounded-xl object-contain fade-in-0 duration-300"
              width="1600"
              height="1200"
            />
            <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                {selected.category}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">{selected.title}</h2>
              <p className="mt-1 text-sm text-white/70">{selected.place}</p>
              {selected.credit ? (
                <p className="mt-3 flex max-w-3xl items-start gap-2 text-xs leading-relaxed text-white/65">
                  <Camera className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  {selected.creditUrl ? (
                    <a
                      href={selected.creditUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline decoration-dotted underline-offset-2 hover:text-white"
                    >
                      {selected.credit}
                    </a>
                  ) : (
                    selected.credit
                  )}
                </p>
              ) : null}
            </div>
            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/85"
                  aria-label="Previous gallery image"
                  title="Previous image"
                >
                  <ChevronLeft className="size-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/85"
                  aria-label="Next gallery image"
                  title="Next image"
                >
                  <ChevronRight className="size-6" aria-hidden="true" />
                </button>
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                  {(selectedIndex ?? 0) + 1} / {gallery.length}
                </span>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
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
