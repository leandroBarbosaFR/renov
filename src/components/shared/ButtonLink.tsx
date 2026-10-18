import Link from "next/link";
import type { CtaData } from "@/lib/types";
import { clean, cn, isExternalHref } from "@/lib/utils";
import { ArrowBox } from "./ArrowBox";

type Variant = "primary" | "outline" | "light" | "outline-light";

const variants: Record<Variant, { button: string; box: string }> = {
  primary: {
    button: "bg-olive text-sand hover:bg-olive-deep border-olive hover:border-olive-deep",
    box: "bg-sand text-olive",
  },
  outline: {
    button: "border-ink/80 text-ink hover:bg-ink hover:text-sand",
    box: "bg-ink text-sand group-hover:bg-sand group-hover:text-ink",
  },
  light: {
    button: "bg-sand text-ink border-sand hover:bg-paper hover:border-paper",
    box: "bg-olive text-sand",
  },
  "outline-light": {
    button: "border-sand/50 text-sand hover:bg-sand hover:text-ink hover:border-sand",
    box: "bg-sand text-ink group-hover:bg-ink group-hover:text-sand",
  },
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
    "group inline-flex min-h-12 items-center rounded-card border text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors duration-300",
    arrow ? "justify-between gap-5 py-[3px] pl-6 pr-[3px]" : "justify-center px-6",
    variants[variant].button,
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowBox className={variants[variant].box} />}
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
