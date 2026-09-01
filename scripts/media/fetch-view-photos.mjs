/**
 * Gives every viewpoint in the "Places & mountain views" grid a photograph of
 * the place it actually names.
 *
 * The subjects come from src/data/tour-views.ts. For each one this searches
 * Wikimedia Commons — the media library behind Wikipedia — keeps only
 * photographs whose licence allows commercial reuse, downloads a 1400px copy
 * into public/photos/views/ and rewrites src/data/view-photos.ts with the file
 * and its attribution. Photographs found through an ordinary web image search
 * are not usable here: almost all of them are all-rights-reserved, and this
 * website republishes what it shows.
 *
 * Usage:
 *   npm run media:view-photos                 # fill in whatever is missing
 *   npm run media:view-photos -- --force      # search again for every subject
 *   npm run media:view-photos -- --only=manang  # only subjects matching the text
 *                                               # (comma-separate several)
 *
 * Already-chosen subjects are left alone, so a re-run costs a handful of
 * requests. The generated file is committed: the website never calls Commons.
 */

import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tourViews, viewPhotoKey } from "../../src/data/tour-views.ts";
import { viewPhotos as existing } from "../../src/data/view-photos.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const PHOTO_DIR = path.join(ROOT, "public", "photos", "views");
const GENERATED = path.join(ROOT, "src", "data", "view-photos.ts");
const CREDITS = path.join(ROOT, "public", "photos", "CREDITS.md");
/** Where the pages read the files from. */
const PUBLIC_PREFIX = "/photos/views";

const API = "https://commons.wikimedia.org/w/api.php";
/** Commons asks automated readers to identify themselves and go one at a time. */
const USER_AGENT =
  "TripZoneTravelTours/1.0 (https://github.com/69-Insomnia/Trip-Zone-Travel-Tours) view-photo-fetcher";
const PAUSE_MS = 200;

/** Requested thumbnail width. Wide enough for the lightbox, small enough to commit. */
const THUMB_WIDTH = 1400;
const MIN_SOURCE_WIDTH = 1100;
/** The grid tiles and the lightbox are both landscape. */
const MIN_RATIO = 1.2;

/**
 * Where each tour is, added to a search so "Marpha" finds the village in Mustang
 * rather than a surname. Char Dham is the one package outside Nepal.
 */
const TOUR_REGION = {
  manang: "Manang Nepal",
  muktinath: "Mustang Nepal",
  pathivara: "Taplejung Nepal",
  "halesi-mahadev": "Khotang Nepal",
  "sailung-kalinchowk": "Dolakha Nepal",
  "char-dham-pilgrimage-2026": "Uttarakhand India",
  "ama-yangri-trek": "Helambu Nepal",
  "gosaikunda-trek": "Rasuwa Nepal",
  "dhorpatan-tour": "Baglung Nepal",
};

/**
 * Proof that a file is a photograph of the right part of the world. Searching
 * "Braga Manang Nepal" cheerfully returns a sanctuary in Portugal, "Green Lake"
 * one in Seattle and "Pisang" a plate of fried banana, all of which score well on
 * the file name alone — so a candidate must also carry a place name from the
 * right country in its categories, description or title.
 *
 * The place names are specific on purpose: "Himalaya" is printed on photographs
 * from Pakistan to Bhutan and would let a Himachal ridge stand in for a Nepali
 * one, so the ranges that are emphatically somewhere else are rejected outright.
 */
const NEPAL =
  /nepal|nepál|annapurna|manaslu|dhaulagiri|machhapuchhre|machapuchare|langtang|gosainkunda|gosaikunda|kanchenjunga|kangchenjunga|kumbhakarna|makalu|lhotse|khumbu|sagarmatha|mustang|manang|marsyangdi|marshyangdi|gandaki|bagmati|koshi|kosi|madhesh|lumbini|karnali|sudurpashchim|pokhara|kathmandu|patan|bhaktapur|panauti|taplejung|khotang|bhojpur|dolakha|helambu|sindhupalchok|sindhupalchowk|rasuwa|nuwakot|kavre|kavrepalanchowk|baglung|myagdi|parbat|mugu|dolpa|dharan|sunsari|morang|ilam|jhapa|solukhumbu|chitwan|tanahun|bandipur|besisahar|lamjung|jomsom|marpha|kagbeni|muktinath|thorong|tilicho|jugal|rolwaling|gaurishankar|ganesh himal|putha|churen|gurja|sherpa|gurung|tamang|newar|magar|thakali/i;
