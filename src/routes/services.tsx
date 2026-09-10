import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  CarFront,
  Check,
  ClipboardCheck,
  Headphones,
  Headset,
  MapPin,
  Route as RouteIcon,
  ShieldCheck,
  Snowflake,
  TicketCheck,
} from "lucide-react";
import { BookingCTA } from "@/components/BookingCTA";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import {
  VehicleBookingDialog,
  type FareOption,
  type Vehicle,
} from "@/components/VehicleBookingDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { breadcrumbJsonLd, seoHead, serviceListJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () => ({
    ...seoHead({
      title: "Car Hire & Nepal Travel Services | Trip Zone",
      description:
        "Book comfortable car hire from Kathmandu, private vehicles, EV vans, Jeeps and tourist buses with itinerary and accommodation support across Nepal.",
      path: "/services",
      // Purpose-built 1200x630 crop. The on-page fleet images are WebP, which
      // social scrapers still handle unreliably, so the card gets its own JPEG.
      // Regenerate with `npm run media:optimize`.
      image: "/vehicles/byd-atto-3-og.jpg",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services" }]),
        ),
      },
      // Built from the same `services` array the page renders, so the markup
      // cannot describe services the page does not list.
      {
        type: "application/ld+json",
        children: JSON.stringify(serviceListJsonLd(services)),
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: CarFront,
    title: "Car and vehicle hire",
    copy: "Hire a clean, well-maintained vehicle with an experienced driver for one-way routes, return journeys or multi-day travel.",
  },
  {
    icon: ClipboardCheck,
    title: "Complete tour planning",
    copy: "We coordinate transport, accommodation, meals, sightseeing and practical timing around your chosen journey.",
  },
  {
    icon: Headset,
    title: "Personal travel support",
    copy: "Reach the Trip Zone team by phone or WhatsApp before departure and throughout your trip.",
  },
  {
    icon: RouteIcon,
    title: "Flexible arrangements",
    copy: "Choose private travel, group departures or a custom plan with the vehicle and stops that suit your group.",
  },
];

const fleet: Vehicle[] = [
  { image: "/vehicles/ev-hatch.webp", title: "Compact EV", note: "City trips and couples" },
  {
    image: "/vehicles/byd-atto-3.webp",
    title: "Electric SUV",
    note: "Comfortable regional travel",
  },
  {
    image: "/vehicles/byd-yuan-plus.webp",
    title: "Premium EV SUV",
    note: "Spacious private journeys",
  },
  { image: "/vehicles/ev-sedan.webp", title: "Electric sedan", note: "Quiet long-distance travel" },
  { image: "/vehicles/nissan-magnite.webp", title: "Compact SUV", note: "Flexible road trips" },
  { image: "/vehicles/scorpio.webp", title: "Scorpio / Jeep", note: "Groups and hill routes" },
  { image: "/vehicles/ev-suv.webp", title: "Rugged EV SUV", note: "Roomy adventure travel" },
  { image: "/vehicles/ev-van.jpg", title: "EV passenger van", note: "Families and small groups" },
  {
    image: "/vehicles/tourist-bus-kathmandu.jpg",
    title: "Tourist bus",
    note: "Large groups and departures",
  },
];

const routeFares = [
  ["Pokhara", 10500],
  ["Butwal", 16000],
  ["Chitwan", 9500],
  ["Janakpur", 10500],
  ["Birgunj", 9500],
  ["Dharan", 16000],
  ["Biratnagar", 17000],
  ["Itahari", 16000],
  ["Hetauda", 7000],
  ["Kalaiya", 9500],
  ["Birtamode, Jhapa", 18000],
  ["Sarlahi", 9500],
  ["Mahendranagar", 40000],
] as const;

const specialFares = [
  ["Gupteshwor Mahadev", "Up and down", 8000],
  ["Manakamana", "Up and down", 8000],
] as const;

const rentalTiers = [
  ["Standard daily hire", 7000],
  ["10-day hire", 7000],
  ["20-day hire", 6000],
  ["One-month hire", 5000],
] as const;

