/**
 * Central video registry.
 *
 * Each film is matched to the package it was shot on by its file name, so a
 * tour page shows only its own footage. Files live in `public/` and are served
 * from our own origin — spaces in the file names are percent-encoded here.
 * Keep `&` literal in the path: `%26` is not resolved by the static server.
 */

import { photo, type PhotoKey } from "./photos";

export type Video = {
  /** Stable key for lookups. */
  key: string;
  /** Title shown on the player. */
  title: string;
  /** Served path under `public/`. */
  src: string;
  /** Poster frame, from the photo registry. */
  poster: PhotoKey;
  /** Tour slugs this film belongs to. Empty means it is a general company film. */
  tours: string[];
};

export const videos: Video[] = [
  {
    key: "journey",
    title: "Trip Zone journey film",
    src: "/video.MP4",
    poster: "manangRoad",
    tours: [],
  },
  {
    key: "muktinath",
    title: "Muktinath Tour",
    src: "/Muktinath%20Tour.MP4",
    poster: "muktinath",
    tours: ["muktinath"],
  },
  {
    key: "upper-mustang",
    title: "Upper Mustang",
    src: "/uppermustang.mp4",
    poster: "mustang",
    tours: ["muktinath"],
  },
  {
    key: "sailung-kalinchowk",
    title: "Sailung & Kalinchowk",
    src: "/Sailung%20&%20Kalinchowk.MP4",
    poster: "kalinchowk",
    tours: ["sailung-kalinchowk"],
  },
];

/** Films shot on a given package, in registry order. */
export function tourVideos(slug: string) {
  return videos.filter((v) => v.tours.includes(slug));
}

/** Poster image for a film. */
export function videoPoster(video: Video) {
  return photo(video.poster);
}
