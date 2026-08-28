/**
 * Admin layout: authentication guard, responsive navigation and workspace shell.
 */

import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  CircleHelp,
  ExternalLink,
  Film,
  Images,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPinned,
  Menu,
  MessageSquareQuote,
  Mountain,
  Newspaper,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { type ReactNode } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Website admin - Trip Zone Travel & Tours" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRoute,
});

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/admin/inquiries", label: "Inquiries", icon: Inbox, exact: false },
    ],
  },
  {
    label: "Website content",
    items: [
      { to: "/admin/tours", label: "Tours", icon: Mountain, exact: false },
      { to: "/admin/destinations", label: "Destinations", icon: MapPinned, exact: false },
      { to: "/admin/blogs", label: "Blog posts", icon: Newspaper, exact: false },
      { to: "/admin/gallery", label: "Gallery", icon: Images, exact: false },
    ],
  },
  {
    label: "Media & trust",
    items: [
      { to: "/admin/media", label: "Films & photos", icon: Film, exact: false },
      { to: "/admin/faqs", label: "FAQs", icon: CircleHelp, exact: false },
      {
        to: "/admin/testimonials",
        label: "Testimonials",
        icon: MessageSquareQuote,
        exact: false,
      },
    ],
  },
  {
    label: "Configuration",
    items: [{ to: "/admin/settings", label: "Site settings", icon: Settings, exact: false }],
  },
] as const;

function AdminRoute() {
  return (
    <AdminAuthProvider>
      <Guard>
        <Shell>
          <Outlet />
        </Shell>
      </Guard>
    </AdminAuthProvider>
  );
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 text-center">
      <div className="max-w-md rounded-lg border border-border bg-card p-8 shadow-soft">
        {children}
      </div>
    </div>
  );
}

function Guard({ children }: { children: ReactNode }) {
  const { status, email, signOut } = useAdminAuth();

  if (status === "loading") {
    return (
      <Centered>
        <Loader2 className="mx-auto size-5 animate-spin text-primary" />
        <p className="mt-3 text-sm font-medium text-ink">Checking admin access</p>
        <p className="mt-1 text-xs text-muted-foreground">This will only take a moment.</p>
      </Centered>
    );
  }

  if (status === "signedOut") return <AdminLogin />;

  if (status === "notAdmin") {
    return (
      <Centered>
        <div className="mx-auto grid size-11 place-items-center rounded-full bg-destructive/10">
          <ShieldCheck className="size-5 text-destructive" aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-display text-xl text-ink">Administrator access required</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {email} is signed in, but this account is not approved to manage the website.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => void signOut()}>
          <LogOut aria-hidden="true" />
          Sign out
        </Button>
      </Centered>
    );
  }

  return <>{children}</>;
}

function Brand() {
  return (
    <Link to="/admin" className="flex min-w-0 items-center gap-3" aria-label="Admin dashboard">
      <BrandLogo size="sm" decorative />
      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold text-white">Trip Zone Admin</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[0.6875rem] font-medium text-white/55">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Website workspace
        </span>
      </span>
    </Link>
  );
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  const links = NAV_GROUPS.map((group) => (
    <div key={group.label} className="space-y-1">
      <p className="px-3 pb-1 pt-4 text-[0.625rem] font-bold uppercase text-white/35">
        {group.label}
      </p>
      {group.items.map((item) => {
        const link = (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="group flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-white/65 transition-colors hover:bg-white/8 hover:text-white"
            activeProps={{ className: "bg-white/12 text-white" }}
          >
            <item.icon
              className="size-4 shrink-0 text-white/45 group-hover:text-accent"
              aria-hidden
            />
            <span>{item.label}</span>
          </Link>
        );
        return mobile ? (
          <SheetClose asChild key={item.to}>
            {link}
          </SheetClose>
        ) : (
          link
        );
      })}
    </div>
  ));

  return <nav className="space-y-1">{links}</nav>;
}

function AccountPanel({ mobile = false }: { mobile?: boolean }) {
  const { email, signOut } = useAdminAuth();
  return (
    <div className="border-t border-white/10 pt-4">
      <p className="truncate px-2 text-xs font-medium text-white/55" title={email ?? ""}>
        {email}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="glass" size="sm" asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" />
            View site
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/65 hover:bg-white/10 hover:text-white"
          onClick={() => void signOut()}
        >
          <LogOut aria-hidden="true" />
          Sign out
        </Button>
      </div>
      {mobile ? (
        <p className="mt-4 text-center text-[0.6875rem] text-white/35">Trip Zone CMS</p>
      ) : null}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface/70 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden h-screen flex-col bg-ink px-4 py-5 lg:sticky lg:top-0 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
          <Navigation />
        </div>
        <div className="mt-5">
          <AccountPanel />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" decorative />
            <div>
              <p className="text-sm font-extrabold text-ink">Trip Zone Admin</p>
              <p className="text-[0.6875rem] text-muted-foreground">Website workspace</p>
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-[19rem] flex-col border-0 bg-ink p-4">
              <SheetHeader className="px-2 text-left">
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigate the Trip Zone website administration area.
                </SheetDescription>
                <Brand />
              </SheetHeader>
              <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
                <Navigation mobile />
              </div>
              <AccountPanel mobile />
            </SheetContent>
          </Sheet>
        </header>

        <main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 xl:px-10 xl:py-9">
          <div className="mx-auto w-full max-w-[96rem]">{children}</div>
        </main>
      </div>
    </div>
  );
}
