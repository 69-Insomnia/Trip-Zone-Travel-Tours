import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { site, telLink, primaryWhatsapp } from "@/data/site";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Trip Zone Travel & Tours" },
      {
        name: "description",
        content:
          "Contact Trip Zone Travel & Tours in Koteshwor, Kathmandu to plan your Nepal journey.",
      },
    ],
  }),
  component: ContactPage,
});
function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Start planning"
        title="Tell us where Nepal is calling you."
        subtitle="Share your dates, group size and preferred route. We will reply with the right options."
        image="https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=2200&q=88"
        imageAlt="Kathmandu cityscape and temple architecture"
        imagePosition="center 42%"
      />
      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
          <Reveal>
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl text-ink">
                  Trip Zone Travel & Tours Pvt. Ltd.
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our office is in Koteshwor, Kathmandu, Nepal.
                </p>
              </div>
              <a
                href={`tel:+977${site.phones[0]}`}
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary"
              >
                <Phone className="mt-0.5 size-5 text-primary" />
                {site.phones[0]}
              </a>
              <a
                href={primaryWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="mt-0.5 size-5 text-forest" />
                Chat on WhatsApp
              </a>
              <p className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-5 text-accent" />
                {site.address}
              </p>
              <div className="hairline flex min-h-48 items-center justify-center rounded-3xl bg-surface p-8 text-center text-sm text-muted-foreground">
                Google Maps location placeholder
                <br />
                Koteshwor, Kathmandu
              </div>
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
