import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CtaData } from "@/lib/types";
import { clean, cn, isExternalHref } from "@/lib/utils";

type Variant = "primary" | "outline" | "light" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-olive text-sand hover:bg-olive-deep border-olive hover:border-olive-deep",
  outline: "border-ink/80 text-ink hover:bg-ink hover:text-sand",
  light: "bg-sand text-ink border-sand hover:bg-paper hover:border-paper",
  "outline-light": "border-sand/50 text-sand hover:bg-sand hover:text-ink hover:border-sand",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  arrow = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
}) {
  const classes = cn(
    "group inline-flex min-h-12 items-center justify-center gap-3 rounded-card border px-6 text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors duration-300",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowUpRight
          aria-hidden
          strokeWidth={1.5}
          className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
  const target = clean(href);

  if (isExternalHref(target)) {
    return (
      <a href={target} className={classes} {...(target.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={target} className={classes}>
      {content}
    </Link>
  );
}

/** Renders a CMS button when both label and link are set. */
export function CtaButton({ cta, ...props }: { cta?: CtaData | null } & Omit<Parameters<typeof ButtonLink>[0], "href" | "children">) {
  if (!cta?.label || !cta.href) return null;
  return (
    <ButtonLink href={cta.href} {...props}>
      {cta.label}
    </ButtonLink>
  );
}

export function ArrowLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={clean(href)}
      className={cn("group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink", className)}
    >
      <span className="link-line pb-0.5">{children}</span>
      <ArrowUpRight
        aria-hidden
        strokeWidth={1.5}
        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