const INDIA =
  /\bindia\b|indian|uttarakhand|uttaranchal|garhwal|kumaon|ganges|ganga|bhagirathi|alaknanda|mandakini|yamuna|haridwar|hardwar|rishikesh|kedarnath|badrinath|gangotri|yamunotri|joshimath|ranikhet|nainital|dehradun|nanda devi|neelkanth|bandarpunch|bandarpoonch/i;
/** Ranges and regions the routes never reach. */
const ELSEWHERE =
  /himachal|sikkim|ladakh|kashmir|\bbhutan\b|tibet|xizang|pakistan|karakoram|darjeeling|assam|arunachal|meghalaya|kailash|manasarovar|\bchina\b|seattle|portugal|indonesia/i;

const TOUR_GEOGRAPHY = {
  "char-dham-pilgrimage-2026": {
    accept: new RegExp(`${INDIA.source}|${NEPAL.source}`, "i"),
    reject: ELSEWHERE,
  },
};
const NEPAL_GEOGRAPHY = {
  accept: NEPAL,
  reject: new RegExp(`${ELSEWHERE.source}|\\bindia\\b|indian`, "i"),
};

/**
 * Nouns worth matching in a candidate's own words: a subject called "Waterfall
 * stop" should not settle for a plain mountain photograph while a picture of the
 * waterfall is further down the results.
 */
const SUBJECT_NOUNS = [
  "waterfall",
  "lake",
  "glacier",
  "temple",
  "monastery",
  "gompa",
  "stupa",
  "shrine",
  "cave",
  "orchard",
  "apple",
  "tea",
  "bazaar",
  "bridge",
  "sunrise",
  "sunset",
  "village",
  "pasture",
  "meadow",
  "forest",
  "rhododendron",
  "river",
  "hot spring",
  "tatopani",
  "cable car",
  "prayer flag",
  "ridge",
  "cloud",
  "aarti",
  "confluence",
];

/**
 * Subjects whose place name is too small, too generic or spelled differently on
 * Commons to find on its own. Keyed the same way as the generated file.
 */
