import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { telLink } from "@/data/site";
import { useSite, useWhatsappLink } from "@/lib/content";

export function BookingCTA({
  title = "Ready to Explore Nepal?",
  subtitle = "Let's plan your next unforgettable journey.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const site = useSite();
  const whatsapp = useWhatsappLink();
  const secondPhone = site.phones[1];

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
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" />
                WhatsApp Now
              </a>
            </Button>
            <Button asChild variant="glass" size="lg" className="w-full sm:w-auto">
              <a href={telLink(site.primaryPhone)}>
                <Phone aria-hidden="true" />
                Call {site.primaryPhone}
              </a>
            </Button>
          </div>
          {secondPhone ? (
            <p className="mt-6 text-sm text-primary-foreground/60">
              Or reach us on{" "}
              <a
                href={telLink(secondPhone)}
                className="font-semibold text-accent underline-offset-4 hover:underline"
              >
                {secondPhone}
              </a>
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
