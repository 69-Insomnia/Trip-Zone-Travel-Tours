/**
 * Shared list-and-form editor for admin content collections.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ExternalLink,
  FilePenLine,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  TriangleAlert,
  Undo2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { FieldRow } from "@/components/admin/FieldInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteRow, insertRow, listRows, updateRow, type AdminRow } from "@/data/admin";
import { errorMessage } from "@/lib/admin-client";
import { asText, type Field } from "@/lib/admin-fields";

export type Collection = {
  table: string;
  select: string;
  order?: { column: string; ascending: boolean };
  idKey?: string;
  title: string;
  description: string;
  singular: string;
  fields: Field[];
  blank: () => AdminRow;
  labelOf: (row: AdminRow) => string;
  metaOf?: (row: AdminRow) => string;
  beforeSave?: (draft: AdminRow) => AdminRow;
  validate?: (draft: AdminRow) => string | null;
  afterSave?: (id: string, draft: AdminRow) => Promise<void>;
  previewPath?: (row: AdminRow) => string;
  singleton?: boolean;
};

function payloadOf(collection: Collection, draft: AdminRow): AdminRow {
  const payload: AdminRow = {};
  for (const field of collection.fields) {
    // Child tables of their own, saved by `afterSave` rather than as columns.
    if (field.kind === "prices" || field.kind === "itinerary" || field.kind === "views") continue;
    payload[field.name] = draft[field.name];
  }
  return payload;
}

export function CollectionEditor({ collection }: { collection: Collection }) {
  const idKey = collection.idKey ?? "id";
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [draft, setDraft] = useState<AdminRow | null>(null);
  const [rowId, setRowId] = useState<unknown>(undefined);
  const [baseline, setBaseline] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const dirty = draft !== null && JSON.stringify(draft) !== baseline;
  const isNew = draft !== null && (rowId === undefined || rowId === null || rowId === "");

  const select = useCallback(
    (row: AdminRow | null) => {
      setDraft(row);
      setRowId(row ? row[idKey] : undefined);
      setBaseline(row ? JSON.stringify(row) : "");
    },
    [idKey],
  );

  const load = useCallback(
    async (keepId?: unknown) => {
      setLoading(true);
      setLoadError(null);
      try {
        const loaded = await listRows(collection.table, collection.select, collection.order);
        setRows(loaded);
        const wanted =
          keepId === undefined ? undefined : loaded.find((row) => row[idKey] === keepId);
        const next = wanted ?? loaded[0];
        select(next ? { ...next } : collection.singleton ? collection.blank() : null);
      } catch (error) {
        setLoadError(errorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [collection, idKey, select],
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const confirmDiscard = () => !dirty || window.confirm("Discard your unsaved changes?");

  function set(name: string, value: unknown) {
    setDraft((current) => (current ? { ...current, [name]: value } : current));
  }

  async function save() {
    if (!draft || !dirty || saving) return;
    const tidied = collection.beforeSave ? collection.beforeSave(draft) : draft;
    const validationError = collection.validate?.(tidied);
    if (validationError) {
      if (tidied !== draft) setDraft(tidied);
      toast.error("Check the form", { description: validationError });
      return;
    }

    setSaving(true);
    try {
      if (tidied !== draft) setDraft(tidied);
      const payload = payloadOf(collection, tidied);
      let id = rowId;

      if (id === undefined || id === null || id === "") {
        const created = await insertRow(collection.table, payload);
        id = created[idKey];
      } else {
        await updateRow(collection.table, id as string, payload, idKey);
        id = tidied[idKey] ?? id;
      }

      if (collection.afterSave && typeof id === "string") {
        await collection.afterSave(id, tidied);
      }

      toast.success("Changes saved", { description: "The website has been updated." });
      await load(id);
    } catch (error) {
      toast.error(`Could not save this ${collection.singular}`, {
        description: errorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  });

  async function remove() {
    if (!draft) return;
    if (isNew) {
      select(rows[0] ? { ...rows[0] } : null);
      return;
    }
    if (!window.confirm(`Delete this ${collection.singular}? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await deleteRow(collection.table, rowId as string, idKey);
      toast.success(`${collection.singular} deleted`);
      await load();
    } catch (error) {
      toast.error(`Could not delete this ${collection.singular}`, {
        description: errorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  }

  function addNew() {
    if (!confirmDiscard()) return;
    setQuery("");
    select(collection.blank());
  }

  function resetDraft() {
    if (!draft || !dirty) return;
    if (isNew) {
      select(rows[0] ? { ...rows[0] } : null);
      return;
    }
    const original = rows.find((row) => row[idKey] === rowId);
    if (original) select({ ...original });
  }

  const list = useMemo(
    () =>
      rows.map((row) => ({
        id: row[idKey],
        label: collection.labelOf(row) || "Untitled",
        meta: collection.metaOf?.(row) ?? "",
        published: typeof row["published"] === "boolean" ? Boolean(row["published"]) : undefined,
        row,
      })),
    [rows, idKey, collection],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter(
      (item) =>
        item.label.toLowerCase().includes(needle) || item.meta.toLowerCase().includes(needle),
    );
  }, [list, query]);

  const fieldGroups = useMemo(() => {
    const groups: { label: string; fields: Field[] }[] = [];
    for (const field of collection.fields) {
      const label = field.section ?? "";
      const existing = groups.find((group) => group.label === label);
      if (existing) existing.fields.push(field);
      else groups.push({ label, fields: [field] });
    }
    return groups;
  }, [collection.fields]);

  return (
    <div className={collection.singleton ? "mx-auto max-w-6xl space-y-5" : "space-y-5"}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase text-primary/70">Content manager</p>
          <h1 className="mt-1 font-display text-3xl text-ink">{collection.title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => confirmDiscard() && void load(rowId)}
            disabled={loading || saving}
          >
            <RefreshCw className={loading ? "animate-spin" : ""} aria-hidden="true" />
            Refresh
          </Button>
          {collection.singleton ? null : (
            <Button type="button" size="sm" onClick={addNew} disabled={loading || saving}>
              <Plus aria-hidden="true" />
              New {collection.singular}
            </Button>
          )}
        </div>
      </header>

      {loadError ? (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
          <span className="flex items-start gap-2">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {loadError}
          </span>
          <button
            type="button"
            className="shrink-0 font-bold hover:underline"
            onClick={() => void load()}
          >
            Retry
          </button>
        </div>
      ) : null}

      {loading ? (
        <div
          className={collection.singleton ? "" : "grid gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]"}
        >
          {collection.singleton ? null : <Skeleton className="h-[32rem] rounded-lg" />}
          <Skeleton className="h-[38rem] rounded-lg" />
        </div>
      ) : (
        <div
          className={
            collection.singleton
              ? ""
              : "grid items-start gap-5 lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)]"
          }
        >
          {collection.singleton ? null : (
            <aside className="overflow-hidden rounded-lg border border-border bg-card shadow-soft lg:sticky lg:top-6">
              <div className="border-b border-border p-3">
                <div className="flex items-center justify-between gap-3 px-1 pb-2.5">
                  <p className="text-xs font-bold text-ink">
                    {rows.length} {rows.length === 1 ? "record" : "records"}
                  </p>
                  {query ? (
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary hover:underline"
                      onClick={() => setQuery("")}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <label className="relative block">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={`Search ${collection.title.toLowerCase()}`}
                    className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm text-ink outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
                  />
                  {query ? (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setQuery("")}
                      className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-ink"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : null}
                </label>
              </div>

              <nav className="max-h-[65vh] space-y-1 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-3 py-10 text-center">
                    <Search className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold text-ink">No matching records</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try a different search.</p>
                  </div>
                ) : (
                  filtered.map((item) => {
                    const active = rowId !== undefined && item.id === rowId;
                    return (
                      <button
                        key={String(item.id)}
                        type="button"
                        onClick={() => confirmDiscard() && select({ ...item.row })}
                        className={
                          "w-full rounded-lg border px-3 py-3 text-left transition-colors " +
                          (active
                            ? "border-primary/35 bg-secondary"
                            : "border-transparent hover:border-border hover:bg-secondary/55")
                        }
                      >
                        <span className="flex items-center gap-2">
                          {item.published === undefined ? null : (
                            <span
                              className={
                                "size-2 shrink-0 rounded-full " +
                                (item.published ? "bg-forest" : "bg-muted-foreground/35")
                              }
                              title={item.published ? "Visible" : "Hidden"}
                            />
                          )}
                          <span className="block min-w-0 flex-1 truncate text-sm font-bold text-ink">
                            {item.label}
                          </span>
                          {active ? (
                            <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
                          ) : null}
                        </span>
                        {item.meta ? (
                          <span className="mt-1 block truncate pl-4 text-xs text-muted-foreground">
                            {item.meta}
                          </span>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </nav>
            </aside>
          )}

          <section className="min-w-0">
            {draft === null ? (
              <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
                <FilePenLine className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-ink">No record selected</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Select a record or create a new {collection.singular}.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void save();
                }}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="text-[0.6875rem] font-bold uppercase text-muted-foreground">
                      {isNew ? `New ${collection.singular}` : `Editing ${collection.singular}`}
                    </p>
                    <h2 className="mt-1 truncate font-display text-xl text-ink">
                      {collection.labelOf(draft) || "Untitled"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!isNew && collection.previewPath ? (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={collection.previewPath(draft)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink aria-hidden="true" />
                          View page
                        </a>
                      </Button>
                    ) : null}
                    <span
                      className={
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold " +
                        (dirty ? "bg-accent/20 text-accent-foreground" : "bg-forest/10 text-forest")
                      }
                    >
                      <span
                        className={"size-1.5 rounded-full " + (dirty ? "bg-accent" : "bg-forest")}
                        aria-hidden="true"
                      />
                      {dirty ? "Unsaved changes" : "Up to date"}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {fieldGroups.map((group, index) => (
                    <section
                      key={group.label || "fields"}
                      className={index === 0 ? "" : "mt-6 border-t border-border pt-5"}
                    >
                      {group.label ? (
                        <div className="mb-4">
                          <h3 className="font-display text-base font-bold text-ink">
                            {group.label}
                          </h3>
                        </div>
                      ) : null}
                      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                        {group.fields.map((field) => (
                          <FieldRow
                            key={field.name}
                            field={field}
                            value={draft[field.name]}
                            onChange={(value) => set(field.name, value)}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-card/95 px-4 py-3 backdrop-blur sm:px-5">
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={saving || !dirty}>
                      {saving ? (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Save aria-hidden="true" />
                      )}
                      {saving ? "Saving" : isNew ? `Create ${collection.singular}` : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetDraft}
                      disabled={saving || !dirty}
                    >
                      <Undo2 aria-hidden="true" />
                      Reset
                    </Button>
                  </div>
                  {collection.singleton ? null : (
                    <Button
                      type="button"
                      variant={isNew ? "ghost" : "destructive"}
                      onClick={() => void remove()}
                      disabled={saving}
                    >
                      <Trash2 aria-hidden="true" />
                      {isNew ? "Discard new" : "Delete"}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export { asText };
