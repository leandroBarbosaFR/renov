import type { CONTACT_PAGE_QUERY_RESULT } from "@/sanity/types";
import { Reveal } from "@/components/shared/Reveal";
import { SanityImage } from "@/components/shared/SanityImage";
import { clean, telHref } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

type ContactContent = NonNullable<CONTACT_PAGE_QUERY_RESULT>;

/**
 * Quote request section: full-bleed photograph with the form set on a light card.
 * Used on the homepage (h2) and as the body of the contact page (h1).
 */
export function ContactFormSection({
  content,
  privacySlug,
  contact,
  headingAs = "h2",
}: {
  content: ContactContent | null;
  privacySlug?: string | null;
  contact?: { email?: string | null; phone?: string | null; serviceArea?: string | null } | null;
  headingAs?: "h1" | "h2";
}) {
  const Heading = headingAs;
  const title = content?.title || "Demander un devis";

  return (
    <section id="devis" aria-labelledby="devis-title" className="relative isolate overflow-hidden bg-olive">
      <div className="absolute inset-0 -z-10">
        <SanityImage image={content?.formBackground} sizes="100vw" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/10 lg:bg-gradient-to-r lg:from-ink/60 lg:via-ink/30 lg:to-transparent" />
      </div>

      <div className="container-site grid gap-12 py-16 sm:py-24 lg:grid-cols-12 lg:gap-8 lg:py-32">
        <div className="text-sand lg:col-span-4 lg:pt-4">
          <div className="lg:sticky lg:top-32">
            {content?.eyebrow && <p className="eyebrow !text-sand/75">{content.eyebrow}</p>}
            <Reveal y={12}>
              <Heading id="devis-title" className="text-h2 mt-6 max-w-md">
                {title}
              </Heading>
            </Reveal>
            {content?.intro && (
              <Reveal delay={0.08}>
                <p className="mt-6 max-w-sm text-[1.0625rem] leading-relaxed text-sand/85">{content.intro}</p>
              </Reveal>
            )}
            {(contact?.email || contact?.phone || contact?.serviceArea) && (
              <dl className="mt-10 hidden max-w-sm divide-y divide-sand/20 border-y border-sand/20 text-[0.9375rem] lg:block">
                {contact.phone && (
                  <div className="flex justify-between gap-6 py-4">
                    <dt className="text-sand/60">Téléphone</dt>
                    <dd>
                      <a href={telHref(contact.phone)} className="link-line pb-0.5">
                        {contact.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {contact.email && (
                  <div className="flex justify-between gap-6 py-4">
                    <dt className="text-sand/60">Email</dt>
                    <dd className="min-w-0 truncate">
                      <a href={`mailto:${clean(contact.email)}`} className="link-line pb-0.5">
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                )}
                {contact.serviceArea && (
                  <div className="flex justify-between gap-6 py-4">
                    <dt className="text-sand/60">Zone</dt>
                    <dd className="text-right">{contact.serviceArea}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>

        <Reveal className="lg:col-span-8 lg:col-start-5 xl:col-span-7 xl:col-start-6" y={24}>
          <div className="relative rounded-card border border-paper/60 bg-sand/[0.97] p-6 backdrop-blur-md sm:p-10 lg:p-14">
            <ContactForm
              headingLevel="h3"
              content={{
                formTitle: content?.formTitle,
                timeframes: content?.timeframes?.map(clean),
                renovationTypes: content?.renovationTypes?.map(clean),
                submitLabel: content?.submitLabel,
                consentText: content?.consentText,
                successTitle: content?.successTitle,
                successMessage: content?.successMessage,
                privacySlug: privacySlug ? clean(privacySlug) : null,
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
