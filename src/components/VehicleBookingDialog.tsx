import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { CalendarDays, Clock, MapPin, Send, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitInquiry } from "@/data/queries";

export type Vehicle = {
  image: string;
  title: string;
  note: string;
};

export type FareOption = {
  id: string;
  group: "Route fares" | "Daily hire";
  label: string;
  location: string;
  price: number;
  suffix?: string;
};

type Fields = {
  name: string;
  phone: string;
  fareId: string;
  date: string;
  time: string;
  pickup: string;
  travelers: string;
};

const emptyFields: Fields = {
  name: "",
  phone: "",
  fareId: "",
  date: "",
  time: "",
  pickup: "",
  travelers: "",
};

const inputClass =
  "h-11 rounded-lg bg-card px-3.5 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-ring/25";

const formatNpr = (price: number) => `NPR ${new Intl.NumberFormat("en-IN").format(price)}`;

export function VehicleBookingDialog({
  vehicle,
  fares,
  open,
  onOpenChange,
}: {
  vehicle: Vehicle | null;
  fares: FareOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [values, setValues] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sending, setSending] = useState(false);
  const selectedFare = fares.find((fare) => fare.id === values.fareId);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function set(key: keyof Fields, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function close(nextOpen: boolean) {
    if (!nextOpen && !sending) {
      setValues(emptyFields);
      setErrors({});
    }
    onOpenChange(nextOpen);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!vehicle) return;

    const found: Partial<Record<keyof Fields, string>> = {};
    if (values.name.trim().length < 2) found.name = "Enter the passenger name.";
    if (!/^[\d+\-\s]{7,15}$/.test(values.phone.trim())) found.phone = "Enter a valid phone number.";
    if (!selectedFare) found.fareId = "Choose a place or hire plan.";
    if (!values.date) found.date = "Choose a travel date.";
    if (!values.time) found.time = "Choose a pickup time.";
    if (values.pickup.trim().length < 2) found.pickup = "Enter the pickup location.";
    if (!values.travelers || Number(values.travelers) < 1)
      found.travelers = "Enter at least one passenger.";

    setErrors(found);
    if (Object.keys(found).length > 0 || !selectedFare) {
      toast.error("Please complete the required booking details.");
      return;
    }

    setSending(true);
    try {
      await submitInquiry({
        name: values.name,
        phone: values.phone,
        destination: selectedFare.location,
        travelDate: values.date,
        travelTime: values.time,
        travelers: Number(values.travelers),
        pickupLocation: values.pickup,
        vehicleName: vehicle.title,
        vehicleImage: vehicle.image,
        fareLabel: selectedFare.label,
        quotedPrice: selectedFare.price,
        source: "vehicle-booking",
        message: [
          `Vehicle booking request for ${vehicle.title}.`,
          `Fare: ${selectedFare.label}`,
          `Quoted price: ${formatNpr(selectedFare.price)}${selectedFare.suffix ?? ""}`,
          `Pickup: ${values.pickup.trim()}`,
          `Travel date and time: ${values.date} ${values.time}`,
          `Passengers: ${values.travelers}`,
        ].join("\n"),
      });
      toast.success("Booking request received", {
        description: "Trip Zone will contact you to confirm the vehicle and final fare.",
      });
      close(false);
    } catch (error) {
      console.error("[vehicle-booking] could not be saved:", error);
      toast.error("Could not send the booking request", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        <div className="grid md:grid-cols-[16rem_1fr]">
          <div className="border-b border-border bg-surface p-5 md:border-b-0 md:border-r">
            <img
              src={vehicle.image}
              alt={vehicle.title}
              className="aspect-[4/3] w-full rounded-lg bg-white object-cover"
              width="640"
              height="480"
            />
            <p className="mt-4 text-xs font-bold uppercase text-primary/70">Selected vehicle</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-ink">{vehicle.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{vehicle.note}</p>
            {selectedFare ? (
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs font-bold text-muted-foreground">Selected fare</p>
                <p className="mt-1 text-sm font-semibold text-ink">{selectedFare.label}</p>
                <p className="mt-1 text-lg font-extrabold text-primary">
                  {formatNpr(selectedFare.price)}
                  {selectedFare.suffix ?? ""}
                </p>
              </div>
            ) : null}
          </div>

          <div className="p-5 sm:p-7">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-ink">
                Book this vehicle
              </DialogTitle>
              <DialogDescription>
                Submit the trip details below. The request will appear in the Trip Zone admin
                inquiry inbox.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name}>
                  <Input
                    value={values.name}
                    onChange={(event) => set("name", event.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone number" error={errors.phone}>
                  <Input
                    type="tel"
                    value={values.phone}
                    onChange={(event) => set("phone", event.target.value)}
                    placeholder="98XXXXXXXX"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Place or hire plan" error={errors.fareId}>
                <Select value={values.fareId} onValueChange={(value) => set("fareId", value)}>
                  <SelectTrigger className="h-11 rounded-lg bg-card px-3.5 shadow-none">
                    <SelectValue placeholder="Choose destination or daily hire" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {(["Route fares", "Daily hire"] as const).map((group) => (
                      <SelectGroup key={group}>
                        <SelectLabel>{group}</SelectLabel>
                        {fares
                          .filter((fare) => fare.group === group)
                          .map((fare) => (
                            <SelectItem key={fare.id} value={fare.id}>
                              {fare.label} - {formatNpr(fare.price)}
                              {fare.suffix ?? ""}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Travel date" error={errors.date} icon={CalendarDays}>
                  <Input
                    type="date"
                    min={today}
                    value={values.date}
                    onChange={(event) => set("date", event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Pickup time" error={errors.time} icon={Clock}>
                  <Input
                    type="time"
                    value={values.time}
                    onChange={(event) => set("time", event.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.4fr_.6fr]">
                <Field label="Pickup location" error={errors.pickup} icon={MapPin}>
                  <Input
                    value={values.pickup}
                    onChange={(event) => set("pickup", event.target.value)}
                    placeholder="Hotel, area or address"
                    autoComplete="street-address"
                    className={inputClass}
                  />
                </Field>
                <Field label="Persons" error={errors.travelers} icon={Users}>
                  <Input
                    type="number"
                    min="1"
                    max="200"
                    value={values.travelers}
                    onChange={(event) => set("travelers", event.target.value)}
                    placeholder="1"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                <Send aria-hidden="true" />
                {sending ? "Sending booking" : "Send booking request"}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  icon: Icon,
  children,
}: {
  label: string;
  error?: string | undefined;
  icon?: typeof MapPin;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
