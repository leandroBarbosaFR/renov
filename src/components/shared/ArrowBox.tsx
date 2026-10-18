import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-9",
  md: "size-10",
  lg: "size-12",
};

/**
 * Filled square holding a centered horizontal arrow. Inside a `group`, hovering or
 * focusing the parent slides the arrow out to the right while a second one slides in.
 * Pass background/text colors through `className`.
 */
export function ArrowBox({ size = "md", className }: { size?: keyof typeof sizes; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-card transition-colors duration-300",
        sizes[size],
        className,
      )}
    >
      <ArrowRight
        strokeWidth={1.5}
        className="size-[18px] transition-transform duration-500 ease-out-soft group-hover:translate-x-[250%] group-focus-visible:translate-x-[250%]"
      />
      <ArrowRight
        strokeWidth={1.5}
        className="absolute size-[18px] -translate-x-[250%] transition-transform duration-500 ease-out-soft group-hover:translate-x-0 group-focus-visible:translate-x-0"
      />
    </span>
  );
}
