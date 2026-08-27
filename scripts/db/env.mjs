/**
 * Shared helpers for the database scripts.
 *
 * Scripts connect straight to Postgres with DATABASE_URL — that credential is
 * for migrations and seeding only and never reaches the browser. The running
 * site talks to Supabase over HTTPS with the publishable key instead.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** Minimal .env reader — avoids adding a dependency just for scripts. */
export function loadEnv() {
  const raw = readFileSync(resolve(projectRoot, ".env"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return env;
}

export function connect() {
  const { DATABASE_URL } = loadEnv();
  if (!DATABASE_URL) throw new Error("DATABASE_URL missing from .env");
  return postgres(DATABASE_URL, {
    ssl: "require",
    max: 1,
    connect_timeout: 20,
    onnotice: () => {},
  });
}
