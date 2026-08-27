import { MessageCircle } from "lucide-react";
import { primaryWhatsapp } from "@/data/site";

/** Fixed mobile-first WhatsApp action, present on every page. */
export function WhatsAppButton() {
  return (
    <a
      href={primaryWhatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Trip Zone on WhatsApp"
      className="fixed right-4 bottom-4 z-50 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-whatsapp-foreground shadow-lift transition-transform duration-300 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none md:right-6 md:bottom-6"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
