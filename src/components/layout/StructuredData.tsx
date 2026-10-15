import type { SETTINGS_QUERY_RESULT } from "@/sanity/types";
import { siteUrl } from "@/sanity/env";
import { urlFor } from "@/sanity/lib/image";

/** LocalBusiness (GeneralContractor) JSON-LD built only from fields filled in Sanity. */
export function StructuredData({ settings }: { settings: SETTINGS_QUERY_RESULT }) {
  if (!settings?.companyName) return null;
  const { address } = settings;
  const hasAddress = address?.street || address?.city || address?.postalCode;

  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${siteUrl}/#entreprise`,
    name: settings.companyName,
    url: siteUrl,
    ...(settings.tagline ? { description: settings.tagline } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.logo?.asset?._ref ? { logo: urlFor(settings.logo).width(512).url() } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            ...(address?.street ? { streetAddress: address.street } : {}),
            ...(address?.postalCode ? { postalCode: address.postalCode } : {}),
            ...(address?.city ? { addressLocality: address.city } : {}),
            addressRegion: "Provence-Alpes-Côte d’Azur",
            addressCountry: "FR",
          },
        }
      : {}),
    ...(settings.areasServed?.length
      ? { areaServed: settings.areasServed.map((name) => ({ "@type": "Place", name })) }
      : {}),
    ...(settings.socialLinks?.length ? { sameAs: settings.socialLinks.map((s) => s.url) } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
