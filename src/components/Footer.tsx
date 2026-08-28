import { Link } from "@tanstack/react-router";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { telLink } from "@/data/site";
import { useSite, useTours, useWhatsappLink } from "@/lib/content";
import { CONTACT_EMAIL } from "@/lib/seo";
import { BrandLogo } from "@/components/BrandLogo";

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

function socialIcon(label: string, url: string): LucideIcon {
  const value = `${label} ${url}`.toLowerCase();
  if (value.includes("facebook")) return Facebook;
  if (value.includes("instagram")) return Instagram;
  if (value.includes("youtube") || value.includes("youtu.be")) return Youtube;
  if (value.includes("linkedin")) return Linkedin;
  if (value.includes("twitter") || value.includes("x.com")) return Twitter;
  return ExternalLink;
}

export function Footer() {
  const site = useSite();
  const whatsapp = useWhatsappLink();
  const popularTours = useTours().slice(0, 5);

  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <BrandLogo size="sm" />
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
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm lg:grid-cols-1">
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
                    {t.name}
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
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li className="flex min-w-0 gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="min-w-0 break-all transition-colors hover:text-accent"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            {site.socials.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {site.socials.map((social) => {
                  const SocialIcon = socialIcon(social.label, social.url);
                  return (
                    <a
                      key={social.url}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${social.label}`}
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-primary-foreground/15 px-3 py-2 text-xs font-semibold text-primary-foreground/75 transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      <SocialIcon className="size-4" aria-hidden="true" />
                      {social.label}
                      <ExternalLink className="size-3 opacity-55" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-primary-foreground/12 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>{site.address}</p>
        </div>
      </div>
    </footer>
  );
}
