import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, align = "left", className }: Props) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <span className="eyebrow">
          <span className="h-px w-6 bg-current" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="display-section mt-3 text-ink md:mt-4">{title}</h2>
      {subtitle ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:mt-4 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
