/**
 * /admin - priority work, content totals and recent inquiries.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CircleHelp,
  Film,
  Images,
  Inbox,
  MapPinned,
  MessageSquareQuote,
  Mountain,
  Newspaper,
  Plus,
  RefreshCw,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { countNewInquiries, countRows, listInquiries, type Inquiry } from "@/data/admin";
import { errorMessage } from "@/lib/admin-client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const COLLECTIONS = [
  { table: "tours", label: "Tours", to: "/admin/tours", icon: Mountain },
  { table: "destinations", label: "Destinations", to: "/admin/destinations", icon: MapPinned },
  { table: "blogs", label: "Blog posts", to: "/admin/blogs", icon: Newspaper },
  { table: "gallery_items", label: "Gallery photos", to: "/admin/gallery", icon: Images },
  { table: "videos", label: "Films", to: "/admin/media", icon: Film },
  { table: "faqs", label: "FAQs", to: "/admin/faqs", icon: CircleHelp },
  {
    table: "testimonials",
    label: "Testimonials",
    to: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
] as const;

const QUICK_ACTIONS = [
  { to: "/admin/tours", label: "Manage tours", icon: Plus },
  { to: "/admin/inquiries", label: "Open inbox", icon: Inbox },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
] as const;

const dayMonth = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_STYLE: Record<string, string> = {
  new: "bg-accent/20 text-accent-foreground",
  contacted: "bg-primary/10 text-primary",
  booked: "bg-forest/12 text-forest",
  closed: "bg-secondary text-muted-foreground",
};

function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [newLeads, setNewLeads] = useState(0);
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tallies, leads, inquiries] = await Promise.all([
        Promise.all(
          COLLECTIONS.map(async (item) => [item.table, await countRows(item.table)] as const),
        ),
        countNewInquiries(),
        listInquiries(),
      ]);
      setCounts(Object.fromEntries(tallies));
      setNewLeads(leads);
      setRecent(inquiries.slice(0, 6));
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary/70">Website overview</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Dashboard</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Review new inquiries and keep website content up to date.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} aria-hidden="true" />
          Refresh
        </Button>
      </header>

      {error ? (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
          <span className="flex items-start gap-2">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
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

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,.75fr)]">
        {loading ? (
          <>
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </>
        ) : (
          <>
            <Link
              to="/admin/inquiries"
              className="group flex min-h-40 flex-col justify-between rounded-lg bg-primary p-6 text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-lg bg-white/12">
                  <Inbox className="size-5" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="size-5 text-primary-foreground/60 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-7">
                <p className="font-display text-2xl">
                  {newLeads === 0
                    ? "Inbox is up to date"
                    : `${newLeads} new ${newLeads === 1 ? "inquiry" : "inquiries"}`}
                </p>
                <p className="mt-1 text-sm text-primary-foreground/65">
                  {newLeads === 0
                    ? "There are no unread customer requests."
                    : "Open the inbox to respond and update their status."}
                </p>
              </div>
            </Link>

            <div className="rounded-lg border border-border bg-card p-5 shadow-soft">
              <p className="text-xs font-bold uppercase text-muted-foreground">Quick actions</p>
              <div className="mt-4 space-y-1">
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="group flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-ink transition-colors hover:bg-secondary"
                  >
                    <span className="flex items-center gap-3">
                      <action.icon className="size-4 text-primary" aria-hidden="true" />
                      {action.label}
                    </span>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      <section>
        <div>
          <h2 className="font-display text-xl text-ink">Content library</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Published and draft records in the CMS.
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? COLLECTIONS.map((item) => <Skeleton key={item.table} className="h-28 rounded-lg" />)
            : COLLECTIONS.map((item) => (
                <Link
                  key={item.table}
                  to={item.to}
                  className="group rounded-lg border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/35"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                      <item.icon className="size-4" aria-hidden="true" />
                    </span>
                    <ArrowRight
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-5 font-display text-2xl text-ink">{counts[item.table] ?? 0}</p>
                  <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{item.label}</p>
                </Link>
              ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl text-ink">Latest inquiries</h2>
            <p className="mt-1 text-sm text-muted-foreground">The most recent customer messages.</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/inquiries">
              View all
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-border bg-card/50 px-5 py-10 text-center">
            <Inbox className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-ink">No inquiries yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Contact form submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-soft">
            {recent.map((inquiry, index) => (
              <Link
                key={inquiry.id}
                to="/admin/inquiries"
                className={
                  "grid gap-2 px-4 py-3.5 transition-colors hover:bg-secondary/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center " +
                  (index === 0 ? "" : "border-t border-border")
                }
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-bold text-ink">{inquiry.name}</span>
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-[0.625rem] font-bold capitalize " +
                        (STATUS_STYLE[inquiry.status] ?? "bg-secondary text-muted-foreground")
                      }
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {inquiry.message}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {dayMonth.format(new Date(inquiry.created_at))}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