const SEARCH_HINTS = {
  "thulophedi--pilgrimage-base-camp": "Taplejung Gumba",
  "pathivara-trail--cloud-sea-viewpoint": "Pathibhara Devi temple cloud",
  "pathivara-devi--pathibhara-ridge": "Pathibhara Devi temple Taplejung",
  "tamor-river--tammor-corridor": "Taplejung hill",
  "maratika-cave--inside-the-sacred-cave": "Halesi Maratika cave",
  "halesi-bazaar--temple-courtyard": "Halesi Mahadev temple",
  "halesi-hill--limestone-landscape": "Halesi",
  "mahadev-courtyard--evening-prayer": "Halesi Maratika monastery",
  "khotang-viewpoint--sunrise-over-the-hills": "Tyamke Peak Khotang",
  "diktel-road--terraced-hillside": "Diktel Khotang",
  "dudh-koshi-corridor--river-valley-crossing": "Dudh Koshi river bridge",
  "nepal-hill-country--return-through-the-hills": "Nepal middle hills terraces",
  "thumka--village-below-the-ridge": "Sailung Thumka Nepal",
  "kuri-trail--forest-to-ridge-trail": "Kalinchowk forest trail",
  "kuri-village--kuri-village-lights": "Kuri village Kalinchowk",
  "sailung-viewpoint--open-ridge-walk": "Sailung hills viewpoint",
  "sailung-ridge--dawn-across-central-nepal": "Sailung sunrise",
  "chyoumonthang--village-rooftops": "Amayangri Tarkeghyang village",
  "aama-yangri-trail--rhododendron-forest": "Helambu rhododendron forest trail",
  "aama-yangri-peak--summit-prayer-flags": "Amayangri Helambu sunrise",
  "aama-yangri-viewpoint--langtang-panorama": "Amayangri Helambu Langtang",
  "yangri-ridge--jugal-himal-skyline": "Jugal Himal Nepal",
  "helambu-ridge--forest-descent": "Helambu Nepal trail",
  "sermathang-road--kathmandu-valley-return": "Sermathang Helambu",
  "gosaikunda-shore--alpine-camp-light": "Gosaikunda lake shore",
  "gosaikunda-route--mountain-trail-descent": "Gosaikunda trail Langtang",
  "saraswati-and-bhairab-kunda--neighbouring-lakes": "Gosaikunda lakes Langtang",
  "bohora-gaun--village-and-pasture": "Dhorpatan village Baglung",
  "dhorpatan-meadow--morning-reserve-light": "Dhorpatan Hunting Reserve meadow",
  "dhorpatan-ridge--gurja-himal-view": "Gurja Himal",
  "dhorpatan-village--cultural-evening": "Dhorpatan Nepal valley",
  "myagdi-highlands--forest-road": "Myagdi district Nepal forest",
  "dhorpatan-hunting-reserve--reserve-landscape": "Dhorpatan Hunting Reserve",
  "pokhara-return--final-mountain-horizon": "Annapurna range from Pokhara",
  "marsyangdi-corridor--return-road-viewpoint": "Marsyangdi river valley",
  "green-lake--quiet-alpine-water": "Tilicho lake Manang",
  "octopus-waterfall--waterfall-stop": "Waterfall and bridge Annapurna Circuit",
  "rupse-jharna--waterfall-in-the-gorge": "Rupse Waterfall Myagdi",
  "bhratang--apple-orchards": "Bhratang Manang apple",
  "kali-gandaki--river-of-black-stones": "Kali Gandaki river gorge",
  "shanti-stupa--panorama-from-the-ridge": "World Peace Pagoda Pokhara",
  "har-ki-pauri--ganga-aarti": "Har Ki Pauri Haridwar aarti",
  "devghat--holy-confluence": "Devghat Nepal river confluence",
  "budhasubba--sacred-grove": "Budhasubba temple Dharan",
  "dantakali--temple-and-hill-country": "Dantakali temple Dharan",
  "vedetar--ridge-top-weather": "Bhedetar Dharan viewpoint",
  "fikkal--eastern-hill-road": "Ilam district tea hills",
  "kanyam--tea-garden-sunrise": "Kanyam tea garden Ilam",
  "sukute-beach--river-recreation": "Sunkoshi river Sindhupalchok",
  "dolakha-bhimsen--historic-shrine-town": "Dolakha Bhimeshwar temple",
  "sailung-viewpoint--open-ridge-walk": "Sailung hills Dolakha",
  "sailung-ridge--dawn-across-central-nepal": "Sailung sunrise Dolakha",
  "uttarkashi--uttarkashi-valley": "Uttarkashi Bhagirathi river",
  "ranikhet--mountain-river-road": "Ranikhet Uttarakhand hills",
  "gaurikund--kedarnath-approach": "Gaurikund Kedarnath trail",
  "rasuwa--ridge-road-home": "Rasuwa district Nepal",
  "dhunche--forest-trail": "Dhunche Rasuwa forest",
  "chandanbari--laurel-and-rhododendron": "Chandanbari Langtang rhododendron",
  "sing-gompa--yak-cheese-country": "Sing Gompa Langtang",
  "sing-gompa--lake-and-monastery-return": "Chandanbari Sing Gompa monastery",
  "lauribina--high-pass-viewpoint": "Laurebina pass Langtang",
  "jomsom--windy-mountain-town": "Jomsom Mustang airport valley",
  "manang-village--high-valley-panorama": "Manang village Annapurna",
  "braga--monastery-and-mountain-light": "Braka Manang",
  "pisang--village-rooftops": "Pisang Manang village",
  "dharapani--marsyangdi-valley-road": "Marsyangdi valley Manang road",
  "nepal-hill-country--return-through-the-hills": "Nepal middle hills terraces",
};

/**
 * Licences that allow a commercial website to republish the photograph with
 * attribution. Anything non-commercial, no-derivatives or non-free is skipped —
 * as is a bare GFDL file, which cannot be used this way in practice.
 */
function licenceOf(meta) {
  const code = String(meta.License?.value ?? "").toLowerCase();
  const name = String(meta.LicenseShortName?.value ?? "").trim();
  const usable =
    /^cc-by(-sa)?-\d/.test(code) ||
    /^cc0/.test(code) ||
    /^cc-pd/.test(code) ||
    code === "pd" ||
    code.startsWith("public") ||
    (code === "" && /^public domain/i.test(name));
  if (!usable) return null;
  if (/\bnc\b|noncommercial|\bnd\b|noderiv/i.test(code)) return null;
  return name || code.toUpperCase();
}

