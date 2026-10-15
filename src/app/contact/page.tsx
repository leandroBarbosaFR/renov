import type { Metadata } from "next";
import { CONTACT_PAGE_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import { loadQuery, publishedOptions, type FetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/render";
import { buildMetadata } from "@/lib/metadata";
import { clean, telHref } from "@/lib/utils";
import { ContactFormSection } from "@/components/contact/ContactFormSection";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await loadQuery({ query: CONTACT_PAGE_QUERY, ...publishedOptions });
  return buildMetadata({
    seo: data?.seo,
    title: data?.title ?? "Contact",
    description: data?.intro,
    path: "/contact",
    image: data?.formBackground,
  });
}

async function Contact(options: FetchOptions) {
  const [{ data }, { data: settings }] = await Promise.all([
    loadQuery({ query: CONTACT_PAGE_QUERY, ...options }),
    loadQuery({ query: SETTINGS_QUERY, ...options }),
  ]);

  const items: { label: string; value: string; href?: string }[] = [];
  if (settings?.phone) items.push({ label: "Téléphone", value: settings.phone, href: telHref(settings.phone) });
  if (settings?.email) items.push({ label: "Email", value: settings.email, href: `mailto:${clean(settings.email)}` });
  if (settings?.serviceArea) items.push({ label: "Zone d’intervention", value: settings.serviceArea });

  return (
    <>
      <ContactFormSection content={data} privacySlug={settings?.cookieBanner?.privacySlug} contact={settings} headingAs="h1" />
      {items.length > 0 && (
        <section aria-label="Coordonnées" className="border-b border-line lg:hidden">
          <dl className="container-site divide-y divide-line">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col gap-1 py-6">
                <dt className="eyebrow">{item.label}</dt>
                <dd className="font-display text-xl tracking-[-0.02em]">
                  {item.href ? (
                    <a href={item.href} className="link-line pb-0.5">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </>
  );
}

export default function ContactPage() {
  return <WithFetchOptions render={(options) => <Contact {...options} />} />;
}
