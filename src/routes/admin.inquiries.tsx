/**
 * /admin/inquiries - searchable contact-form inbox.
 */

import { createFileRoute } from "@tanstack/react-router";
import {
  Banknote,
  CalendarClock,
  CarFront,
  Inbox,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  deleteInquiry,
  INQUIRY_STATUSES,
  listInquiries,
  setInquiryStatus,
  type Inquiry,
} from "@/data/admin";
import { whatsappLink } from "@/data/site";
import { errorMessage } from "@/lib/admin-client";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiriesPage,
});

const STATUS_COLOR: Record<string, string> = {
  new: "bg-accent/20 text-accent-foreground",
  contacted: "bg-primary/10 text-primary",
  booked: "bg-forest/12 text-forest",
  closed: "bg-secondary text-muted-foreground",
};

const stamp = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatNpr = (price: number) => `NPR ${new Intl.NumberFormat("en-IN").format(price)}`;

type BookingDetails = {
  vehicleName: string | null;
  vehicleImage: string | null;
  fareLabel: string | null;
  quotedPrice: number | null;
  pickupLocation: string | null;
  travelTime: string | null;
};

function messageLine(message: string, label: string) {
  const prefix = `${label.toLowerCase()}:`;
  const line = message
    .split(/\r?\n/)
    .find((entry) => entry.trim().toLowerCase().startsWith(prefix));
  return line?.trim().slice(prefix.length).trim() || null;
}

