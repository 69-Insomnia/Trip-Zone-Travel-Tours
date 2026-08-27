import { Quote } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { testimonials } from "@/data/tours";

export function Testimonials() {
  return (
    <section className="section-y bg-surface">
      <div className="container-page">
        <SectionHeading
          eyebrow="Traveller stories"
          title="What travellers say"
          subtitle="Reviews collected from Trip Zone guests. The entries below are placeholders during development and will be replaced with real customer reviews."
          align="center"
        />

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal as="li" key={i} delay={i * 90}>
              <figure className="hairline flex h-full flex-col rounded-3xl bg-card p-7 shadow-soft">
                <Quote className="size-7 text-accent" aria-hidden="true" />
                <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-5">
                  <span className="block font-display text-base text-ink">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {t.location} · {t.tour}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
