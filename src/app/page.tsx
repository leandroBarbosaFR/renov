import type { Metadata } from "next";
import { CONTACT_PAGE_QUERY, HOME_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import { loadQuery, publishedOptions, type FetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/render";
import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { BeforeAfterSection } from "@/components/home/BeforeAfterSection";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { EmptyState } from "@/components/shared/EmptyState";

export async function generateMetadata(): Promise<Metadata> {
  const [{ data }, { data: settings }] = await Promise.all([
    loadQuery({ query: HOME_QUERY, ...publishedOptions }),
    loadQuery({ query: SETTINGS_QUERY, ...publishedOptions }),
  ]);
  const meta = buildMetadata({ seo: data?.seo, description: data?.hero?.description, path: "/", image: data?.hero?.image });
  // The homepage title stands alone (no " — Company" template suffix).
  const title = data?.seo?.metaTitle || settings?.seo?.metaTitle || settings?.companyName || "Renov’Action";
  return { ...meta, title: { absolute: title }, openGraph: { ...meta.openGraph, title } };
}

async function Home(options: FetchOptions) {
  const [{ data }, { data: contact }, { data: settings }] = await Promise.all([
    loadQuery({ query: HOME_QUERY, ...options }),
    loadQuery({ query: CONTACT_PAGE_QUERY, ...options }),
    loadQuery({ query: SETTINGS_QUERY, ...options }),
  ]);

  if (!data?.hero?.title) {
    return (
      <div className="container-site section-y">
        <EmptyState
          title="La page d’accueil n’est pas encore configurée."
          description="Renseignez le document « Accueil » dans le Studio Sanity."
        />
      </div>
    );
  }

  return (
    <>
      <Hero data={data.hero} />
      {data.about && <AboutSection data={data.about} />}
      {data.projects && <FeaturedProjects data={data.projects} />}
      {data.beforeAfter && <BeforeAfterSection data={data.beforeAfter} />}
      {data.showContactForm !== false && (
        <ContactFormSection
          content={contact}
          privacySlug={settings?.cookieBanner?.privacySlug}
          contact={settings}
        />
      )}
    </>
  );
}

export default function HomePage() {
  return <WithFetchOptions render={(options) => <Home {...options} />} />;
}
