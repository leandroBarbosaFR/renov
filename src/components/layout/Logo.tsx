import Link from "next/link";
import { Image } from "next-sanity/image";
import { urlFor } from "@/sanity/lib/image";
import type { ImageData } from "@/lib/types";
import { clean, cn } from "@/lib/utils";

/** Typographic logo: "RENOV" set heavy, the region set light, split by a hairline. */
export function Logo({
  name,
  logo,
  tone = "dark",
  className,
}: {
  name: string;
  logo?: ImageData | null;
  tone?: "dark" | "light";
  className?: string;
}) {
  const cleanName = clean(name);
  if (logo?.asset?._ref) {
    return (
      <Link href="/" aria-label={`${cleanName} — accueil`} className={cn("inline-flex items-center", className)}>
        <Image src={urlFor(logo).height(80).url()} alt={cleanName} width={160} height={40} className="h-9 w-auto" />
      </Link>
    );
  }

  const [first, ...rest] = cleanName.split(" ");
  return (
    <Link
      href="/"
      aria-label={`${cleanName} — accueil`}
      className={cn(
        "group inline-flex items-center gap-3 font-display text-[0.9375rem] uppercase leading-none",
        tone === "light" ? "text-sand" : "text-ink",
        className,
      )}
    >
      <span className="font-bold tracking-[0.2em]">{first}</span>
      <span aria-hidden className={cn("h-4 w-px", tone === "light" ? "bg-sand/40" : "bg-ink/25")} />
      <span className="font-normal tracking-[0.24em]">{rest.join(" ")}</span>
    </Link>
  );
}
