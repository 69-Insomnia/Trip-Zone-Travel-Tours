/**
 * "The way" — a tour's route drawn as the places it passes through, in order.
 *
 * The stops are read off the itinerary by src/data/tour-way.ts, so this component
 * only lays them out: a row per day, and a chip per place with the elevation and
 * the photograph its viewpoint supplied. It renders nothing when the route could
 * not be read, which is when the day-by-day itinerary just below is the whole
 * story anyway.
 */

import { ChevronRight, TrendingUp } from "lucide-react";
import { Fragment } from "react";
import { buildTourWay, type WayStop } from "@/data/tour-way";
import type { TourView } from "@/data/tour-views";
import type { ItineraryDay } from "@/data/tours";
import { useSite } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type DayGroup = { day: number; stops: WayStop[] };

/**
 * A row per itinerary day. Stops arrive in order and carry the day they are
 * reached on, so consecutive stops of the same day are one group — which is what
 * keeps a 25-stop route down to four readable rows.
 */
function groupByDay(stops: WayStop[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const stop of stops) {
    const last = groups[groups.length - 1];
    if (last && last.day === stop.day) last.stops.push(stop);
    else groups.push({ day: stop.day, stops: [stop] });
  }
  return groups;
}

function StopChip({ stop, isHighPoint }: { stop: WayStop; isHighPoint: boolean }) {
  // Everything known about the stop, for the pointer, since the chip shows the
  // place and its elevation but has no room for the mountain in view from it.
  const detail = [stop.name, stop.elevation, stop.mountainName].filter(Boolean).join(" · ");

  return (
    <span
      title={detail}
      className={cn(
        "hairline inline-flex max-w-full items-center gap-2 rounded-full bg-card py-1 pr-3 text-sm shadow-soft",
        stop.image ? "pl-1" : "pl-3",
        isHighPoint && "ring-1 ring-accent",
      )}
    >
      {stop.image ? (
        <img
          src={stop.image}
          alt={stop.imageAlt ?? ""}
          className="size-7 shrink-0 rounded-full object-cover"
          loading="lazy"
          width="56"
          height="56"
        />
      ) : null}
      <span className="truncate font-semibold text-ink">{stop.name}</span>
      {stop.elevation ? (
        <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground">
          {stop.elevation}
        </span>
      ) : null}
    </span>
  );
}

export function TourWay({
  itinerary,
  views,
}: {
  itinerary: ItineraryDay[];
  views: TourView[];
}) {
  // Every word around the route is editable in /admin/settings.
  const copy = useSite().waySection;
  const way = buildTourWay(itinerary, views);

  if (!way.stops.length) return null;

  const groups = groupByDay(way.stops);

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />

        {way.highPoint ? (
          <Reveal delay={80}>
            <p className="hairline mt-8 inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2 text-sm">
              <TrendingUp className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-muted-foreground">
                {copy.highPointLabel} —{" "}
                <strong className="font-semibold text-ink">{way.highPoint.name}</strong> (
                {way.highPoint.elevation})
              </span>
            </p>
          </Reveal>
        ) : null}

        <ol className="mt-10 grid gap-6">
          {groups.map((group, groupIndex) => (
            <Reveal
              as="li"
              key={group.day}
              delay={groupIndex * 90}
              className="grid gap-3 sm:grid-cols-[auto_1fr] sm:gap-5"
            >
              <span className="inline-flex h-fit w-fit items-center rounded-full bg-primary px-3 py-1.5 text-xs font-bold whitespace-nowrap text-primary-foreground">
                {copy.dayLabel} {String(group.day).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-2">
                {group.stops.map((stop, index) => (
                  <Fragment key={`${group.day}-${index}-${stop.name}`}>
                    {index > 0 ? (
                      <ChevronRight
                        className="size-3.5 shrink-0 text-muted-foreground/50"
                        aria-hidden="true"
                      />
                    ) : null}
                    <StopChip stop={stop} isHighPoint={stop.name === way.highPoint?.name} />
                  </Fragment>
                ))}
              </div>
            </Reveal>
          ))}
        </ol>

        {copy.footnote ? (
          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{copy.footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
