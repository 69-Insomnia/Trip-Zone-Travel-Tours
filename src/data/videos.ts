/**
 * Video registry.
 *
 * This is the seed snapshot and the offline fallback — the live site reads the
 * `videos` table, so a film can be added or swapped from the database. `tours`
 * decides which package pages show a film; an empty array means a general
 * company film for the home page.
 *
 * Files live in `public/`. Spaces are percent-encoded; keep `&` literal because
 * `%26` is not resolved by the static server.
 */

import { photo } from "./photos";

// Production hosts may check out Git LFS files as pointer text instead of the
// binary asset. GitHub's media endpoint serves the tracked LFS object directly.
const GITHUB_LFS_MEDIA_BASE =
  "https://media.githubusercontent.com/media/69-Insomnia/Trip-Zone-Travel-Tours/main";

export function videoSource(path: string) {
  if (!import.meta.env.PROD || !path.startsWith("/")) return path;
  const decodedPath = decodeURIComponent(path);
  const encodedPath = decodedPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${GITHUB_LFS_MEDIA_BASE}${encodedPath}`;
}

export type Video = {
  /** Stable key for lookups. */
  key: string;
  /** Title shown on the player. */
  title: string;
  /** Served path under `public/`. */
  src: string;
  /** Poster frame shown before playback. */
  posterSrc: string;
  posterAlt: string;
  /** Tour slugs this film belongs to. */
  tours: string[];
};

export const videos: Video[] = [
  {
    key: "journey",
    title: "Trip Zone journey film",
    src: videoSource("/video.MP4"),
    posterSrc: photo("manangRoad").src,
    posterAlt: photo("manangRoad").alt,
    tours: [],
  },
  {
    key: "muktinath",
    title: "Muktinath Tour",
    src: videoSource("/Muktinath Tour.MP4"),
    posterSrc: photo("muktinath").src,
    posterAlt: photo("muktinath").alt,
    tours: ["muktinath"],
  },
  {
    key: "upper-mustang",
    title: "Upper Mustang",
    src: videoSource("/uppermustang.mp4"),
    posterSrc: photo("mustang").src,
    posterAlt: photo("mustang").alt,
    tours: ["muktinath"],
  },
  {
    key: "sailung-kalinchowk",
    title: "Sailung & Kalinchowk",
    src: videoSource("/Sailung & Kalinchowk.MP4"),
    posterSrc: photo("kalinchowk").src,
    posterAlt: photo("kalinchowk").alt,
    tours: ["sailung-kalinchowk"],
  },
];

/** Films shot on a given package. */
export function tourVideos(slug: string, list: Video[] = videos) {
  return list.filter((v) => v.tours.includes(slug));
}

/** Films not tied to a package — shown on the home page. */
export function generalVideos(list: Video[] = videos) {
  return list.filter((v) => v.tours.length === 0);
}
