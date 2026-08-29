import { ArrowUpRight, MapPin, Mountain, Ruler, X } from "lucide-react";
import { useEffect, useState } from "react";
import { type TourView } from "@/data/tour-views";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

function tileSize(index: number) {
  if (index === 0) return "md:col-span-2 md:row-span-2";
  if (index === 3 || index === 8) return "md:col-span-2";
  if (index === 6) return "md:row-span-2";
  return "";
}

export function TourViews({ views }: { views: TourView[] }) {
  const [selected, setSelected] = useState<TourView | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  if (!views.length) return null;

  return (
    <>
      <section className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Places & mountain views"
            title="See what you will experience"
            subtitle="A visual route guide to the places, ridges and mountain horizons included in this package. Select any image for the full view details."
          />

          <div className="mt-12 grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[210px] lg:grid-cols-4">
            {views.map((item, index) => (
              <button
                key={`${item.place}-${item.title}`}
                type="button"
                onClick={() => setSelected(item)}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-ink text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  tileSize(index),
                )}
                aria-label={`Open ${item.title}, ${item.place}`}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  width="1280"
                  height="900"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/15 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground md:p-6">
                  <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-accent">
                    {item.mountainName}
                  </span>
                  <span className="mt-1 block font-display text-xl font-extrabold md:text-2xl">
                    {item.title}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/70">
                    {item.place} <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            Elevations are approximate reference values. Mountain visibility depends on season,
            weather and the exact viewpoint on the day.
          </p>
        </div>
      </section>

      {selected ? (
        <div
          className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative my-6 w-full max-w-5xl overflow-hidden rounded-xl bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/9] max-h-[62vh] bg-ink">
              <img
                src={selected.image}
                alt={selected.imageAlt}
                className="size-full object-cover"
                width="1600"
                height="1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                  {selected.mountainName}
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold md:text-3xl">
                  {selected.title}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/75">
                  {selected.place} <ArrowUpRight className="size-4" aria-hidden="true" />
                </p>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {selected.description}
              </p>
              <dl className="grid gap-4 border-t border-border pt-5 text-sm md:border-t-0 md:border-l md:pl-6 md:pt-0">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Viewpoint elevation
                    </dt>
                    <dd className="mt-1 font-semibold text-ink">{selected.elevation}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mountain className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Mountain / ridge
                    </dt>
                    <dd className="mt-1 font-semibold text-ink">
                      {selected.mountainName} ({selected.mountainElevation})
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      Photo note
                    </dt>
                    <dd className="mt-1 text-muted-foreground">
                      View conditions vary by season and weather.
                    </dd>
                  </div>
                </div>
              </dl>
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
    </>
  );
}
