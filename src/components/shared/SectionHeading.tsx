import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  size = "h2",
  className,
}: {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h2";
  className?: string;
}) {
  if (!title && !eyebrow) return null;
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && (
        <Reveal y={12}>
          <Heading className={size === "display" ? "text-display" : "text-h2"}>{title}</Heading>
        </Reveal>
      )}
      {description && (
        <Reveal delay={0.08}>
          <p className="text-lead max-w-xl">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
