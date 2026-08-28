/**
 * Sign-in screen for the protected admin workspace.
 */

import { Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { useAdminAuth } from "@/lib/admin-auth";

const control =
  "h-12 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary/50 focus:ring-2 focus:ring-ring/20";

export function AdminLogin() {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const failure = await signIn(email, password);
    setBusy(false);
    if (failure) {
      setError(/invalid login/i.test(failure) ? "The email or password is incorrect." : failure);
    }
  }

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(20rem,.8fr)_minmax(0,1.2fr)]">
      <aside className="relative hidden overflow-hidden bg-ink p-10 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3 text-white">
          <BrandLogo size="lg" decorative />
          <span>
            <span className="block text-base font-extrabold">Trip Zone</span>
            <span className="text-xs text-white/50">Travel & Tours Pvt. Ltd.</span>
          </span>
        </Link>

        <div className="max-w-md">
          <div className="grid size-12 place-items-center rounded-lg bg-white/10 text-accent">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-4xl leading-tight text-white">
            Website administration
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Secure access for the Trip Zone team.
          </p>
        </div>

        <p className="text-xs text-white/35">Trip Zone Travel & Tours Pvt. Ltd.</p>
      </aside>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-3">
              <BrandLogo decorative />
              <span>
                <span className="block text-sm font-extrabold text-ink">Trip Zone Admin</span>
                <span className="text-xs text-muted-foreground">Secure workspace</span>
              </span>
            </Link>
          </div>

          <div>
            <p className="text-xs font-bold uppercase text-primary/70">Administrator access</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your approved Trip Zone administrator account.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-bold text-ink">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                className={control}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="username"
                autoFocus
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-xs font-bold text-ink">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  className={control + " pr-12"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <LockKeyhole aria-hidden="true" />
              )}
              {busy ? "Signing in" : "Sign in securely"}
            </Button>
          </form>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft aria-hidden="true" />
                Back to website
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Contact an administrator to reset access.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
