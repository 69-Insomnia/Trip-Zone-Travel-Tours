/**
 * Controls for the admin editors.
 *
 * One component per field kind, dispatched by `FieldInput`. Values are handed
 * back in the shape the database column expects: `text[]` as arrays, `jsonb` as
 * objects, numbers as numbers.
 */

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CircleAlert,
  ExternalLink,
  ImageOff,
} from "lucide-react";
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
  moved,
  type Day,
  type Field,
  type Link,
  type Price,
  type Section,
} from "@/lib/admin-fields";
import { isValidExternalUrl, normalizeExternalUrl } from "@/lib/external-url";

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

function ImageInput({ value, onChange }: { value: unknown; onChange: ChangeHandler }) {
  const src = asText(value);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <div className="space-y-2">
      <input
        className={control}
        value={src}
        placeholder="/photos/hero-annapurna.jpg or https://…"
        onChange={(e) => onChange(e.target.value)}
      />
      {src && !failed ? (
        <div className="overflow-hidden rounded-lg border border-border bg-secondary/20">
          <img
            src={src}
            alt="Preview"
            className="aspect-[16/6] w-full object-cover"
            onError={() => setFailed(true)}
          />
          <p className="truncate border-t border-border px-3 py-2 text-[0.6875rem] text-muted-foreground">
            {src}
          </p>
        </div>
      ) : src ? (
        <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-destructive/30 bg-destructive/5 p-4 text-center">
          <div>
            <ImageOff className="mx-auto size-5 text-destructive" aria-hidden="true" />
            <p className="mt-2 text-xs font-semibold text-destructive">Image could not be loaded</p>
          </div>
        </div>
      ) : null}
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
    case "stringList":
      return (
        <StringListInput
          value={value}
          {...(field.placeholder === undefined ? {} : { placeholder: field.placeholder })}
          onChange={onChange}
        />
      );
    case "linkList":
      return <LinkListInput value={value} onChange={onChange} />;
    case "sections":
      return <SectionsInput value={value} onChange={onChange} />;
    case "prices":
      return <PricesInput value={value} onChange={onChange} />;
    case "itinerary":
      return <ItineraryInput value={value} onChange={onChange} />;
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
    field.kind === "linkList" ||
    field.kind === "sections" ||
    field.kind === "prices" ||
    field.kind === "itinerary" ||
    field.kind === "image";

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
