/**
 * Admin session state.
 *
 * Signing in is only half of it: a Supabase account has no editing rights until
 * its id is listed in the `admins` table, so this also confirms membership and
 * reports "signed in but not an administrator" as its own state.
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
import type { Session } from "@supabase/supabase-js";
import { adminClient, errorMessage } from "./admin-client";

export type AdminStatus = "loading" | "signedOut" | "notAdmin" | "ready";

type AdminAuth = {
  status: AdminStatus;
  email: string | null;
  /** Resolves to null on success, or the reason it failed. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuth | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AdminStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

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
      const { data, error } = await adminClient()
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

    void adminClient()
      .auth.getSession()
      .then(({ data }) => resolve(data.session))
      .catch((error: unknown) => {
        console.error("[admin] session lookup failed:", errorMessage(error));
        if (!cancelled) setStatus("signedOut");
      });

    const { data: subscription } = adminClient().auth.onAuthStateChange((_event, session) => {
      void resolve(session);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (address: string, password: string) => {
    const { error } = await adminClient().auth.signInWithPassword({
      email: address.trim().toLowerCase(),
      password,
    });
    // On success onAuthStateChange takes over and re-checks membership.
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => {
    await adminClient().auth.signOut();
    setStatus("signedOut");
    setEmail(null);
  }, []);

  const value = useMemo<AdminAuth>(
    () => ({ status, email, signIn, signOut }),
    [status, email, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuth {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return value;
}
