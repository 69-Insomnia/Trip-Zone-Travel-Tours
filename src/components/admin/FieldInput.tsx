/**
 * Controls for the admin editors.
 *
 * One component per field kind, dispatched by `FieldInput`. Values are handed
 * back in the shape the database column expects: `text[]` as arrays, `jsonb` as
 * objects, numbers as numbers.
 */

import { useEffect, useId, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CircleAlert,
  ExternalLink,
  FileVideo,
  ImageOff,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  asBool,
  asDays,
  asLinkList,
  asNumber,
  asPrices,
  asSections,
  asStringList,
  asText,
  asViews,
  moved,
  type Day,
  type Field,
  type Link,
  type Price,
  type Section,
  type View,
} from "@/lib/admin-fields";
import { errorMessage } from "@/lib/admin-client";
import { useTours } from "@/lib/content";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";
import {
  formatBytes,
  mediaLabel,
  MEDIA_LIMITS,
  uploadMedia,
  type UploadKind,
} from "@/lib/media-upload";

const control =
  "min-h-11 min-w-0 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground/55 hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-ring/20";

type ChangeHandler = (value: unknown) => void;

/** Small square icon button used by the repeating-row editors. */
function IconButton({
  label,
  onClick,
  children,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

function RowTools({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      {count > 1 ? (
        <>
          <IconButton label="Move up" onClick={() => onMove(index - 1)} disabled={index === 0}>
            <ChevronUp className="size-4" />
          </IconButton>
          <IconButton
            label="Move down"
            onClick={() => onMove(index + 1)}
            disabled={index === count - 1}
          >
            <ChevronDown className="size-4" />
          </IconButton>
        </>
      ) : null}
      <IconButton label="Remove" onClick={onRemove}>
        <Trash2 className="size-4" />
      </IconButton>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <Plus aria-hidden="true" />
      {label}
    </Button>
  );
}

function EmptyRows({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-secondary/20 px-4 py-5 text-center text-xs font-medium text-muted-foreground">
      No {label} added yet.
    </div>
  );
}

/** Caption above one control inside a repeating row. */
function Captioned({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[0.6875rem] font-semibold text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

// ------------------------------------------------------------ repeating editors

function StringListInput({
  value,
  placeholder,
  onChange,
}: {
  value: unknown;
  placeholder?: string;
  onChange: ChangeHandler;
}) {
  const items = asStringList(value);
  const set = (next: string[]) => onChange(next);

  return (
    <div className="space-y-2">
      {items.length === 0 ? <EmptyRows label="items" /> : null}
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-lg border border-border bg-secondary/20 p-2"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-card text-[0.6875rem] font-bold text-muted-foreground">
            {i + 1}
          </span>
          <input
            className={control}
            value={item}
            placeholder={placeholder}
            onChange={(e) => set(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <RowTools
            index={i}
            count={items.length}
            onMove={(to) => set(moved(items, i, to))}
            onRemove={() => set(items.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <AddButton label="Add item" onClick={() => set([...items, ""])} />
    </div>
  );
}

/**
 * Picks the packages a film belongs to.
 *
 * `tour_slugs` is matched against a tour's slug exactly, so a typed value that
 * is close but wrong — "muktinath-tour" for the tour actually at "muktinath" —
 * leaves the film saved, published and invisible, with nothing to explain why.
 * Offering the real slugs as checkboxes removes the failure altogether.
 *
 * Slugs already stored that match no current tour are still listed, so a
 * renamed or unpublished tour shows up here as something to fix rather than
 * disappearing silently the moment this form is opened.
 */
function TourSlugsInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const tours = useTours();
  const selected = asStringList(value);
  const known = tours.map((tour) => ({ slug: tour.slug, name: tour.name }));
  const orphans = selected
    .filter((slug) => slug.trim() !== "" && !known.some((tour) => tour.slug === slug))
    .map((slug) => ({ slug, name: slug }));
  const rows = [...known, ...orphans];

  const toggle = (slug: string) =>
    onChange(
      selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug].sort(),
    );

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-secondary/20 p-3 text-xs text-muted-foreground">
        No tours are loaded yet. Save the film without a tour and it plays on the home page.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid gap-1.5 rounded-lg border border-border bg-secondary/20 p-2 sm:grid-cols-2">
        {rows.map((tour) => {
          const isOrphan = !known.some((k) => k.slug === tour.slug);
          return (
            <label
              key={tour.slug}
              className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 hover:bg-card"
            >
              <input
                type="checkbox"
                className="mt-0.5 size-4 shrink-0 accent-primary"
                checked={selected.includes(tour.slug)}
                onChange={() => toggle(tour.slug)}
              />
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold text-ink">{tour.name}</span>
                <span
                  className={`block truncate text-[0.6875rem] ${isOrphan ? "font-semibold text-destructive" : "text-muted-foreground"}`}
                >
                  {isOrphan ? "No tour uses this address — untick it" : `/tours/${tour.slug}`}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-[0.6875rem] text-muted-foreground">
        {selected.length === 0
          ? "Nothing selected — this film plays on the home page."
          : `Plays on ${selected.length} tour ${selected.length === 1 ? "page" : "pages"}.`}
      </p>
    </div>
  );
}

function LinkListInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const items = asLinkList(value);
  const set = (next: Link[]) => onChange(next);
  const patch = (i: number, part: Partial<Link>) =>
    set(items.map((x, j) => (j === i ? { ...x, ...part } : x)));

  return (
    <div className="space-y-2">
      {items.length === 0 ? <EmptyRows label="links" /> : null}
      {items.map((item, i) => (
        <div
          key={i}
          className="grid gap-2 rounded-lg border border-border bg-secondary/20 p-2.5 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-start"
        >
          <label>
            <span className="mb-1.5 block text-[0.6875rem] font-semibold text-muted-foreground">
              Platform
            </span>
            <input
              className={control}
              list="social-platform-options"
              value={item.label}
              placeholder="Facebook"
              autoComplete="off"
              onChange={(e) => patch(i, { label: e.target.value })}
            />
          </label>
          <div>
            <label>
              <span className="mb-1.5 block text-[0.6875rem] font-semibold text-muted-foreground">
                Public profile URL
              </span>
              <span className="relative block">
                <input
                  type="url"
                  className={`${control} pr-11 ${item.url && !isValidExternalUrl(item.url) ? "border-destructive/60 focus:border-destructive focus:ring-destructive/15" : ""}`}
                  value={item.url}
                  placeholder="https://facebook.com/your-page"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-invalid={Boolean(item.url && !isValidExternalUrl(item.url))}
                  aria-describedby={
                    item.url && !isValidExternalUrl(item.url) ? `social-link-error-${i}` : undefined
                  }
                  onChange={(e) => patch(i, { url: e.target.value })}
                  onBlur={() => patch(i, { url: normalizeExternalUrl(item.url) })}
                />
                {isValidExternalUrl(item.url) ? (
                  <a
                    href={normalizeExternalUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open ${item.label || "social profile"}`}
                    aria-label={`Open ${item.label || "social profile"}`}
                    className="absolute right-1 top-1 grid size-9 place-items-center rounded-md text-primary transition-colors hover:bg-secondary"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </span>
            </label>
            {item.url && !isValidExternalUrl(item.url) ? (
              <p
                id={`social-link-error-${i}`}
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive"
              >
                <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
                Enter a complete URL, for example https://facebook.com/your-page
              </p>
            ) : null}
          </div>
          <div className="flex items-end sm:min-h-[4.25rem] sm:justify-self-end">
            <RowTools
              index={i}
              count={items.length}
              onMove={(to) => set(moved(items, i, to))}
              onRemove={() => set(items.filter((_, j) => j !== i))}
            />
          </div>
        </div>
      ))}
      <datalist id="social-platform-options">
        <option value="Facebook" />
        <option value="Instagram" />
        <option value="TikTok" />
        <option value="YouTube" />
        <option value="X / Twitter" />
        <option value="LinkedIn" />
      </datalist>
      <AddButton label="Add link" onClick={() => set([...items, { label: "", url: "" }])} />
    </div>
  );
}

function SectionsInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const sections = asSections(value);
  const set = (next: Section[]) => onChange(next);
  const patch = (i: number, part: Partial<Section>) =>
    set(sections.map((x, j) => (j === i ? { ...x, ...part } : x)));

  return (
    <div className="space-y-3">
      {sections.length === 0 ? <EmptyRows label="article sections" /> : null}
      {sections.map((section, i) => (
        <div key={i} className="rounded-lg border border-border bg-secondary/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-muted-foreground">Section {i + 1}</span>
            <RowTools
              index={i}
              count={sections.length}
              onMove={(to) => set(moved(sections, i, to))}
              onRemove={() => set(sections.filter((_, j) => j !== i))}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              className={control}
              value={section.heading}
              placeholder="Section heading"
              onChange={(e) => patch(i, { heading: e.target.value })}
            />
          </div>
          <label className="mt-3 block text-xs font-semibold text-muted-foreground">
            Paragraphs — one per line
          </label>
          <textarea
            rows={4}
            className={`${control} mt-1 resize-y`}
            value={section.paragraphs.join("\n")}
            onChange={(e) =>
              patch(i, { paragraphs: e.target.value.split("\n").filter((p) => p.trim() !== "") })
            }
          />
          <label className="mt-3 block text-xs font-semibold text-muted-foreground">
            Bullet points — one per line, leave empty for none
          </label>
          <textarea
            rows={3}
            className={`${control} mt-1 resize-y`}
            value={(section.bullets ?? []).join("\n")}
            onChange={(e) => {
              const bullets = e.target.value.split("\n").filter((b) => b.trim() !== "");
              set(
                sections.map((x, j) =>
                  j === i
                    ? {
                        heading: x.heading,
                        paragraphs: x.paragraphs,
                        ...(bullets.length ? { bullets } : {}),
                      }
                    : x,
                ),
              );
            }}
          />
        </div>
      ))}
      <AddButton
        label="Add section"
        onClick={() => set([...sections, { heading: "", paragraphs: [] }])}
      />
    </div>
  );
}

function PricesInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const items = asPrices(value);
  const set = (next: Price[]) => onChange(next);
  const patch = (i: number, part: Partial<Price>) =>
    set(items.map((x, j) => (j === i ? { ...x, ...part } : x)));

  return (
    <div className="space-y-2">
      {items.length === 0 ? <EmptyRows label="price options" /> : null}
      {items.map((item, i) => (
        <div
          key={i}
          className="grid gap-2 rounded-lg border border-border bg-secondary/20 p-3 sm:grid-cols-[10rem_8rem_minmax(0,1fr)_auto] sm:items-center"
        >
          <input
            className={control}
            value={item.transport}
            placeholder="Jeep"
            onChange={(e) => patch(i, { transport: e.target.value })}
          />
          <input
            type="number"
            min={0}
            className={control}
            value={item.price}
            onChange={(e) => patch(i, { price: asNumber(e.target.value) })}
          />
          <input
            className={control}
            value={item.note ?? ""}
            placeholder="Per person, minimum 4 travellers"
            onChange={(e) => patch(i, { note: e.target.value === "" ? null : e.target.value })}
          />
          <div className="justify-self-end">
            <RowTools
              index={i}
              count={items.length}
              onMove={(to) => set(moved(items, i, to))}
              onRemove={() => set(items.filter((_, j) => j !== i))}
            />
          </div>
        </div>
      ))}
      <AddButton
        label="Add price"
        onClick={() => set([...items, { transport: "", price: 0, note: null }])}
      />
    </div>
  );
}

function ItineraryInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const items = asDays(value);
  /** Days are renumbered on every change so they always read 1, 2, 3… */
  const set = (next: Day[]) => onChange(next.map((d, i) => ({ day: i + 1, route: d.route })));

  return (
    <div className="space-y-2">
      {items.length === 0 ? <EmptyRows label="itinerary days" /> : null}
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-2 rounded-lg border border-border bg-secondary/20 p-3"
        >
          <span className="mt-1 grid h-9 w-14 shrink-0 place-items-center rounded-md bg-card text-xs font-bold text-muted-foreground">
            Day {item.day}
          </span>
          <textarea
            rows={2}
            className={`${control} resize-y`}
            value={item.route}
            placeholder="Kathmandu → Charikot → Kalinchowk"
            onChange={(e) =>
              set(items.map((x, j) => (j === i ? { ...x, route: e.target.value } : x)))
            }
          />
          <RowTools
            index={i}
            count={items.length}
            onMove={(to) => set(moved(items, i, to))}
            onRemove={() => set(items.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <AddButton
        label="Add day"
        onClick={() => set([...items, { day: items.length + 1, route: "" }])}
      />
    </div>
  );
}

// ------------------------------------------------------------ media (uploaded)

/**
 * Picks a file on the administrator's own computer and uploads it to Supabase
 * Storage, then hands the field the public URL of the stored file. Dropping a
 * file on the panel works too.
 *
 * The upload happens immediately — the record still has to be saved afterwards,
 * which the toast says, because the field value is what the save writes.
 */
function UploadZone({
  kind,
  onUploaded,
  replacing,
}: {
  kind: UploadKind;
  onUploaded: (url: string) => void;
  replacing: boolean;
}) {
  const limit = MEDIA_LIMITS[kind];
  const inputId = useId();
  const abortRef = useRef<AbortController | null>(null);
  const [percent, setPercent] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const busy = percent !== null;

  // Leaving the page mid-transfer must not write into a form that has moved on.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function upload(file: File | undefined | null) {
    if (!file || busy) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setName(file.name);
    setError(null);
    setPercent(0);
    try {
      const url = await uploadMedia(file, kind, {
        onProgress: setPercent,
        signal: controller.signal,
      });
      onUploaded(url);
      toast.success(`${file.name} uploaded`, {
        description: `Save this record to publish the new ${limit.label}.`,
      });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      abortRef.current = null;
      // The file input is unmounted while the panel shows progress, so it comes
      // back empty — the same file can be chosen again after a failure.
      setPercent(null);
    }
  }

  return (
    <div className="space-y-2">
      {busy ? (
        <div className="rounded-lg border border-primary/30 bg-secondary/30 p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
            <p className="min-w-0 flex-1 truncate text-xs font-bold text-ink">{name}</p>
            <span className="shrink-0 text-xs font-bold text-primary">{percent}%</span>
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="shrink-0 rounded-md px-2 py-1 text-[0.6875rem] font-semibold text-muted-foreground hover:bg-card hover:text-ink"
            >
              Cancel
            </button>
          </div>
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary/15"
            role="progressbar"
            aria-valuenow={percent ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Uploading ${name}`}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${percent ?? 0}%` }}
            />
          </div>
          <p className="mt-2 text-[0.6875rem] text-muted-foreground">
            Keep this page open until the upload finishes.
          </p>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setOver(false);
            void upload(event.dataTransfer.files[0]);
          }}
          className={
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-5 text-center transition-colors " +
            (over
              ? "border-primary bg-secondary/60"
              : "border-border bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40")
          }
        >
          <input
            id={inputId}
            type="file"
            accept={limit.accept}
            className="sr-only"
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <UploadCloud className="size-5 text-primary" aria-hidden="true" />
          <span className="mt-2 text-xs font-bold text-ink">
            {replacing ? `Choose a different ${limit.label}` : `Choose a ${limit.label}`} from this
            device
          </span>
          <span className="mt-1 text-[0.6875rem] text-muted-foreground">
            or drop it here — up to {formatBytes(limit.bytes)}
          </span>
        </label>
      )}

      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-destructive">
          <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The upload panel and a preview of the stored file. There is deliberately no
 * box for a link or a path: a photograph or film comes off the computer being
 * edited on, so nothing can be pointed at a file that was never uploaded. Files
 * from before this — the ones under `public/` — keep working and are shown as
 * they are until they are replaced.
 */
function MediaField({
  kind,
  value,
  onChange,
  preview,
}: {
  kind: UploadKind;
  value: string;
  onChange: ChangeHandler;
  preview: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <UploadZone kind={kind} onUploaded={onChange} replacing={value !== ""} />
      {preview}
    </div>
  );
}

/** The stored file, with its name and the one button that clears it. */
function PreviewFrame({
  src,
  onRemove,
  children,
}: {
  src: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-secondary/20">
      {children}
      <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">
        <p className="min-w-0 truncate text-[0.6875rem] text-muted-foreground" title={src}>
          {mediaLabel(src)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex shrink-0 items-center gap-1 text-[0.6875rem] font-semibold text-muted-foreground hover:text-destructive"
        >
          <X className="size-3" aria-hidden="true" />
          Remove
        </button>
      </div>
    </div>
  );
}

function PreviewFailure({
  icon: Icon,
  message,
  src,
  onRemove,
}: {
  icon: typeof ImageOff;
  message: string;
  src: string;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-4 text-center">
      <Icon className="mx-auto size-5 text-destructive" aria-hidden="true" />
      <p className="mt-2 text-xs font-semibold text-destructive">{message}</p>
      <p className="mx-auto mt-1 max-w-full truncate text-[0.6875rem] text-muted-foreground">
        {mediaLabel(src)}
      </p>
      <button
        type="button"
        onClick={onRemove}
        className="mt-2 text-[0.6875rem] font-semibold text-muted-foreground hover:text-destructive"
      >
        Remove it
      </button>
    </div>
  );
}

function ImageInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const src = asText(value);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <MediaField
      kind="image"
      value={src}
      onChange={onChange}
      preview={
        src && !failed ? (
          <PreviewFrame src={src} onRemove={() => onChange("")}>
            <img
              src={src}
              alt="Preview"
              className="aspect-[16/6] w-full object-cover"
              onError={() => setFailed(true)}
            />
          </PreviewFrame>
        ) : src ? (
          <PreviewFailure
            icon={ImageOff}
            message="This photograph could not be loaded"
            src={src}
            onRemove={() => onChange("")}
          />
        ) : null
      }
    />
  );
}

function VideoInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const src = asText(value);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <MediaField
      kind="video"
      value={src}
      onChange={onChange}
      preview={
        src && !failed ? (
          <PreviewFrame src={src} onRemove={() => onChange("")}>
            {/* Keyed so choosing another film reloads the player instead of
                keeping the previous one buffered. */}
            <video
              key={src}
              src={src}
              controls
              muted
              playsInline
              preload="metadata"
              className="aspect-video w-full bg-black object-contain"
              onError={() => setFailed(true)}
            />
          </PreviewFrame>
        ) : src ? (
          <PreviewFailure
            icon={FileVideo}
            message="This film could not be played"
            src={src}
            onRemove={() => onChange("")}
          />
        ) : null
      }
    />
  );
}

const EMPTY_VIEW: View = {
  title: "",
  place: "",
  elevation: "",
  mountainName: "",
  mountainElevation: "",
  description: "",
  image: "",
  imageAlt: "",
  photoNote: "",
  credit: "",
  creditUrl: "",
};

/**
 * The photographs in the "Places & mountain views" section of a tour page. One
 * card per viewpoint; the wording around the grid lives in /admin/settings.
 */
function ViewsInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const items = asViews(value);
  const set = (next: View[]) => onChange(next);
  const patch = (i: number, part: Partial<View>) =>
    set(items.map((x, j) => (j === i ? { ...x, ...part } : x)));

  return (
    <div className="space-y-3">
      {items.length === 0 ? <EmptyRows label="mountain views" /> : null}
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border bg-secondary/20 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-xs font-bold text-muted-foreground">
              View {i + 1}
              {item.title ? ` — ${item.title}` : ""}
            </span>
            <RowTools
              index={i}
              count={items.length}
              onMove={(to) => set(moved(items, i, to))}
              onRemove={() => set(items.filter((_, j) => j !== i))}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Captioned label="Title">
              <input
                className={control}
                value={item.title}
                placeholder="Muktinath Temple"
                onChange={(e) => patch(i, { title: e.target.value })}
              />
            </Captioned>
            <Captioned label="Place">
              <input
                className={control}
                value={item.place}
                placeholder="Mustang"
                onChange={(e) => patch(i, { place: e.target.value })}
              />
            </Captioned>
            <Captioned label="Viewpoint elevation">
              <input
                className={control}
                value={item.elevation}
                placeholder="3,800 m"
                onChange={(e) => patch(i, { elevation: e.target.value })}
              />
            </Captioned>
            <Captioned label="Mountain / ridge">
              <input
                className={control}
                value={item.mountainName}
                placeholder="Dhaulagiri"
                onChange={(e) => patch(i, { mountainName: e.target.value })}
              />
            </Captioned>
            <Captioned label="Mountain elevation">
              <input
                className={control}
                value={item.mountainElevation}
                placeholder="8,167 m"
                onChange={(e) => patch(i, { mountainElevation: e.target.value })}
              />
            </Captioned>
            <Captioned label="Photo note — leave empty for the shared note">
              <input
                className={control}
                value={item.photoNote}
                placeholder="Clearest between October and December."
                onChange={(e) => patch(i, { photoNote: e.target.value })}
              />
            </Captioned>
          </div>

          <div className="mt-3">
            <Captioned label="Description — shown when the photo is opened">
              <textarea
                rows={3}
                className={`${control} resize-y`}
                value={item.description}
                onChange={(e) => patch(i, { description: e.target.value })}
              />
            </Captioned>
          </div>

          <div className="mt-3">
            <Captioned label="Photo description for screen readers">
              <input
                className={control}
                value={item.imageAlt}
                placeholder="Muktinath Temple courtyard below Thorong La"
                onChange={(e) => patch(i, { imageAlt: e.target.value })}
              />
            </Captioned>
          </div>

          <div className="mt-3">
            <span className="mb-1.5 block text-[0.6875rem] font-semibold text-muted-foreground">
              Photo
            </span>
            <ImageInput value={item.image} onChange={(next) => patch(i, { image: asText(next) })} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Captioned label="Photo credit — leave empty for your own photo">
              <input
                className={control}
                value={item.credit}
                placeholder='"Muktinath Temple" by Jane Doe, CC BY-SA 4.0, via Wikimedia Commons'
                onChange={(e) => patch(i, { credit: e.target.value })}
              />
            </Captioned>
            <Captioned label="Credit link">
              <input
                className={control}
                value={item.creditUrl}
                placeholder="https://commons.wikimedia.org/wiki/File:..."
                onChange={(e) => patch(i, { creditUrl: e.target.value })}
              />
            </Captioned>
          </div>
        </div>
      ))}
      <AddButton label="Add view" onClick={() => set([...items, { ...EMPTY_VIEW }])} />
    </div>
  );
}

// -------------------------------------------------------------------- dispatch

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: ChangeHandler;
}) {
  switch (field.kind) {
    case "textarea":
      return (
        <textarea
          rows={field.rows ?? 4}
          className={`${control} resize-y`}
          value={asText(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className={control}
          value={asNumber(value)}
          {...(field.min === undefined ? {} : { min: field.min })}
          {...(field.max === undefined ? {} : { max: field.max })}
          onChange={(e) => onChange(asNumber(e.target.value))}
        />
      );
    case "date":
      return (
        <input
          type="date"
          className={control}
          value={asText(value).slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "switch":
      return (
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-lg border border-border bg-secondary/25 px-3.5 py-2.5">
          <span>
            <span className="block text-sm font-bold text-ink">
              {asBool(value) ? "Visible" : "Hidden"}
            </span>
            <span className="block text-[0.6875rem] text-muted-foreground">
              {asBool(value) ? "Visitors can see this content." : "Only administrators can see it."}
            </span>
          </span>
          <Switch
            checked={asBool(value)}
            onCheckedChange={(checked) => onChange(checked)}
            aria-label="Toggle website visibility"
          />
        </label>
      );
    case "select":
      return (
        <select
          className={control}
          value={asText(value)}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "image":
      return <ImageInput value={value} onChange={onChange} />;
    case "video":
      return <VideoInput value={value} onChange={onChange} />;
    case "stringList":
      return (
        <StringListInput
          value={value}
          {...(field.placeholder === undefined ? {} : { placeholder: field.placeholder })}
          onChange={onChange}
        />
      );
    case "tourSlugs":
      return <TourSlugsInput value={value} onChange={onChange} />;
    case "linkList":
      return <LinkListInput value={value} onChange={onChange} />;
    case "sections":
      return <SectionsInput value={value} onChange={onChange} />;
    case "prices":
      return <PricesInput value={value} onChange={onChange} />;
    case "itinerary":
      return <ItineraryInput value={value} onChange={onChange} />;
    case "views":
      return <ViewsInput value={value} onChange={onChange} />;
    case "text":
    default:
      return (
        <input
          className={control}
          value={asText(value)}
          {...(field.kind === "text" && field.placeholder !== undefined
            ? { placeholder: field.placeholder }
            : {})}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

/** A field with its label and hint. */
export function FieldRow({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: ChangeHandler;
}) {
  const stacked =
    field.wide ||
    field.kind === "textarea" ||
    field.kind === "stringList" ||
    field.kind === "tourSlugs" ||
    field.kind === "linkList" ||
    field.kind === "sections" ||
    field.kind === "prices" ||
    field.kind === "itinerary" ||
    field.kind === "views" ||
    field.kind === "image" ||
    field.kind === "video";

  return (
    <div className={stacked ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-bold text-ink">{field.label}</label>
      <FieldInput field={field} value={value} onChange={onChange} />
      {field.help ? (
        <p className="mt-1.5 max-w-4xl text-[0.6875rem] leading-relaxed text-muted-foreground">
          {field.help}
        </p>
      ) : null}
    </div>
  );
}