/** Commons puts HTML in Artist and ImageDescription. */
function plain(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Files that are not a photograph of a place, however well they match the words:
 * district maps score well on the place name, and a rose close-up or somebody's
 * portrait is not what a viewpoint tile is for. Photographs on Commons are
 * practically always JPEG, so the PNG that a map usually is loses twice.
 */
const REJECT_TITLE =
  /\b(logo|flag|seal|emblem|coat of arms|diagram|chart|graph|poster|banner|scan|document|signature|stamp|coin|banknote|book|cover|sign|plaque|screenshot|portrait|selfie|girl|boy|woman|women|\bman\b|\bmen\b|child|children|baby|family|wedding|rose|roses|flower|flowers|butterfly|insect|beetle|moth|spider|closeup|close-up|macro|dish|recipe|accident|crash|protest|funeral)\b|maps?\b|locator|topograph/i;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function commons(params) {
  const url = `${API}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`;
  for (let attempt = 1; ; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
      if (response.status === 429 || response.status >= 500) {
        throw new Error(`Commons answered ${response.status}`);
      }
      if (!response.ok) throw new Error(`Commons answered ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt >= 3) throw error;
      await wait(attempt * 1500);
    }
  }
}

/** Candidate photographs for one search, already filtered down to usable files. */
async function candidatesFor(query) {
  const body = await commons({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "24",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: String(THUMB_WIDTH),
  });
  await wait(PAUSE_MS);

  const pages = body.query?.pages ?? [];
  const found = [];
  for (const [rank, page] of pages.entries()) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const meta = info.extmetadata ?? {};
    const title = String(page.title).replace(/^File:/, "");
    if (REJECT_TITLE.test(title)) continue;
    if (info.mime !== "image/jpeg") continue;
    if (!info.width || !info.height) continue;
    if (info.width < MIN_SOURCE_WIDTH) continue;
    if (info.width / info.height < MIN_RATIO) continue;
    const licence = licenceOf(meta);
    if (!licence) continue;

    found.push({
      title,
      pageTitle: String(page.title),
      rank,
      width: info.width,
      height: info.height,
      thumbUrl: info.thumburl ?? info.url,
      pageUrl: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/File:${title}`,
      licence,
      licenceUrl: plain(meta.LicenseUrl?.value ?? ""),
      artist: plain(meta.Artist?.value) || "unknown photographer",
      assessment: String(meta.Assessments?.value ?? "").toLowerCase(),
      description: plain(meta.ImageDescription?.value).slice(0, 400),
    });
  }
  return found;
}

/**
 * The categories a file sits in, which is where a Commons photograph says what
 * country it was taken in. Up to 50 files per request.
 */
async function categoriesFor(candidates) {
  const found = new Map();
  for (let start = 0; start < candidates.length; start += 50) {
    const batch = candidates.slice(start, start + 50);
    const body = await commons({
      action: "query",
      titles: batch.map((candidate) => candidate.pageTitle).join("|"),
      prop: "categories",
      cllimit: "max",
      clshow: "!hidden",
    });
    await wait(PAUSE_MS);
    for (const page of body.query?.pages ?? []) {
      found.set(
        page.title,
        (page.categories ?? []).map((category) => String(category.title).replace(/^Category:/, "")),
      );
    }
  }
  return found;
}

/** Words worth matching in a file name: "Lake" and "Nepal" say nothing. */
const STOP_WORDS = new Set([
  "the",
  "and",
  "of",
  "at",
  "in",
  "on",
  "a",
  "nepal",
  "india",
  "view",
  "views",
  "lake",
  "river",
  "temple",
  "valley",
  "village",
  "trail",
  "road",
  "hill",
  "hills",
  "mountain",
  "peak",
  "himal",
  "approx",
  "m",
]);

