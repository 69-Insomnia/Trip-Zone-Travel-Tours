import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFaqs } from "@/lib/content";

export function FaqAccordion({ items }: { items?: { q: string; a: string }[] }) {
  const faqs = useFaqs();
  const questions = items ?? faqs;

  return (
    <Accordion type="single" collapsible className="w-full">
      {questions.map((item, i) => (
        <AccordionItem
          key={item.q}
          value={`item-${i}`}
          className="hairline mb-3 rounded-lg bg-card px-5 shadow-soft"
        >
          <AccordionTrigger className="py-5 text-left font-display text-base text-ink hover:no-underline md:text-lg">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
