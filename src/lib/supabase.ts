/**
 * Supabase client.
 *
 * Only the project URL and publishable key are used, both of which are safe in
 * the browser: every table is protected by row level security, so anonymous
 * visitors can read published content and submit an inquiry, nothing else.
 *
 * Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in `.env` (and in the
 * hosting environment at build time). When they are missing the client is null
 * and the site falls back to the bundled content snapshot in src/data.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"];
const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

export const supabase: SupabaseClient | null =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: { persistSession: false },
        global: { headers: { "x-application-name": "trip-zone-website" } },
      })
    : null;

export const isDatabaseConfigured = supabase !== null;

/** Logs why a query fell back to the bundled snapshot, without breaking a page. */
export function reportQueryFailure(what: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[content] ${what} could not be loaded from the database: ${message}`);
}
