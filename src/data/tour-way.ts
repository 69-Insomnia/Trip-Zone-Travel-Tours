/**
 * "The way" — the route of a tour, read off its itinerary.
 *
 * The itinerary is already the authoritative order of the journey. This module
 * splits its days into the places in the order they are reached, drops the repeat
 * where one day starts out from where the last one stopped, and matches each
 * place against the tour's viewpoints so a stop can carry its elevation and its
 * photograph.
 *
 * A day's route is free text, and it comes in two shapes. Most are written as a
 * list — "Kathmandu → Besisahar → Chame" — which is an explicit statement of the
 * places and is taken as given. The rest are written as a sentence, such as
 * "Chandanbari to Gosaikunda Lake (4,380 m) - approximately 5-6 hours", where the
 * places have to be read out of prose and only some of the sentence is a route at
 * all. Those are stripped back to their route and each candidate is checked
 * against `isPlaceLike`; a day that describes an activity rather than naming a
 * place — "Full-day Dhorpatan exploration" — cannot be read, and one such day
 * switches the section off for the whole tour. A strip with gaps in it reads
 * worse than no strip, and the itinerary below already says the same thing in
 * full.
 *
 * Nothing here is stored: the route is derived, so editing an itinerary day or a
 * viewpoint in /admin changes the section with no second copy to keep in step.
 */

import type { TourView } from "./tour-views";
import type { ItineraryDay } from "./tours";

/** The wording around the route, editable in /admin/settings. */
export type TourWayCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Small print under the route. */
  footnote: string;
  /** Prefixes the day number where a day's leg begins, e.g. "Day 3". */
  dayLabel: string;
  /** Labels the highest stop on the route. */
  highPointLabel: string;
};

export const tourWayCopy: TourWayCopy = {
  eyebrow: "The way",
  title: "Follow the route, stop by stop",
  subtitle:
    "Every place the journey passes through, in the order you reach it, with how high the road and the trail climb.",
  footnote:
    "Stops follow the day-by-day itinerary. Road conditions, weather and the pace of the group decide how long each leg takes on the day.",
  dayLabel: "Day",
  highPointLabel: "Highest point",
};

export type WayStop = {
  /** Place name exactly as the itinerary writes it. */
  name: string;
  /** Itinerary day this place is reached on. */
  day: number;
  /** True where a day's leg begins, which is what the day badge marks. */
  startsDay: boolean;
  /** From the matching viewpoint, when one names this place. */
  elevation?: string;
  /** Metres above sea level, parsed from `elevation` for the high point. */
  metres?: number;
  image?: string;
  imageAlt?: string;
  /** Mountain or ridge in view from here. */
  mountainName?: string;
};

export type TourWay = {
  stops: WayStop[];
  /** Days the route covers, counted from the itinerary. */
  days: number;
  /** The highest stop with a known elevation. */
  highPoint?: { name: string; elevation: string };
};

/** Itinerary days write the route with an arrow; a slash is part of a name. */
const LEG_SEPARATOR = /\s*(?:→|->|—>|=>)\s*/;

/** A prose day joins its places with a word: "Beni to Jomsom via Marpha". */
const PROSE_SEPARATOR = /\s+(?:to|via)\s+/i;

/**
 * Words that belong to what happens on a day rather than to the name of a place.
 *
 * `darshan` is deliberately absent: "Muktinath Darshan" and "Baglung Kalika
 * Darshan" are how those itineraries name the stops themselves.
 */
const ACTIVITY_WORDS = new Set([
  "approximately",
  "aarti",
  "bath",
  "breakfast",
  "check",
  "conclusion",
  "day",
  "depart",
  "departure",
  "dinner",
  "drive",
  "entry",
  "evening",
  "explore",
  "exploration",
  "full",
  "hike",
  "home",
  "hour",
  "hours",
  "journey",
  "km",
  "leisure",
  "lunch",
  "morning",
  "overnight",
  "return",
  "sightseeing",
  "stay",
  "sunrise",
  "sunset",
  "trek",
  "trekking",
  "visit",
]);

