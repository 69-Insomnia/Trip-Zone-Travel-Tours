import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  decorative?: boolean;
};

const sizes = {
  sm: "size-9 p-1.5",
  md: "size-11 p-1.5",
  lg: "size-12 p-1.5",
};

export function BrandLogo({ size = "md", className, decorative = false }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5",
        sizes[size],
        className,
      )}
    >
      <img
        src="/logo.png"
        alt={decorative ? "" : "Trip Zone Travel & Tours"}
        className="size-full object-contain"
        width="48"
        height="48"
      />
    </span>
  );
}
