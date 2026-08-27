import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { site, telLink, whatsappLink } from "@/data/site";

export function BookingCTA({
  title = "Ready to Explore Nepal?",
  subtitle = "Let's plan your next unforgettable journey.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="section-y bg-ink">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="display-section text-primary-foreground">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-primary-foreground/75 md:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <a href={whatsappLink(site.phones[0])} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" />
                WhatsApp Now
              </a>
            </Button>
            <Button asChild variant="glass" size="lg" className="w-full sm:w-auto">
              <a href={telLink(site.phones[0])}>
                <Phone aria-hidden="true" />
                Call {site.phones[0]}
              </a>
            </Button>
          </div>
          <p className="mt-6 text-sm text-primary-foreground/60">
            Or reach us on{" "}
            <a
              href={telLink(site.phones[1])}
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              {site.phones[1]}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
