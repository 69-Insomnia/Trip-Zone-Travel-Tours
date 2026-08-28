import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  children?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  imagePosition = "center",
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[30rem] items-end overflow-hidden bg-ink pb-16 pt-28 text-primary-foreground md:min-h-[34rem] md:pb-20 md:pt-36",
        className,
      )}
    >
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 -z-20 size-full object-cover"
        style={{ objectPosition: imagePosition }}
        width="1920"
        height="1080"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,24,35,.94)_0%,rgba(3,24,35,.76)_43%,rgba(3,24,35,.3)_72%,rgba(3,24,35,.15)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink/65 to-transparent" />
      <div className="container-page">
        {children}
        <div className={cn("max-w-3xl", children && "mt-8")}>
          {eyebrow ? <span className="eyebrow text-accent">{eyebrow}</span> : null}
          <h1 className="display-hero mt-5">{title}</h1>
          {subtitle ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/78 md:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
