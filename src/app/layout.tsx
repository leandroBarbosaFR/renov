import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import "./globals.css";

import { SETTINGS_QUERY } from "@/sanity/lib/queries";
import { SanityLive, loadQuery, publishedOptions, type FetchOptions } from "@/sanity/lib/live";
import { WithFetchOptions } from "@/sanity/lib/render";
import { siteUrl } from "@/sanity/env";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/layout/StructuredData";
import { DisableDraftMode } from "@/components/layout/DisableDraftMode";
import { CookieBanner } from "@/components/shared/CookieBanner";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const FALLBACK_NAV = [
  { _key: "home", label: "Accueil", href: "/" },
  { _key: "about", label: "À propos", href: "/a-propos" },
  { _key: "projects", label: "Réalisations", href: "/realisations" },
  { _key: "contact", label: "Contact", href: "/contact" },
];

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await loadQuery({ query: SETTINGS_QUERY, ...publishedOptions });
  const name = settings?.companyName || "Renov PACA 13";
  const title = settings?.seo?.metaTitle || name;
  const description = settings?.seo?.metaDescription || settings?.tagline || undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s — ${name}` },
    description,
    applicationName: name,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: name,
      title,
      description,
      ...(settings?.seo?.ogImage ? { images: [{ url: settings.seo.ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f0e8",
};

async function Header(options: FetchOptions) {
  const { data } = await loadQuery({ query: SETTINGS_QUERY, ...options });
  return (
    <Navbar
      companyName={data?.companyName || "Renov PACA 13"}
      logo={data?.logo}
      links={data?.navigation?.length ? data.navigation : FALLBACK_NAV}
      cta={data?.headerCta ?? { label: "Demander un devis", href: "/contact" }}
    />
  );
}

async function SiteFooter(options: FetchOptions) {
  const { data } = await loadQuery({ query: SETTINGS_QUERY, ...options });
  const settings = data ? { ...data, navigation: data.navigation?.length ? data.navigation : FALLBACK_NAV } : null;
  return (
    <>
      <Footer settings={settings} />
      <CookieBanner
        title={data?.cookieBanner?.title}
        text={data?.cookieBanner?.text}
        privacySlug={data?.cookieBanner?.privacySlug}
      />
      {options.perspective === "published" && <StructuredData settings={data} />}
    </>
  );
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="fr" className={`${manrope.variable} ${inter.variable}`}>
      <body className="flex min-h-svh flex-col">
        <WithFetchOptions render={(options) => <Header {...options} />} fallback={<div className="h-16 lg:h-20" />} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <WithFetchOptions render={(options) => <SiteFooter {...options} />} />
        <SanityLive includeDrafts={isDraftMode} />
        {isDraftMode && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