const fareOptions: FareOption[] = [
  ...routeFares.map(([destination, price]) => ({
    id: `route-${destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    group: "Route fares" as const,
    label: `Kathmandu to ${destination}`,
    location: destination,
    price,
  })),
  ...specialFares.map(([destination, note, price]) => ({
    id: `route-${destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    group: "Route fares" as const,
    label: `${destination} - ${note}`,
    location: destination,
    price,
  })),
  ...rentalTiers.map(([label, price]) => ({
    id: `hire-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    group: "Daily hire" as const,
    label,
    location: label,
    price,
    suffix: " / day",
  })),
];

const included = [
  { icon: MapPin, text: "Stops arranged around your route" },
  { icon: BadgeCheck, text: "Clean, well-maintained vehicle" },
  { icon: ShieldCheck, text: "Full insurance coverage" },
  { icon: Snowflake, text: "AC, heater and comfortable seating" },
  { icon: Headphones, text: "Good music system" },
];

const formatNpr = (price: number) => `NPR ${new Intl.NumberFormat("en-IN").format(price)}`;

function ServicesPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Travel and vehicle services"
        title="The right vehicle for every road."
        subtitle="Car hire from Kathmandu, private tour transport and complete journey support for travel across Nepal."
        image="/vehicles/tourist-bus-kathmandu.jpg"
        imageAlt="Tourist bus with a green tourist number plate on a street in Kathmandu"
        imagePosition="center 60%"
      >
        <Breadcrumbs tone="light" items={[{ label: "Home", to: "/" }, { label: "Services" }]} />
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="How we help"
            title="Travel arrangements, handled clearly"
            subtitle="Book transport on its own or let our local team coordinate the complete trip around your dates and group."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {services.map(({ icon: Icon, title, copy }, i) => (
              <Reveal key={title} delay={i * 80}>
                <article className="hairline h-full rounded-xl bg-card p-7 shadow-soft">
                  <Icon className="size-7 text-primary" aria-hidden="true" />
                  <h2 className="mt-6 font-display text-2xl text-ink">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading
            eyebrow="Vehicle options"
            title="Choose for your route and group"
            subtitle="From efficient electric cars to Scorpio, EV vans and tourist buses, we match the vehicle to the road and passenger count."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map((vehicle, i) => (
              <Reveal key={vehicle.image} delay={(i % 3) * 70}>
                <figure className="hairline group overflow-hidden rounded-lg bg-card shadow-soft">
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                      className="size-full object-cover transition duration-500 group-hover:scale-[1.025]"
                      loading="lazy"
                      width="960"
                      height="720"
                    />
                  </div>
                  <figcaption className="flex min-h-24 items-center justify-between gap-4 border-t border-border px-5 py-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {vehicle.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{vehicle.note}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="shrink-0"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      <TicketCheck aria-hidden="true" />
                      Book now
                    </Button>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Vehicle images are representative. Exact model, seating and availability are confirmed
            when you book.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Kathmandu car hire"
              title="Published route fare guide"
              subtitle="One-way car fares listed in the Trip Zone service sheet. Contact us to confirm your date, pickup point and vehicle."
            />
            <div className="hairline mt-9 overflow-hidden rounded-lg bg-card shadow-soft">
              <Table>
                <TableHeader>
                  <TableRow className="bg-surface hover:bg-surface">
                    <TableHead className="px-5 py-3 font-bold text-ink">
                      Route from Kathmandu
                    </TableHead>
                    <TableHead className="px-5 py-3 text-right font-bold text-ink">Fare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routeFares.map(([destination, price]) => (
                    <TableRow key={destination}>
                      <TableCell className="px-5 py-3.5 font-medium text-ink">
                        {destination}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-right font-semibold text-primary">
                        {formatNpr(price)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {specialFares.map(([destination, note, price]) => (
                    <TableRow key={destination}>
                      <TableCell className="px-5 py-3.5">
                        <span className="block font-medium text-ink">{destination}</span>
                        <span className="text-xs text-muted-foreground">{note}</span>
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-right font-semibold text-primary">
                        {formatNpr(price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Fares are a guide from the supplied service sheet and may change with fuel, road
              conditions, pickup location, season and vehicle choice.
            </p>
          </div>

          <div className="space-y-10">
            <div>
              <span className="eyebrow">Long-term hire</span>
              <h2 className="display-section mt-4 text-ink">Better daily rates for longer trips</h2>
              <div className="mt-7 divide-y divide-border border-y border-border">
                {rentalTiers.map(([duration, price]) => (
                  <div key={duration} className="flex items-center justify-between gap-4 py-4">
                    <span className="flex items-center gap-3 text-sm font-semibold text-ink">
                      <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      {duration}
                    </span>
                    <span className="text-right text-sm font-bold text-primary">
                      {duration === "Standard daily hire" ? "From " : ""}
                      {formatNpr(price)} / day
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="eyebrow">Included with the vehicle</span>
              <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
                Comfort and peace of mind
              </h2>
              <ul className="mt-6 space-y-4">
                {included.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/20 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex items-start gap-3 border-l-2 border-accent pl-4 text-sm leading-relaxed text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden="true" />
                Experienced driver support is arranged with the vehicle. Tell us your passengers,
                luggage and route so we can recommend the best option.
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingCTA
        title="Need a car, EV van or bus?"
        subtitle="Share your pickup, destination, travel date and group size for current availability and a confirmed quote."
      />
      <VehicleBookingDialog
        vehicle={selectedVehicle}
        fares={fareOptions}
        open={selectedVehicle !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedVehicle(null);
        }}
      />
    </>
  );
}
