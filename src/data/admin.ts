/**
 * Admin write queries.
 *
 * Thin wrappers over Supabase that surface errors as exceptions, which the
 * editor turns into a toast. Every call goes through the signed-in admin client,
 * so row level security decides what is actually allowed — a signed-out browser
 * gets rejected by the database, not by this file.
 */

import { adminClient } from "@/lib/admin-client";

export type AdminRow = Record<string, unknown>;

export async function listRows(
  table: string,
  select: string,
  order?: { column: string; ascending: boolean },
): Promise<AdminRow[]> {
  const query = adminClient().from(table).select(select);
  const { data, error } = await (order
    ? query.order(order.column, { ascending: order.ascending })
    : query);
  if (error) throw new Error(error.message);
  // The select list is a runtime string, so Supabase cannot infer the row shape.
  return (data ?? []) as unknown as AdminRow[];
}

export async function insertRow(table: string, values: AdminRow): Promise<AdminRow> {
  const { data, error } = await adminClient().from(table).insert(values).select().single();
  if (error) throw new Error(error.message);
  return (data ?? {}) as AdminRow;
}

export async function updateRow(
  table: string,
  id: string | number,
  values: AdminRow,
  idKey = "id",
): Promise<void> {
  const { error } = await adminClient().from(table).update(values).eq(idKey, id);
  if (error) throw new Error(error.message);
}

export async function deleteRow(table: string, id: string | number, idKey = "id"): Promise<void> {
  const { error } = await adminClient().from(table).delete().eq(idKey, id);
  if (error) throw new Error(error.message);
}

/** One view photograph as the tour editor hands it over, before it is written. */
type ViewInput = {
  title: string;
  place: string;
  elevation: string;
  mountainName: string;
  mountainElevation: string;
  description: string;
  image: string;
  imageAlt: string;
  photoNote: string;
  credit: string;
  creditUrl: string;
};

/**
 * Replaces a tour's prices, itinerary and view photographs.
 *
 * Deleting and re-inserting keeps the rows in exactly the order shown in the
 * editor without having to reconcile ids, and the child tables are small.
 */
export async function replaceTourChildren(
  tourId: string,
  prices: { transport: string; price: number; note: string | null }[],
  itinerary: { day: number; route: string }[],
  views: ViewInput[],
): Promise<void> {
  const client = adminClient();

  const dropPrices = await client.from("tour_prices").delete().eq("tour_id", tourId);
  if (dropPrices.error) throw new Error(dropPrices.error.message);
  if (prices.length > 0) {
    const { error } = await client.from("tour_prices").insert(
      prices.map((p, i) => ({
        tour_id: tourId,
        transport: p.transport,
        price: p.price,
        note: p.note,
        sort_order: i,
      })),
    );
    if (error) throw new Error(error.message);
  }

  const dropDays = await client.from("tour_itinerary").delete().eq("tour_id", tourId);
  if (dropDays.error) throw new Error(dropDays.error.message);
  if (itinerary.length > 0) {
    const { error } = await client
      .from("tour_itinerary")
      .insert(itinerary.map((d) => ({ tour_id: tourId, day: d.day, route: d.route })));
    if (error) throw new Error(error.message);
  }

  const dropViews = await client.from("tour_views").delete().eq("tour_id", tourId);
  if (dropViews.error) throw new Error(dropViews.error.message);
  if (views.length > 0) {
    const { error } = await client.from("tour_views").insert(
      views.map((v, i) => ({
        tour_id: tourId,
        title: v.title,
        place: v.place,
        elevation: v.elevation,
        mountain_name: v.mountainName,
        mountain_elevation: v.mountainElevation,
        description: v.description,
        image: v.image,
        image_alt: v.imageAlt,
        photo_note: v.photoNote,
        credit: v.credit,
        credit_url: v.creditUrl,
        sort_order: i,
      })),
    );
    if (error) throw new Error(error.message);
  }
}

// ------------------------------------------------------------------- inquiries

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  destination: string | null;
  travel_date: string | null;
  travel_time: string | null;
  travelers: number | null;
  pickup_location: string | null;
  vehicle_name: string | null;
  vehicle_image: string | null;
  fare_label: string | null;
  quoted_price: number | null;
  message: string;
  tour_slug: string | null;
  status: string;
  source: string;
  created_at: string;
};

export const INQUIRY_STATUSES = ["new", "contacted", "booked", "closed"] as const;

export async function listInquiries(): Promise<Inquiry[]> {
  const client = adminClient();
  const expanded = await client
    .from("inquiries")
    .select(
      "id, name, phone, email, destination, travel_date, travel_time, travelers, pickup_location, vehicle_name, vehicle_image, fare_label, quoted_price, message, tour_slug, status, source, created_at",
    )
    .order("created_at", { ascending: false });
  if (!expanded.error) return (expanded.data ?? []) as Inquiry[];

  // Keep the inbox readable while an existing deployment is waiting for the
  // additive booking migration to be applied.
  const legacy = await client
    .from("inquiries")
    .select(
      "id, name, phone, email, destination, travel_date, travelers, message, tour_slug, status, source, created_at",
    )
    .order("created_at", { ascending: false });
  if (legacy.error) throw new Error(legacy.error.message);
  return (legacy.data ?? []).map((row) => ({
    ...row,
    travel_time: null,
    pickup_location: null,
    vehicle_name: null,
    vehicle_image: null,
    fare_label: null,
    quoted_price: null,
  })) as Inquiry[];
}

export async function setInquiryStatus(id: string, status: string): Promise<void> {
  await updateRow("inquiries", id, { status });
}

export async function deleteInquiry(id: string): Promise<void> {
  await deleteRow("inquiries", id);
}

/** Row counts for the dashboard. `head: true` fetches the count without rows. */
export async function countRows(table: string): Promise<number> {
  const { count, error } = await adminClient()
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function countNewInquiries(): Promise<number> {
  const { count, error } = await adminClient()
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");
  if (error) throw new Error(error.message);
  return count ?? 0;
}
