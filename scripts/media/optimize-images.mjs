/**
 * Re-encodes the first-party images in public/ in place.
 *
 * The photos were committed straight from their Wikimedia/press sources, so they
 * carry far more bytes than the page ever renders: 6921px heroes scaled into a
 * 1920px slot, and photographic JPEGs saved at ~0.4 bytes/pixel when q80 lands
 * near 0.10. A hero is the LCP element on every page here, so this is a Core Web
 * Vitals fix, not housekeeping.
 *
 *   npm run media:optimize          rewrite in place
 *   npm run media:optimize -- --dry report what would change, touch nothing
 *
 * Safe to re-run. Every file this script writes is stamped with MARKER in its
 * EXIF Software tag and skipped on later runs, so repeated invocations cannot
 * quietly stack generation loss. Do not swap that for a size or density
 * heuristic: q80 output on a detailed mountain photo lands anywhere between 0.13
 * and 0.25 bytes/pixel, so no fixed threshold separates "already optimised"
 * from "still bloated", and the ones it misjudges get re-encoded every run.
 *
 * Re-encoding drops the source EXIF. The photo attribution these images need
 * lives in public/photos/CREDITS.md, not in their metadata, so nothing is lost.
 */
import { readdirSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const DRY = process.argv.includes("--dry");

/** Written to EXIF Software on output, and the reason a second run is a no-op. */
const MARKER = "tripzone-media-optimizer";

/**
 * First-pass triggers: a file is a candidate if it is wider than the slot that
 * renders it, or if it spends more than this many bytes per pixel. These only
 * decide what to *try* - MARKER is what makes the script idempotent.
 */
const BYTES_PER_PIXEL_CEILING = 0.15;
const JPEG = { quality: 80, mozjpeg: true, progressive: true };
const WEBP = { quality: 82 };

const TARGETS = [
  // Full-bleed page heroes and card art.
  { dir: "public/photos", maxWidth: 1920 },
  // Tour view galleries. Shown in a grid and a lightbox, never full-bleed.
  { dir: "public/photos/views", maxWidth: 1600 },
  { dir: "public/vehicles", maxWidth: 1600 },
];

/**
 * The /services social card. og:image has to clear 1200x630, and social
 * scrapers are the one place WebP is still unreliable, so the card keeps its
 * own correctly-cropped JPEG derivative while the on-page image goes to WebP.
 */
const SOCIAL_CARD = {
  from: "public/vehicles/byd-atto-3.png",
  to: "public/vehicles/byd-atto-3-og.jpg",
  width: 1200,
  height: 630,
};

const kb = (bytes) => Math.round(bytes / 1024);
const isImage = (name) => /\.(jpe?g|png)$/i.test(name);

let before = 0;
let after = 0;
const renames = [];

for (const { dir, maxWidth } of TARGETS) {
  const names = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isImage(entry.name))
    .map((entry) => entry.name)
    .sort();

  console.log(`\n### ${dir}  (${names.length} images, max width ${maxWidth})`);

  for (const name of names) {
    const file = join(dir, name);
    const size = statSync(file).size;
    const image = sharp(file);
    const meta = await image.metadata();
    before += size;

    const density = size / (meta.width * meta.height);
    const tooWide = meta.width > maxWidth;
    const tooHeavy = density > BYTES_PER_PIXEL_CEILING;

    if (meta.exif?.includes(MARKER)) {
      console.log(
        `  keep  ${name.padEnd(46)} ${String(kb(size)).padStart(5)} KB already optimised`,
      );
      after += size;
      continue;
    }

    // A PNG here is a photograph someone exported in the wrong format. Alpha is
    // present but unused on all of them, so WebP loses nothing. If a future PNG
    // genuinely uses transparency, skip it rather than flatten it silently.
    const isPng = meta.format === "png";
    if (isPng && meta.hasAlpha) {
      const alpha = (await sharp(file).stats()).channels[3];
      if (alpha && alpha.min < 255) {
        console.log(`  skip  ${name.padEnd(46)} PNG uses real transparency`);
        after += size;
        continue;
      }
    }

    if (!isPng && !tooWide && !tooHeavy) {
      console.log(`  keep  ${name.padEnd(46)} ${String(kb(size)).padStart(5)} KB already lean`);
      after += size;
      continue;
    }

    const resized = image.resize({ width: maxWidth, withoutEnlargement: true });
    const target = isPng ? file.replace(/\.png$/i, ".webp") : file;
    const encoder = isPng ? resized.webp(WEBP) : resized.jpeg(JPEG);
    const buffer = await encoder.withExif({ IFD0: { Software: MARKER } }).toBuffer();

    // Re-encoding is only worth the quality cost if it actually saves bytes.
    // A format change always wins, so it bypasses the check.
    if (!isPng && buffer.length >= size * 0.9) {
      console.log(`  keep  ${name.padEnd(46)} ${String(kb(size)).padStart(5)} KB no real saving`);
      after += size;
      continue;
    }

    const label = isPng ? `-> ${target.split(/[\\/]/).pop()}` : "";
    console.log(
      `  ${DRY ? "would" : "write"} ${name.padEnd(46)} ` +
        `${String(kb(size)).padStart(5)} -> ${String(kb(buffer.length)).padStart(5)} KB ${label}`,
    );
    after += buffer.length;

    if (!DRY) {
      // Write the encoded bytes verbatim beside the original, then swap, so a
      // failure mid-write cannot leave a truncated image where a working one
      // used to be. Handing the buffer back to sharp would decode and re-encode
      // it a second time at default quality, undoing the settings above.
      const temp = `${target}.tmp`;
      writeFileSync(temp, buffer);
      renameSync(temp, target);
      if (isPng) unlinkSync(file);
    }
    if (isPng) renames.push([name, target.split(/[\\/]/).pop()]);
  }
}

// The source PNG is gone once the loop above has converted it, so fall back to
// the WebP on later runs. Prefer the PNG when it is still there: cropping the
// original avoids stacking the card's compression on top of the WebP's.
const cardSource = [SOCIAL_CARD.from, SOCIAL_CARD.from.replace(/\.png$/i, ".webp")].find((file) => {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
});

// Skip a card we already produced. Without this the card is the one output that
// is not idempotent, and every run would re-crop it from the lossy WebP.
const cardDone = await sharp(SOCIAL_CARD.to)
  .metadata()
  .then((meta) => !!meta.exif?.includes(MARKER))
  .catch(() => false);

const card =
  cardDone || !cardSource
    ? null
    : await sharp(cardSource)
        .resize({ width: SOCIAL_CARD.width, height: SOCIAL_CARD.height, fit: "cover" })
        .jpeg(JPEG)
        .withExif({ IFD0: { Software: MARKER } })
        .toBuffer()
        .catch(() => null);

if (cardDone) {
  console.log(`\n### social card\n  keep  ${SOCIAL_CARD.to} already optimised`);
  after += statSync(SOCIAL_CARD.to).size;
}

if (card) {
  console.log(
    `\n### social card\n  ${DRY ? "would" : "write"} ${SOCIAL_CARD.to}  ` +
      `${SOCIAL_CARD.width}x${SOCIAL_CARD.height}  ${kb(card.length)} KB`,
  );
  after += card.length;
  if (!DRY) writeFileSync(SOCIAL_CARD.to, card);
}

console.log(
  `\n${DRY ? "Would save" : "Saved"} ${kb(before - after)} KB: ` +
    `${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`,
);

if (renames.length) {
  console.log("\nExtension changed, update every reference to these:");
  for (const [from, to] of renames) console.log(`  ${from} -> ${to}`);
}