function keywords(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Prefers a file whose name mentions the place, then one that shows what the
 * viewpoint is about, then the mountain, then one the Commons community has
 * singled out, then a big one — and pushes down anything already used elsewhere
 * on the site so nine tours do not share one photograph.
 */
function score(candidate, subject, used) {
  const name = candidate.title.toLowerCase();
  const words = candidate.words;
  let points = Math.max(0, 24 - candidate.rank * 2);

  const placeWords = keywords(subject.place);
  if (placeWords.length && placeWords.every((word) => name.includes(word))) points += 50;
  else if (placeWords.some((word) => name.includes(word))) points += 30;
  else if (placeWords.some((word) => words.includes(word))) points += 20;

  // A file actually named after the mountain beats a wider panorama that merely
  // has it somewhere in the frame.
  const mountainWords = keywords(subject.mountainName);
  if (mountainWords.length && mountainWords.every((word) => name.includes(word))) points += 30;
  else if (mountainWords.some((word) => name.includes(word))) points += 14;
  if (keywords(subject.title).some((word) => name.includes(word))) points += 8;

  const nouns = SUBJECT_NOUNS.filter((noun) =>
    `${subject.title} ${subject.place}`.toLowerCase().includes(noun),
  );
  points += Math.min(24, nouns.filter((noun) => words.includes(noun)).length * 14);

  if (/featured/.test(candidate.assessment)) points += 22;
  else if (/quality/.test(candidate.assessment)) points += 14;
  else if (/valued/.test(candidate.assessment)) points += 8;

  points += Math.min(12, Math.round(candidate.width / 600));
  if (candidate.width / candidate.height > 2.6) points -= 10; // extreme panorama, crops badly
  if (used.has(candidate.title)) points -= 60;

  return points;
}

/**
 * Everything a candidate says about itself, and whether that places it on this
 * route. A file with no geographic evidence at all is skipped rather than guessed
 * at, and one that names a range hundreds of kilometres away is refused outright.
 */
function locate(candidate, categories, geography) {
  const words = `${candidate.title} ${candidate.description} ${(categories.get(candidate.pageTitle) ?? []).join(" ")}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
  return { words, inRegion: geography.accept.test(words) && !geography.reject.test(words) };
}

async function download(candidate) {
  const extension = (path.extname(new URL(candidate.thumbUrl).pathname) || ".jpg").toLowerCase();
  const name = `${slug(candidate.title.replace(/\.[^.]+$/, "")).slice(0, 60)}${extension}`;
  const response = await fetch(candidate.thumbUrl, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`download answered ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength < 20_000) throw new Error("file looks too small to be a photograph");
  await writeFile(path.join(PHOTO_DIR, name), bytes);
  await wait(PAUSE_MS);
  return { name, bytes: bytes.byteLength };
}

// ---------------------------------------------------------------- the subjects

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = (args.find((arg) => arg.startsWith("--only="))?.slice("--only=".length) ?? "")
  .toLowerCase()
  .split(",")
  .map((text) => text.trim())
  .filter(Boolean);

const subjects = [];
for (const [tour, views] of Object.entries(tourViews)) {
  for (const item of views) {
    const key = viewPhotoKey(item.place, item.title);
    if (subjects.some((subject) => subject.key === key)) continue; // same place and title
    subjects.push({
      key,
      tour,
      title: item.title,
      place: item.place,
      mountainName: item.mountainName,
      region: TOUR_REGION[tour] ?? "Nepal",
      geography: TOUR_GEOGRAPHY[tour] ?? NEPAL_GEOGRAPHY,
    });
  }
}

const wanted = only.length
  ? subjects.filter((subject) =>
      only.some((text) => `${subject.tour} ${subject.key}`.includes(text)),
    )
  : subjects;

console.log(
  `${subjects.length} viewpoints, ${wanted.length} in scope${force ? " (searching again)" : ""}.`,
);
await mkdir(PHOTO_DIR, { recursive: true });

const onDisk = new Set(await readdir(PHOTO_DIR).catch(() => []));
const chosen = new Map(Object.entries(existing));
const used = new Set(
  [...chosen.values()].map((photo) =>
    // Commons page URLs write the file name with underscores; the candidate
    // titles this run compares against use spaces.
    decodeURIComponent(photo.creditUrl.split("File:")[1] ?? "").replace(/_/g, " "),
  ),
);

let filled = 0;
let kept = 0;
const missing = [];

