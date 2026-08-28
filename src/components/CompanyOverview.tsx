import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, Phone, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNpr, startingPrice } from "@/data/tours";
import { useSite, useTours } from "@/lib/content";
import { CONTACT_EMAIL } from "@/lib/seo";

export function CompanyOverview() {
  const site = useSite();
  const tours = useTours();
  const prices = tours.map(startingPrice);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;

  return (
    <section className="section-y border-y border-border bg-surface">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <span className="eyebrow">Local travel company</span>
          <h2 className="display-section mt-4 text-ink">
            Nepal tours and pilgrimages from Kathmandu
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            {site.name} is based in Koteshwor, Kathmandu. The company organises road tours,
            pilgrimage journeys, short treks and nature trips for families, groups, couples and
            spiritual travellers.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Current routes include Char Dham, Gosaikunda, Aama Yangri, Dhorpatan, Manang, Muktinath,
            Pathivara, Halesi Mahadev, Sailung and Kalinchowk. Every package page shows its
            itinerary, duration, transport choices, inclusions and per-person price.
          </p>
          <Button asChild variant="outline" className="mt-7">
            <Link to="/about">
              About Trip Zone <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <dl className="border-y border-border">
          <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="flex items-center gap-2 text-sm font-bold text-ink">
              <MapPin className="size-4 text-primary" aria-hidden="true" /> Office
            </dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">{site.address}</dd>
          </div>
          <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="flex items-center gap-2 text-sm font-bold text-ink">
              <RouteIcon className="size-4 text-primary" aria-hidden="true" /> Packages
            </dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">
              {tours.length} published mountain, pilgrimage and nature itineraries, from short
              overnight trips to the 15-day Char Dham pilgrimage.
            </dd>
          </div>
          <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="text-sm font-bold text-ink">Price range</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">
              {lowestPrice && highestPrice
                ? `${formatNpr(lowestPrice)} to ${formatNpr(highestPrice)} per person, depending on the route and transport option.`
                : "Prices are listed on each package page."}
            </dd>
          </div>
          <div className="grid gap-2 border-b border-border py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="flex items-center gap-2 text-sm font-bold text-ink">
              <Phone className="size-4 text-primary" aria-hidden="true" /> Phone
            </dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {site.phones.map((phone) => (
                <span key={phone}>{phone}</span>
              ))}
            </dd>
          </div>
          <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="flex items-center gap-2 text-sm font-bold text-ink">
              <Mail className="size-4 text-primary" aria-hidden="true" /> Email
            </dt>
            <dd className="min-w-0 text-sm text-muted-foreground">
              <a href={`mailto:${CONTACT_EMAIL}`} className="break-all hover:text-primary">
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