/**
 * A prose day trails off into detail — "- approximately 5-6 hours", ": breakfast,
 * lunch, overnight stay" — and sometimes carries an elevation in brackets. None
 * of that names a place, so cut it before looking for the route.
 */
function stripDetailTail(route: string): string {
  const withoutAsides = route.replace(/\(.*?\)/g, " ").replace(/\s+/g, " ");
  return (withoutAsides.split(/:| - | – | — /)[0] ?? "").trim();
}

/**
 * Whether a candidate read out of a prose day names a place. A long phrase, or
 * one describing an activity, is not something to put on a route strip.
 */
function isPlaceLike(name: string): boolean {
  const words = name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  if (words.length === 0 || words.length > 4) return false;
  return !words.some((word) => ACTIVITY_WORDS.has(word));
}

/**
 * The places one day names, in the order they are reached, or null when the day
 * cannot be read as a route at all.
 */
function placesOf(route: string): string[] | null {
  const byArrow = route
    .split(LEG_SEPARATOR)
    .map((place) => place.trim())
    .filter(Boolean);
  // More than one part means the day was written as a list of places: take it.
  if (byArrow.length > 1) return byArrow;

  const prose = stripDetailTail(route)
    .split(PROSE_SEPARATOR)
    .map((place) => place.trim())
    .filter(Boolean);
  if (prose.length === 0) return null;
  return prose.every(isPlaceLike) ? prose : null;
}

/**
 * Words that describe a stop rather than name it, so "Manang village" in the
 * viewpoints matches "Manang" in the itinerary.
 */
const GENERIC_WORDS = new Set([
  "village",
  "town",
  "city",
  "bazaar",
  "bazar",
  "return",
  "viewpoint",
  "area",
  "overnight",
  "night",
  "stay",
  "the",
  "and",
]);

function placeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word && !GENERIC_WORDS.has(word))
    .join(" ");
}

/** "Approx. 2,860 m" → 2860. Undefined when there is no number to read. */
function metresOf(elevation: string): number | undefined {
  const match = /(\d[\d,\s]*)\s*m/i.exec(elevation);
  if (!match?.[1]) return undefined;
  const metres = Number(match[1].replace(/[,\s]/g, ""));
  return Number.isFinite(metres) ? metres : undefined;
}

/** The viewpoint that names this place, matching whole words in either order. */
function viewFor(name: string, views: TourView[]): TourView | undefined {
  const key = placeKey(name);
  if (!key) return undefined;
  return (
    views.find((v) => placeKey(v.place) === key) ??
    views.find((v) => {
      const other = placeKey(v.place);
      return other.startsWith(`${key} `) || key.startsWith(`${other} `);
    })
  );
}

export function buildTourWay(itinerary: ItineraryDay[], views: TourView[]): TourWay {
  const days = [...itinerary].sort((a, b) => a.day - b.day);
  const stops: WayStop[] = [];

  for (const day of days) {
    const places = placesOf(day.route);
    // One unreadable day takes the whole route with it — see the note at the top.
    if (!places) return { stops: [], days: days.length };

    for (const [index, name] of places.entries()) {
      // A day usually opens where the previous one closed; show it once.
      const previous = stops[stops.length - 1];
      if (previous && placeKey(previous.name) === placeKey(name)) continue;

      const view = viewFor(name, views);
      const metres = view ? metresOf(view.elevation) : undefined;
      stops.push({
        name,
        day: day.day,
        startsDay: index === 0 || stops[stops.length - 1]?.day !== day.day,
        ...(view
          ? {
              elevation: view.elevation,
              image: view.image,
              imageAlt: view.imageAlt,
              mountainName: view.mountainName,
            }
          : {}),
        ...(metres === undefined ? {} : { metres }),
      });
    }
  }

  const highest = stops.reduce<WayStop | undefined>(
    (best, stop) =>
      stop.metres !== undefined && (best?.metres === undefined || stop.metres > best.metres)
        ? stop
        : best,
    undefined,
  );

  return {
    stops,
    days: days.length,
    ...(highest?.elevation
      ? { highPoint: { name: highest.name, elevation: highest.elevation } }
      : {}),
  };
}
