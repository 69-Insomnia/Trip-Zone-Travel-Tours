/**
 * /admin/login — the sign-in screen is rendered by the layout guard whenever
 * there is no session, so this route only has to send an already signed-in
 * administrator on to the dashboard.
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { status } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "ready") void navigate({ to: "/admin", replace: true });
  }, [status, navigate]);

  return null;
}
