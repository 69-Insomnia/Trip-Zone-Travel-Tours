import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDestinations } from "@/lib/content";

const tourTypes = ["Any type", "Mountain", "Pilgrimage", "Nature"];

export function SearchPanel() {
  const destinations = useDestinations();
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("Any type");

  const fieldClass =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-ink outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-ring/30";

  return (
    <form
      className="glass-panel rounded-xl p-3.5 md:p-4"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({
          to: "/tours",
          search: {
            destination: destination || undefined,
            type: type !== "Any type" ? type : undefined,
          },
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Compass className="size-3.5" aria-hidden="true" /> Destination
          </span>
          <select
            className={fieldClass}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Anywhere in Nepal</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Search className="size-3.5" aria-hidden="true" /> Tour type
          </span>
          <select className={fieldClass} value={type} onChange={(e) => setType(e.target.value)}>
            {tourTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <Button type="submit" variant="accent" size="lg" className="w-full lg:w-auto">
            <Search aria-hidden="true" />
            Find tours
          </Button>
        </div>
      </div>
    </form>
  );
}
