/**
 * Uploads a file from an administrator's own device to Supabase Storage.
 *
 * Films and photographs used to be reached by a path under `public/` or by a
 * link, which meant every new film needed a developer, a commit and a deploy.
 * A file chosen in /admin goes straight into the `media` bucket instead, and the
 * public URL of the stored object is what the content tables keep.
 *
 * XMLHttpRequest rather than the storage client: supabase-js uploads with
 * `fetch`, which cannot say how far a transfer has got. A tour film is hundreds
 * of megabytes over a slow connection, so a progress bar earns its keep.
 */

import { adminClient } from "./admin-client";
import { slugify } from "./admin-fields";

/** Public bucket created by scripts/db/schema.sql. */
export const MEDIA_BUCKET = "media";

const MIB = 1024 * 1024;

/**
 * What each kind of field accepts. The byte ceilings match `file_size_limit` on
 * the bucket, and the types match its `allowed_mime_types` — change one and
 * change the other, otherwise a file passes here and is refused by storage.
 */
export const MEDIA_LIMITS = {
  image: {
    folder: "photos",
    bytes: 12 * MIB,
    accept: "image/jpeg,image/png,image/webp,image/avif,image/gif",
    label: "photograph",
  },
  video: {
    folder: "films",
    bytes: 512 * MIB,
    accept: "video/mp4,video/quicktime,video/webm",
    label: "film",
  },
} as const;

export type UploadKind = keyof typeof MEDIA_LIMITS;

const EXTENSION_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  mp4: "video/mp4",
  m4v: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};

export function formatBytes(bytes: number): string {
  if (bytes >= MIB) return `${Math.round(bytes / MIB)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

/**
 * The browser leaves `file.type` empty for some files — a `.MP4` dragged out of
 * a camera folder among them — and storage would then serve the object as a
 * download instead of something a `<video>` can play.
 */
function contentTypeOf(file: File): string {
  if (file.type) return file.type;
  return EXTENSION_TYPES[extensionOf(file.name)] ?? "application/octet-stream";
}

/**
 * `films/muktinath-tour-m4x1p2.mp4` — the original name kept readable, made
 * safe for a URL, and given a short suffix so uploading a second file called
 * `video.mp4` never overwrites the first.
 */
function objectPathFor(file: File, folder: string): string {
  const extension = extensionOf(file.name);
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
  const suffix = Date.now().toString(36);
  const name = extension ? `${base}-${suffix}.${extension}` : `${base}-${suffix}`;
  return `${folder}/${name}`;
}

function baseUrl(): string {
  const url = import.meta.env["VITE_SUPABASE_URL"];
  if (!url) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL to upload files.");
  }
  return url.replace(/\/+$/, "");
}

/** Where the site reads the finished object from. */
export function mediaPublicUrl(path: string): string {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl()}/storage/v1/object/public/${MEDIA_BUCKET}/${encoded}`;
}

/**
 * What to show for a stored value in a list: a path under `public/` reads well
 * as it is, while an uploaded file is a long URL of which only the name matters.
 */
export function mediaLabel(value: string): string {
  if (!/^https?:\/\//i.test(value)) return value;
  const name = (value.split(/[?#]/)[0] ?? "").split("/").pop() ?? "";
  if (!name) return value;
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

/** Storage answers with `{ statusCode, error, message }`; fall back on the status. */
function failureMessage(request: XMLHttpRequest, kind: UploadKind): string {
  let message = "";
  try {
    const body = JSON.parse(request.responseText) as { message?: unknown };
    if (typeof body.message === "string") message = body.message;
  } catch {
    message = "";
  }

  switch (request.status) {
    case 400:
      return message || "Supabase refused the file. Check that it is a supported format.";
    case 401:
    case 403:
      return "Your sign-in does not allow uploads. Sign in again as an administrator and retry.";
    case 404:
      return `The "${MEDIA_BUCKET}" storage bucket does not exist yet. Run npm run db:migrate, or create a public bucket named "${MEDIA_BUCKET}" in Supabase → Storage.`;
    case 413:
      return `This ${MEDIA_LIMITS[kind].label} is larger than the upload limit on this Supabase project. Compress it, or raise the limit under Storage → Settings.`;
    default:
      return message || `The upload failed (error ${request.status}).`;
  }
}

export type UploadOptions = {
  /** Called with 0–100 as the transfer proceeds. */
  onProgress?: (percent: number) => void;
  /** Abort to cancel a transfer already in flight. */
  signal?: AbortSignal;
};

/**
 * Uploads one file and returns its public URL. Rejects with a message meant for
 * an administrator to read, not a stack trace.
 */
export async function uploadMedia(
  file: File,
  kind: UploadKind,
  options: UploadOptions = {},
): Promise<string> {
  const limit = MEDIA_LIMITS[kind];
  if (file.size === 0) throw new Error("That file is empty.");
  if (file.size > limit.bytes) {
    throw new Error(
      `That ${limit.label} is ${formatBytes(file.size)}. The limit is ${formatBytes(limit.bytes)} — compress it and try again.`,
    );
  }

  const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!publishableKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_PUBLISHABLE_KEY to upload files.",
    );
  }

  const { data, error } = await adminClient().auth.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.access_token;
  if (!token) throw new Error("Your session has expired. Sign in again to upload files.");

  const path = objectPathFor(file, limit.folder);
  const { signal, onProgress } = options;

  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error("Upload cancelled."));
      return;
    }

    const request = new XMLHttpRequest();
    request.open("POST", `${baseUrl()}/storage/v1/object/${MEDIA_BUCKET}/${path}`, true);
    request.setRequestHeader("authorization", `Bearer ${token}`);
    request.setRequestHeader("apikey", publishableKey);
    request.setRequestHeader("content-type", contentTypeOf(file));
    // Object names carry a unique suffix, so nothing is ever replaced.
    request.setRequestHeader("x-upsert", "false");
    request.setRequestHeader("cache-control", "max-age=31536000");

    const onAbort = () => request.abort();
    signal?.addEventListener("abort", onAbort);
    const done = () => signal?.removeEventListener("abort", onAbort);

    request.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable || event.total === 0) return;
      onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
    };
    request.onload = () => {
      done();
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        reject(new Error(failureMessage(request, kind)));
      }
    };
    request.onerror = () => {
      done();
      reject(
        new Error("The upload could not reach Supabase. Check your connection and try again."),
      );
    };
    request.onabort = () => {
      done();
      reject(new Error("Upload cancelled."));
    };

    request.send(file);
  });

  return mediaPublicUrl(path);
}
