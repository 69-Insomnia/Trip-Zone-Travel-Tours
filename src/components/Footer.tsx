import { Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { site, telLink, whatsappLink } from "@/data/site";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Tours", to: "/tours" },
  { label: "Destinations", to: "/destinations" },
  { label: "Gallery", to: "/gallery" },
  { label: "Blogs", to: "/blogs" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

const popularTours = [
  { label: "Manang", slug: "manang" },
  { label: "Muktinath", slug: "muktinath" },
  { label: "Kalinchowk", slug: "sailung-kalinchowk" },
  { label: "Pathivara", slug: "pathivara" },
  { label: "Halesi", slug: "halesi-mahadev" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Trip Zone Travel & Tours"
                className="size-10 shrink-0 rounded-xl bg-white p-1 object-contain"
                width="40"
                height="40"
              />
              <span className="font-display text-lg font-semibold">Trip Zone</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70">
              {site.name} organises guided Nepal journeys — mountain valleys, pilgrimage sites,
              cultural towns and short scenic escapes — with comfortable transport and carefully
              planned itineraries.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-accent">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-primary-foreground/75 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-accent">
              Popular Tours
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {popularTours.map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/tours/$slug"
                    params={{ slug: t.slug }}
                    className="text-primary-foreground/75 transition-colors hover:text-accent"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.16em] uppercase text-accent">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{site.address}</span>
              </li>
              {site.phones.map((p) => (
                <li key={p} className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <a href={telLink(p)} className="transition-colors hover:text-accent">
                    {p}
                  </a>
                </li>
              ))}
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={whatsappLink(site.phones[0])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
            {site.socials.length > 0 ? (
              <div className="mt-6 flex gap-3">
                {site.socials.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-foreground/75 hover:text-accent"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-xs text-primary-foreground/45">
                Facebook, Instagram and TikTok links will appear here once profile URLs are
                provided.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-primary-foreground/12 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Koteshwor, Kathmandu · Nepal</p>
        </div>
      </div>
    </footer>
  );
}
