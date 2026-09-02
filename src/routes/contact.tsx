import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { telLink } from "@/data/site";
import { usePhoto, useSite, useWhatsappLink } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { breadcrumbJsonLd, CONTACT_EMAIL, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...seoHead({
      title: "Contact Trip Zone Travel & Tours | Koteshwor, Kathmandu",
      description:
        "Contact Trip Zone Travel & Tours in Koteshwor, Kathmandu by phone, WhatsApp or email to plan your Nepal journey.",
      path: "/contact",
      image: "/photos/kathmandu.jpg",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact" }]),
        ),
      },
    ],
  }),
  component: ContactPage,
});
function ContactPage() {
  const site = useSite();
  const whatsapp = useWhatsappLink();
  // Kathmandu Durbar Square - the city the office is actually in, and this
  // route's og:image.
  const hero = usePhoto("kathmandu");

  return (
    <>
      <PageHero
        eyebrow="Start planning"
        title="Tell us where Nepal is calling you."
        subtitle="Share your dates, group size and preferred route. We will reply with the right options."
        image={hero.src}
        imageAlt={hero.alt}
        imagePosition="center 42%"
      >
        <Breadcrumbs tone="light" items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
      </PageHero>
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <Reveal>
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-ink">{site.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our office is in {site.address}.
                </p>
              </div>
              {site.phones.map((phone) => (
                <a
                  key={phone}
                  href={telLink(phone)}
                  className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary"
                >
                  <Phone className="mt-0.5 size-5 text-primary" />
                  {phone}
                </a>
              ))}
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="mt-0.5 size-5 text-forest" />
                Chat on WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="mt-0.5 size-5 text-primary" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-5 text-accent" aria-hidden="true" />
                {site.address}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hairline group flex min-h-40 flex-col justify-between rounded-xl bg-surface p-6 transition-colors hover:bg-secondary"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-card text-primary shadow-soft">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <span className="mt-8 flex items-end justify-between gap-4">
                  <span>
                    <span className="block text-xs font-bold uppercase text-muted-foreground">
                      Visit our office
                    </span>
                    <span className="mt-1 block font-display text-lg font-bold text-ink">
                      Koteshwor, Kathmandu
                    </span>
                  </span>
                  <ExternalLink
                    className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
