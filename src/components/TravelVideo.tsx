import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { type Video } from "@/data/videos";
import { useVideos } from "@/lib/content";
import { cn } from "@/lib/utils";

type TravelVideoProps = {
  /** Films to show. Defaults to every film in the database. */
  items?: Video[];
  /** Dock into a floating player once the section scrolls out of view. */
  floating?: boolean;
  /** Contrast for the film selector — `dark` sits on the hero, `light` on a page section. */
  tone?: "dark" | "light";
};

export function TravelVideo({ items, floating = true, tone = "dark" }: TravelVideoProps) {
  const allVideos = useVideos();
  const films = items ?? allVideos;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [docked, setDocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!floating) return;
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setDocked(!!entry && hasScrolled && !entry.isIntersecting && !dismissed),
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [dismissed, floating, hasScrolled]);

  useEffect(() => {
    if (!floating) return;
    const onScroll = () => setHasScrolled(window.scrollY > 180);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [floating]);

  const current = films[Math.min(active, films.length - 1)];
  if (!current) return null;

  return (
    <div ref={sectionRef} className="w-full">
      <div className="aspect-video w-full">
        <div
          className={cn(
            "overflow-hidden bg-black shadow-panel transition-[border-radius,width] duration-500",
            docked
              ? "fixed right-4 bottom-4 z-50 w-[min(23rem,calc(100vw-2rem))] rounded-2xl border border-white/20 shadow-2xl sm:right-6 sm:bottom-6"
              : "relative w-full rounded-[1.5rem] border border-white/20",
          )}
        >
          <video
            key={current.src}
            className="aspect-video w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={current.posterSrc}
            src={current.src}
            title={current.title}
          >
            Your browser does not support HTML video.
          </video>
          {docked ? (
            <div className="absolute right-2 top-2 flex gap-2">
              <button
                type="button"
                onClick={() => sectionRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="grid size-8 place-items-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-black/85"
                aria-label="Return to video"
                title="Return to video"
              >
                <Maximize2 className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDismissed(true);
                  setDocked(false);
                }}
                className="grid size-8 place-items-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-black/85"
                aria-label="Close floating video"
                title="Close floating video"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {films.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {films.map((v, i) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                i === active
                  ? "border-accent bg-accent text-accent-foreground"
                  : tone === "dark"
                    ? "border-white/25 bg-white/10 text-primary-foreground/80 backdrop-blur hover:bg-white/20 hover:text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-ink",
              )}
            >
              {v.title}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
