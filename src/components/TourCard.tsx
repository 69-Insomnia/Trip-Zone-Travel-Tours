import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNpr, startingPrice, type Tour } from "@/data/tours";
import { useWhatsappLink } from "@/lib/content";

export function TourCard({ tour }: { tour: Tour }) {
  const from = startingPrice(tour);
  const bookLink = useWhatsappLink(
    `Hello Trip Zone, I'd like to book the ${tour.name} (${tour.duration}).`,
  );

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-soft">
      <Link
        to="/tours/$slug"
        params={{ slug: tour.slug }}
        className="relative block aspect-[1.18] overflow-hidden"
        aria-label={`View ${tour.name} itinerary`}
      >
        <img
          src={tour.image}
          alt={`${tour.name} in ${tour.region}`}
          loading="lazy"
          width={1280}
          height={960}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-107"
        />
        <div className="image-scrim pointer-events-none absolute inset-0 opacity-70" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-[0.7rem] font-extrabold tracking-wide text-ink backdrop-blur-sm">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {tour.duration}
        </span>
        <span className="absolute bottom-4 left-4 text-[0.68rem] font-extrabold tracking-[0.16em] uppercase text-primary-foreground/90">
          {tour.region}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-display text-[1.35rem] leading-snug text-ink">
          <Link to="/tours/$slug" params={{ slug: tour.slug }} className="hover:text-primary">
            {tour.name}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {tour.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {tour.prices.map((p, i) => (
            <span
              key={`${p.transport}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-bold text-secondary-foreground"
            >
              <Car className="size-3" aria-hidden="true" />
              {p.transport} · {formatNpr(p.price)}
              {p.note ? <span className="text-muted-foreground">({p.note})</span> : null}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
              Starting from
            </p>
            <p className="font-display text-xl text-ink">
              {formatNpr(from)}
              <span className="ml-1 font-sans text-xs font-medium text-muted-foreground">
                /person
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/tours/$slug" params={{ slug: tour.slug }}>
              View Itinerary
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="accent" className="flex-1">
            <a href={bookLink} target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
