export const site = {
  name: "Trip Zone Travel & Tours Pvt. Ltd.",
  shortName: "Trip Zone",
  tagline: "Explore Nepal. Experience the Journey.",
  address: "Koteshwor, Kathmandu, Nepal",
  phones: ["9861509342", "9813844496"],
  /** Social profiles are intentionally empty until real URLs are provided. */
  socials: [] as { label: string; url: string }[],
} as const;

const waMessage = "Hello Trip Zone, I would like to know more about your Nepal tour packages.";

/** WhatsApp deep link for a given local Nepali number. */
export function whatsappLink(phone: string, message: string = waMessage) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("977") ? digits : `977${digits}`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string) {
  return `tel:+977${phone.replace(/\D/g, "")}`;
}

export const primaryWhatsapp = whatsappLink(site.phones[0]);
