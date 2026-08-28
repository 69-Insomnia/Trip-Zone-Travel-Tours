/**
 * Supabase client for the admin area.
 *
 * Separate from the public client in `supabase.ts` on purpose. That one is
 * shared by server rendering and must never hold a session — a persisted
 * session on the server would leak between visitors. This one exists only in
 * the browser, keeps the signed-in session in local storage under its own key,
 * and refreshes the access token in the background.
 *
 * It uses the same publishable key: what an administrator may do is decided by
 * row level security from their access token, not by the key.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** The browser-only admin client. Throws if called during server rendering. */
export function adminClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("The admin client is only available in the browser.");
  }
  if (client) return client;

  const url = import.meta.env["VITE_SUPABASE_URL"];
  const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  client = createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "trip-zone-admin-auth",
    },
    global: { headers: { "x-application-name": "trip-zone-admin" } },
  });
  return client;
}

/** Turns a Supabase error into something worth showing an administrator. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}
