import Link from "next/link";
import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { clean, telHref } from "@/lib/utils";
import { Logo } from "./Logo";
import { CurrentYear } from "./CurrentYear";
import { ManageCookiesButton } from "@/components/shared/CookieBanner";

export function Footer({ settings }: { settings: NonNullable<SETTINGS_QUERY_RESULT> | null }) {
  const name = settings?.companyName ?? "Renov’Action";
  const nav = settings?.navigation ?? [];
  const legal = settings?.legalLinks?.filter((l) => l?.slug) ?? [];
  const hasContact = settings?.email || settings?.phone || settings?.serviceArea;

  return (
    <footer className="bg-olive text-sand">
      <div className="container-site pb-10 pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo name={name} tone="light" />
            {(settings?.footerDescription || settings?.tagline) && (
              <p className="mt-8 max-w-sm text-[0.9375rem] leading-relaxed text-sand/70">
                {settings?.footerDescription || settings?.tagline}
              </p>
            )}
          </div>

          {nav.length > 0 && (
            <nav aria-label="Pied de page" className="lg:col-span-3 lg:col-start-7">
              <h2 className="eyebrow !text-sand/50">Navigation</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {nav.map((link) => (
                  <li key={link._key}>
                    <Link href={clean(link.href)} className="link-line pb-0.5 text-[0.9375rem] text-sand/90 hover:text-sand">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {hasContact && (
            <div className="lg:col-span-3">
              <h2 className="eyebrow !text-sand/50">Contact</h2>
              <address className="mt-6 flex flex-col gap-3 text-[0.9375rem] not-italic text-sand/90">
                {settings?.email && (
                  <a href={`mailto:${clean(settings.email)}`} className="link-line w-fit pb-0.5 hover:text-sand">
                    {settings.email}
                  </a>
                )}
                {settings?.phone && (
                  <a href={telHref(settings.phone)} className="link-line w-fit pb-0.5 hover:text-sand">
                    {settings.phone}
                  </a>
                )}
                {settings?.serviceArea && <span className="text-sand/70">{settings.serviceArea}</span>}
              </address>
              {settings?.socialLinks && settings.socialLinks.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                  {settings.socialLinks.map((s) => (
                    <li key={s._key}>
                      <a href={clean(s.url)} target="_blank" rel="noopener" className="link-line pb-0.5 text-sm text-sand/80 hover:text-sand">
                        {s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div aria-hidden className="mt-20 select-none overflow-hidden whitespace-nowrap border-t border-sand/15 pt-10 text-center font-display text-[clamp(3rem,12vw,11rem)] font-semibold uppercase leading-[0.85] tracking-[-0.05em] text-sand/[0.07]">
          {clean(name)}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-sand/15 pt-6 text-[0.8125rem] text-sand/60 md:flex-row md:items-center md:justify-between">
          <p>
            © <CurrentYear /> {name}. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((page) => (
              <li key={page._id}>
                <Link href={`/${clean(page.slug)}`} className="link-line pb-0.5 hover:text-sand">
                  {page.title}
                </Link>
              </li>
            ))}
            <li>
              <ManageCookiesButton className="link-line pb-0.5 hover:text-sand" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
