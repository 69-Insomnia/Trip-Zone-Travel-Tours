import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { destinations } from "@/data/tours";
import { site, whatsappLink } from "@/data/site";

type Fields = {
  name: string;
  phone: string;
  email: string;
  destination: string;
  date: string;
  travelers: string;
  message: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  date: "",
  travelers: "",
  message: "",
};

function validate(values: Fields) {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your full name.";
  if (!/^[\d+\-\s]{7,15}$/.test(values.phone.trim()))
    errors.phone = "Please enter a valid phone number.";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (values.travelers && Number(values.travelers) < 1)
    errors.travelers = "Travellers must be at least 1.";
  if (values.message.trim().length < 10)
    errors.message = "Tell us a little more (at least 10 characters).";
  return errors;
}

const inputClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-ring/30";

export function ContactForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sending, setSending] = useState(false);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  function Field({
    label,
    name,
    children,
  }: {
    label: string;
    name: keyof Fields;
    children: React.ReactNode;
  }) {
    return (
      <div>
        <label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-muted-foreground">
          {label}
        </label>
        {children}
        {errors[name] ? (
          <p className="mt-1.5 text-xs font-medium text-destructive">{errors[name]}</p>
        ) : null}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    setSending(true);
    // No backend is connected yet — the inquiry is handed off to WhatsApp.
    const text = [
      `New inquiry from ${values.name}`,
      `Phone: ${values.phone}`,
      values.email && `Email: ${values.email}`,
      values.destination && `Destination: ${values.destination}`,
      values.date && `Travel date: ${values.date}`,
      values.travelers && `Travellers: ${values.travelers}`,
      "",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappLink(site.phones[0], text), "_blank", "noopener,noreferrer");
    setSending(false);
    setValues(empty);
    toast.success("Inquiry ready to send", {
      description: "We opened WhatsApp with your details — press send and we'll reply shortly.",
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="hairline rounded-2xl bg-card p-5 shadow-soft md:p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name *" name="name">
          <input
            id="name"
            className={inputClass}
            value={values.name}
            onChange={set("name")}
            placeholder="Your full name"
            autoComplete="name"
          />
        </Field>
        <Field label="Phone *" name="phone">
          <input
            id="phone"
            className={inputClass}
            value={values.phone}
            onChange={set("phone")}
            placeholder="98XXXXXXXX"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
        <Field label="Email" name="email">
          <input
            id="email"
            className={inputClass}
            value={values.email}
            onChange={set("email")}
            placeholder="you@example.com"
            inputMode="email"
            autoComplete="email"
          />
        </Field>
        <Field label="Destination" name="destination">
          <select
            id="destination"
            className={inputClass}
            value={values.destination}
            onChange={set("destination")}
          >
            <option value="">Select a destination</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Travel date" name="date">
          <input
            id="date"
            type="date"
            className={inputClass}
            value={values.date}
            onChange={set("date")}
          />
        </Field>
        <Field label="Number of travellers" name="travelers">
          <input
            id="travelers"
            type="number"
            min={1}
            max={60}
            className={inputClass}
            value={values.travelers}
            onChange={set("travelers")}
            placeholder="2"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message *" name="message">
          <textarea
            id="message"
            rows={5}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/50 focus:ring-2 focus:ring-ring/30"
            value={values.message}
            onChange={set("message")}
            placeholder="Tell us your plan — dates, group size, preferred vehicle."
          />
        </Field>
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="mt-6 w-full sm:w-auto"
        disabled={sending}
      >
        <Send aria-hidden="true" />
        {sending ? "Sending…" : "Send Inquiry"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Your inquiry opens in WhatsApp so our team can reply instantly.
      </p>
    </form>
  );
}
