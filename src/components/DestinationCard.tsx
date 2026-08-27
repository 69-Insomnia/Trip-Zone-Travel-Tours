import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Destination } from "@/data/tours";
import { cn } from "@/lib/utils";

export function DestinationCard({
  destination,
  className,
}: {
  destination: Destination;
  className?: string;
}) {
  const inner = (
    <>
      <img
        src={destination.image}
        alt={`${destination.name}, Nepal`}
        loading="lazy"
        width={1280}
        height={960}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
      />
      <div className="image-scrim absolute inset-0" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <h3 className="font-display text-2xl text-primary-foreground">{destination.name}</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
          {destination.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase text-accent">
          Explore
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </>
  );

  const shell = cn(
    "group relative block overflow-hidden rounded-2xl bg-ink shadow-soft card-lift",
    className,
  );

  if (destination.tour) {
    return (
      <Link to="/tours/$slug" params={{ slug: destination.tour }} className={shell}>
        {inner}
      </Link>
    );
  }

  return (
    <Link to="/tours" className={shell}>
      {inner}
    </Link>
  );
}
