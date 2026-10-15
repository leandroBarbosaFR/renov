import { cn } from "@/lib/utils";

/** Calm placeholder shown when content hasn't been added in Sanity yet. */
export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border border-dashed border-line bg-paper/40 px-6 py-16 text-center", className)}>
      <p className="text-h3">{title}</p>
      {description && <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone">{description}</p>}
    </div>
  );
}
