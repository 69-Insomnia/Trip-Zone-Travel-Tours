/**
 * Admin session state.
 *
 * Signing in is only half of it: a Supabase account has no editing rights until
 * its id is listed in the `admins` table, so this also confirms membership and
 * reports "signed in but not an administrator" as its own state.
 *
 * A build with no Supabase configuration gets its own state too. Nobody can
 * sign in then, and it is a deployment mistake rather than anything the visitor
 * can act on, so it must not be mistaken for a slow session lookup.
 *
 * Everything here runs in the browser. The admin routes render nothing until
 * `status` leaves "loading", which also keeps them out of server rendering.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { adminClient, errorMessage } from "./admin-client";

export type AdminStatus = "loading" | "misconfigured" | "signedOut" | "notAdmin" | "ready";

type AdminAuth = {
  status: AdminStatus;
  email: string | null;
  /** Why the admin area cannot start. Only set while `status` is "misconfigured". */
  configError: string | null;
  /** Resolves to null on success, or the reason it failed. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuth | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AdminStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Building the client throws when the deployment has no Supabase URL or
    // key. That throw is synchronous, so it would escape the effect rather than
    // reach the `.catch` below and leave the guard spinning on "loading".
    let client: SupabaseClient;
    try {
      client = adminClient();
    } catch (error) {
      const reason = errorMessage(error);
      console.error("[admin] the admin area is not configured:", reason);
      setConfigError(reason);
      setStatus("misconfigured");
      return;
    }

    /** Confirms the signed-in account is listed in `admins`. */
    async function resolve(session: Session | null) {
      if (!session) {
        if (!cancelled) {
          setEmail(null);
          setStatus("signedOut");
        }
        return;
      }
      setEmail(session.user.email ?? null);
      const { data, error } = await client
        .from("admins")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("[admin] could not confirm administrator access:", error.message);
        setStatus("notAdmin");
        return;
      }
      setStatus(data ? "ready" : "notAdmin");
    }

    void client.auth
      .getSession()
      .then(({ data }) => resolve(data.session))
      .catch((error: unknown) => {
        console.error("[admin] session lookup failed:", errorMessage(error));
        if (!cancelled) setStatus("signedOut");
      });

    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      void resolve(session);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (address: string, password: string) => {
    try {
      const { error } = await adminClient().auth.signInWithPassword({
        email: address.trim().toLowerCase(),
        password,
      });
      // On success onAuthStateChange takes over and re-checks membership.
      return error ? error.message : null;
    } catch (error) {
      return errorMessage(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await adminClient().auth.signOut();
    } catch (error) {
      console.error("[admin] sign out failed:", errorMessage(error));
    }
    setStatus("signedOut");
    setEmail(null);
  }, []);

  const value = useMemo<AdminAuth>(
    () => ({ status, email, configError, signIn, signOut }),
    [status, email, configError, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuth {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return value;
}
