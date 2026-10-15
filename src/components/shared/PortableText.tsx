import { PortableText as PortableTextBase, type PortableTextComponents } from "@portabletext/react";
import type { BlockContent } from "@/sanity/types";
import { clean, cn, isExternalHref } from "@/lib/utils";

const components: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href = clean((value as { href?: string })?.href ?? "#");
      return isExternalHref(href) ? (
        <a href={href} rel="noopener" target={href.startsWith("http") ? "_blank" : undefined}>
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
  },
};

export function PortableText({ value, className }: { value?: BlockContent | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cn("prose-site", className)}>
      <PortableTextBase value={value} components={components} />
    </div>
  );
}