function parseBooking(inquiry: Inquiry): BookingDetails | null {
  const isBooking =
    inquiry.source === "vehicle-booking" || /vehicle booking request for/i.test(inquiry.message);
  if (!isBooking) return null;

  const requestedVehicle = inquiry.message
    .match(/vehicle booking request for\s+(.+?)(?:\.|$)/im)?.[1]
    ?.trim();
  const image = inquiry.vehicle_image ?? messageLine(inquiry.message, "Vehicle photo");
  const safeImage = image && (image.startsWith("/") || /^https?:\/\//i.test(image)) ? image : null;
  const priceText =
    inquiry.quoted_price !== null
      ? String(inquiry.quoted_price)
      : messageLine(inquiry.message, "Quoted price");
  const price = priceText ? Number(priceText.replace(/[^\d.]/g, "")) : NaN;
  const dateTime = messageLine(inquiry.message, "Travel date and time");

  return {
    vehicleName:
      inquiry.vehicle_name ?? requestedVehicle ?? messageLine(inquiry.message, "Vehicle"),
    vehicleImage: safeImage,
    fareLabel: inquiry.fare_label ?? messageLine(inquiry.message, "Fare"),
    quotedPrice: Number.isFinite(price) ? price : null,
    pickupLocation: inquiry.pickup_location ?? messageLine(inquiry.message, "Pickup"),
    travelTime:
      inquiry.travel_time ??
      dateTime?.match(/\b\d{1,2}:\d{2}\b/)?.[0] ??
      messageLine(inquiry.message, "Time"),
  };
}

function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await listInquiries();
      setInquiries(rows);
      setSelected((current) => rows.find((row) => row.id === current?.id) ?? rows[0] ?? null);
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(id: string, status: string) {
    setUpdating(true);
    try {
      await setInquiryStatus(id, status);
      setInquiries((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
      setSelected((current) => (current?.id === id ? { ...current, status } : current));
      toast.success("Inquiry status updated");
    } catch (error) {
      toast.error("Could not update the status", { description: errorMessage(error) });
    } finally {
      setUpdating(false);
    }
  }

  async function removeInquiry(inquiry: Inquiry) {
    setDeleting(true);
    try {
      await deleteInquiry(inquiry.id);
      const remaining = inquiries.filter((row) => row.id !== inquiry.id);
      setInquiries(remaining);
      setSelected(remaining[0] ?? null);
      toast.success("Inquiry removed");
    } catch (error) {
      toast.error("Could not remove the inquiry", { description: errorMessage(error) });
    } finally {
      setDeleting(false);
    }
  }

  const statusCounts = useMemo(
    () =>
      Object.fromEntries(
        INQUIRY_STATUSES.map((status) => [
          status,
          inquiries.filter((inquiry) => inquiry.status === status).length,
        ]),
      ) as Record<string, number>,
    [inquiries],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
      const matchesSearch =
        !needle ||
        [
          inquiry.name,
          inquiry.phone,
          inquiry.email,
          inquiry.destination,
          inquiry.pickup_location,
          inquiry.vehicle_name,
          inquiry.fare_label,
          inquiry.message,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, query, statusFilter]);

  const current = filtered.find((row) => row.id === selected?.id) ?? filtered[0] ?? null;
  const booking = current ? parseBooking(current) : null;

  const control =
    "h-10 rounded-lg border border-input bg-background px-3 text-sm text-ink outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/20";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-primary/70">Customer requests</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Inquiries</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Review messages, contact customers and keep each lead's status current.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={loading ? "animate-spin" : ""} aria-hidden="true" />
          Refresh
        </Button>
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

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1 shadow-soft">
          <FilterButton
            active={statusFilter === "all"}
            label="All"
            count={inquiries.length}
            onClick={() => setStatusFilter("all")}
          />
          {INQUIRY_STATUSES.map((status) => (
            <FilterButton
              key={status}
              active={statusFilter === status}
              label={status}
              count={statusCounts[status] ?? 0}
              onClick={() => setStatusFilter(status)}
            />
          ))}
        </div>

        <label className="relative block w-full xl:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone or message"
            className="h-11 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-ink outline-none shadow-soft placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-ring/20"
          />
        </label>
      </div>

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <Skeleton className="h-[38rem] rounded-lg" />
          <Skeleton className="h-[38rem] rounded-lg" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <Inbox className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm font-bold text-ink">No inquiries yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-lg border border-border bg-card shadow-soft lg:sticky lg:top-6">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-xs font-bold text-ink">
                {filtered.length} {filtered.length === 1 ? "inquiry" : "inquiries"}
              </p>
              {query || statusFilter !== "all" ? (
                <button
                  type="button"
                  className="text-xs font-bold text-primary hover:underline"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
            <nav className="max-h-[70vh] space-y-1 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <Search className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-2 text-sm font-bold text-ink">No matching inquiries</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try another filter or search.
                  </p>
                </div>
              ) : (
                filtered.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelected(row)}
                    className={
                      "w-full rounded-lg border px-3 py-3 text-left transition-colors " +
                      (current?.id === row.id
                        ? "border-primary/35 bg-secondary"
                        : "border-transparent hover:border-border hover:bg-secondary/55")
                    }
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate text-sm font-bold text-ink">
                        {row.name}
                      </span>
                      <span
                        className={
                          "shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-bold capitalize " +
                          (STATUS_COLOR[row.status] ?? "bg-secondary text-muted-foreground")
                        }
                      >
                        {row.status}
                      </span>
                    </div>
                    {row.source === "vehicle-booking" ||
                    /vehicle booking request for/i.test(row.message) ? (
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[0.625rem] font-extrabold uppercase text-primary">
                        <CarFront className="size-3" aria-hidden="true" /> Vehicle booking
                      </span>
                    ) : null}
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{row.message}</p>
                    <span className="mt-1.5 block text-[0.6875rem] font-medium text-muted-foreground">
                      {stamp.format(new Date(row.created_at))}
                      {row.destination ? ` · ${row.destination}` : ""}
                    </span>
                  </button>
                ))
              )}
            </nav>
          </aside>

          {current ? (
            <article className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
                <div className="min-w-0">
                  <p className="text-[0.6875rem] font-bold uppercase text-muted-foreground">
                    Received {stamp.format(new Date(current.created_at))}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-ink">{current.name}</h2>
                </div>
                <div>
                  <label htmlFor="inquiry-status" className="mb-1 block text-xs font-bold text-ink">
                    Status
                  </label>
                  <select
                    id="inquiry-status"
                    className={control}
                    value={current.status}
                    disabled={updating}
                    onChange={(event) => void changeStatus(current.id, event.target.value)}
                  >
                    {INQUIRY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-border bg-secondary/20 px-5 py-3 sm:px-6">
                <Button size="sm" asChild>
                  <a
                    href={whatsappLink(
                      current.phone,
                      `Hello ${current.name}, this is Trip Zone Travel & Tours.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle aria-hidden="true" />
                    WhatsApp
                  </a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${current.phone}`}>
                    <Phone aria-hidden="true" />
                    Call
                  </a>
                </Button>
                {current.email ? (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${current.email}`}>
                      <Mail aria-hidden="true" />
                      Email
                    </a>
                  </Button>
                ) : null}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="sm:ml-auto">
                      <Trash2 aria-hidden="true" />
                      Remove inquiry
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove this inquiry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the inquiry from {current.name}. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={deleting}
                        onClick={() => void removeInquiry(current)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        <Trash2 aria-hidden="true" />
                        {deleting ? "Removing" : "Remove inquiry"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {booking ? (
                <div className="grid gap-5 border-b border-border p-5 sm:grid-cols-[14rem_1fr] sm:p-6">
                  {booking.vehicleImage ? (
                    <img
                      src={booking.vehicleImage}
                      alt={booking.vehicleName ?? "Booked vehicle"}
                      className="aspect-[4/3] w-full rounded-lg border border-border bg-white object-cover"
                      width="640"
                      height="480"
                    />
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-border bg-surface">
                      <CarFront className="size-8 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )}
                  <div className="self-center">
                    <p className="text-xs font-bold uppercase text-primary/70">Vehicle booking</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
                      {booking.vehicleName ?? "Vehicle request"}
                    </h3>
                  </div>
                </div>
              ) : null}

              {booking ? (
                <div className="border-b border-border px-5 py-5 sm:px-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Banknote className="size-4 text-primary" aria-hidden="true" />
                    <h3 className="font-display text-lg font-semibold text-ink">Booking details</h3>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <Table>
                      <TableBody>
                        <BookingRow label="Customer" value={current.name} />
                        <BookingRow label="Phone" value={current.phone} />
                        <BookingRow label="Vehicle" value={booking.vehicleName ?? "-"} />
                        <BookingRow label="Fare option" value={booking.fareLabel ?? "-"} />
                        <BookingRow
                          label="Price"
                          value={
                            booking.quotedPrice !== null
                              ? `${formatNpr(booking.quotedPrice)}${booking.fareLabel?.toLowerCase().includes("hire") ? " / day" : ""}`
                              : "-"
                          }
                          emphasize
                        />
                        <BookingRow label="Destination" value={current.destination ?? "-"} />
                        <BookingRow label="Pickup location" value={booking.pickupLocation ?? "-"} />
                        <BookingRow label="Travel date" value={current.travel_date ?? "-"} />
                        <BookingRow label="Pickup time" value={booking.travelTime ?? "-"} />
                        <BookingRow label="Persons" value={current.travelers?.toString() ?? "-"} />
                        <BookingRow
                          label="Vehicle photo"
                          value={booking.vehicleImage ?? "Not available"}
                          breakAll
                        />
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : null}

              <dl className="grid gap-x-6 gap-y-5 p-5 text-sm sm:grid-cols-2 sm:p-6">
                <Row label="Phone">
                  <a
                    href={`tel:${current.phone}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {current.phone}
                  </a>
                </Row>
                {current.email ? (
                  <Row label="Email">
                    <a
                      href={`mailto:${current.email}`}
                      className="break-all font-semibold text-primary hover:underline"
                    >
                      {current.email}
                    </a>
                  </Row>
                ) : null}
                {!booking && current.destination ? (
                  <Row label="Destination">{current.destination}</Row>
                ) : null}
                {!booking && current.pickup_location ? (
                  <Row label="Pickup location">
                    <span className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" aria-hidden="true" />
                      {current.pickup_location}
                    </span>
                  </Row>
                ) : null}
                {current.tour_slug ? <Row label="Tour">{current.tour_slug}</Row> : null}
                {!booking && current.travel_date ? (
                  <Row label="Travel date and time">
                    <span className="flex items-center gap-2">
                      <CalendarClock className="size-4 text-primary" aria-hidden="true" />
                      {current.travel_date}
                      {current.travel_time ? ` at ${current.travel_time.slice(0, 5)}` : ""}
                    </span>
                  </Row>
                ) : null}
                {!booking && current.travelers ? (
                  <Row label="Persons">
                    <span className="flex items-center gap-2">
                      <Users className="size-4 text-primary" aria-hidden="true" />
                      {current.travelers}
                    </span>
                  </Row>
                ) : null}
                <Row label="Message" wide>
                  <p className="whitespace-pre-wrap rounded-lg bg-secondary/35 p-4 leading-relaxed text-ink">
                    {current.message}
                  </p>
                </Row>
              </dl>
            </article>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
              <Inbox className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold text-ink">No inquiry selected</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-xs font-bold capitalize transition-colors " +
        (active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-ink")
      }
    >
      {label}
      <span className={active ? "text-primary-foreground/65" : "text-muted-foreground/70"}>
        {count}
      </span>
    </button>
  );
}

function BookingRow({
  label,
  value,
  emphasize = false,
  breakAll = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  breakAll?: boolean;
}) {
  return (
    <TableRow>
      <TableCell className="w-2/5 bg-surface px-4 py-3 text-xs font-bold text-muted-foreground">
        {label}
      </TableCell>
      <TableCell
        className={
          "px-4 py-3 " +
          (emphasize ? "font-extrabold text-primary" : "text-ink") +
          (breakAll ? " break-all text-xs text-muted-foreground" : "")
        }
      >
        {value}
      </TableCell>
    </TableRow>
  );
}

function Row({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="mb-1 text-xs font-bold text-muted-foreground">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}