for (const subject of wanted) {
  const already = chosen.get(subject.key);
  if (!force && already && onDisk.has(path.basename(already.image))) {
    kept += 1;
    continue;
  }

  const hint = SEARCH_HINTS[subject.key];
  const queries = [
    hint,
    `${subject.place} ${subject.region}`,
    subject.place,
    `${subject.mountainName} ${subject.region}`,
    subject.mountainName,
  ].filter((query, index, all) => query && all.indexOf(query) === index);

  let best = null;
  let rejected = 0;
  for (const query of queries) {
    const candidates = await candidatesFor(query);
    if (candidates.length === 0) continue;
    const categories = await categoriesFor(candidates);

    for (const candidate of candidates) {
      const { words, inRegion } = locate(candidate, categories, subject.geography);
      if (!inRegion) {
        rejected += 1;
        continue;
      }
      const points = score({ ...candidate, words }, subject, used);
      if (!best || points > best.points) best = { candidate, points, query };
    }
    // A confident match ends the search; a weak one keeps looking through the
    // broader queries in case the mountain name does better than the hamlet.
    if (best && best.points >= 70) break;
  }

  if (!best) {
    missing.push(subject.key);
    console.log(
      `  ~ ${subject.key}: nothing usable on Commons${rejected ? ` (${rejected} match(es) were somewhere else in the world)` : ""}, keeping the stand-in`,
    );
    continue;
  }

  try {
    const file = await download(best.candidate);
    chosen.set(subject.key, {
      image: `${PUBLIC_PREFIX}/${file.name}`,
      alt: `${subject.title} at ${subject.place}`,
      credit: `"${best.candidate.title.replace(/\.[^.]+$/, "")}" by ${best.candidate.artist}, ${best.candidate.licence}, via Wikimedia Commons`,
      creditUrl: best.candidate.pageUrl,
    });
    used.add(best.candidate.title);
    onDisk.add(file.name);
    filled += 1;
    console.log(
      `  + ${subject.key}: ${best.candidate.title} (${best.points} pts, ${Math.round(file.bytes / 1024)} KB)`,
    );
  } catch (error) {
    missing.push(subject.key);
    console.log(`  ! ${subject.key}: ${error.message}`);
  }
}

// ------------------------------------------------------------------- the files

const live = new Set(subjects.map((subject) => subject.key));
for (const key of [...chosen.keys()]) {
  if (!live.has(key)) chosen.delete(key); // the viewpoint was renamed or removed
}

const entries = [...chosen.entries()].sort(([a], [b]) => a.localeCompare(b));
const quoted = (value) => JSON.stringify(value);

const generated = `/**
 * A photograph of the actual place behind every entry in the "Places & mountain
 * views" grid.
 *
 * Generated — do not edit by hand. \`npm run media:view-photos\` searches
 * Wikimedia Commons for each viewpoint, keeps only freely licensed photographs,
 * downloads them into \`public/photos/views/\` and rewrites this file. The
 * attribution travels with the photograph because most of these are CC BY-SA:
 * the tour page prints \`credit\` and links it to \`creditUrl\`.
 */

export type ViewPhoto = {
  /** Path under \`public/\`, or a URL for a file uploaded in /admin. */
  image: string;
  alt: string;
  /** Photographer and licence, ready to print. */
  credit: string;
  /** The Wikimedia Commons page the photograph came from. */
  creditUrl: string;
};

/** Keyed by \`viewPhotoKey(place, title)\` from src/data/tour-views.ts. */
export const viewPhotos: Record<string, ViewPhoto> = {
${entries
  .map(
    ([key, photo]) => `  ${quoted(key)}: {
    image: ${quoted(photo.image)},
    alt: ${quoted(photo.alt)},
    credit: ${quoted(photo.credit)},
    creditUrl: ${quoted(photo.creditUrl)},
  },`,
  )
  .join("\n")}
};
`;

await writeFile(GENERATED, generated);

// Attribution in one readable place as well as in the page markup.
const START = "<!-- begin generated viewpoint credits -->";
const END = "<!-- end generated viewpoint credits -->";
const lines = entries
  .map(([, photo]) => `- \`${photo.image.replace("/photos/", "")}\`: ${photo.credit}: ${photo.creditUrl}`)
  .join("\n");
const section = `## Tour viewpoint photographs\n\nOne photograph per entry in the "Places & mountain views" grid, collected by\n\`npm run media:view-photos\`.\n\n${START}\n${lines}\n${END}\n`;

const creditsText = await readFile(CREDITS, "utf8");
const before = creditsText.indexOf("## Tour viewpoint photographs");
const updated =
  before === -1
    ? `${creditsText.trimEnd()}\n\n${section}`
    : `${creditsText.slice(0, before)}${section}`;
await writeFile(CREDITS, updated);

// Files nothing points at any more, from a rename or a better match.
const referenced = new Set(entries.map(([, photo]) => path.basename(photo.image)));
let pruned = 0;
for (const file of await readdir(PHOTO_DIR)) {
  if (referenced.has(file)) continue;
  await unlink(path.join(PHOTO_DIR, file));
  pruned += 1;
}

console.log(
  `\n${entries.length} viewpoint photograph(s): ${filled} new, ${kept} already had one` +
    `${pruned ? `, ${pruned} unused file(s) deleted` : ""}.`,
);
if (missing.length) {
  console.log(
    `Still on a stand-in photograph (add a line to SEARCH_HINTS in this script):\n  ${missing.join("\n  ")}`,
  );
}
console.log("Run npm run db:seed to put the new photographs and credits in the database.");
