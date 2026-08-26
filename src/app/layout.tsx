import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { findSite, getCatalog } from "@/shared/lib/catalog";
import { getChangelog } from "@/shared/lib/changelog";
import QueryProvider from "@/shared/lib/provider";
import { BRAND } from "@/sites/config";
import { SiteProvider } from "@/sites/context";
import { getSiteId } from "@/sites/server";

const FALLBACK_METADATA = {
  title: BRAND.title,
  description: BRAND.tagline,
  url: BRAND.url,
};

export async function generateMetadata(): Promise<Metadata> {
  const siteId = await getSiteId();
  const catalog = await getCatalog();
  const site = findSite(catalog, siteId);

  if (!site) {
    return {
      metadataBase: new URL(FALLBACK_METADATA.url),
      title: FALLBACK_METADATA.title,
      description: FALLBACK_METADATA.description,
      applicationName: FALLBACK_METADATA.title,
      keywords: ["식단", "급식", "학식", "구내식당", "밥.net"],
      alternates: { canonical: FALLBACK_METADATA.url },
      openGraph: {
        type: "website",
        locale: "ko_KR",
        url: FALLBACK_METADATA.url,
        siteName: FALLBACK_METADATA.title,
        title: FALLBACK_METADATA.title,
        description: FALLBACK_METADATA.description,
      },
      twitter: {
        card: "summary_large_image",
        title: FALLBACK_METADATA.title,
        description: FALLBACK_METADATA.description,
      },
    };
  }

  return {
    metadataBase: new URL(BRAND.url),
    title: {
      default: site.name,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: site.keywords,
    alternates: {
      canonical: BRAND.url,
    },
    robots: {
      index: true,
      follow: true,
    },
    appleWebApp: {
      capable: true,
      title: site.name,
      statusBarStyle: "black-translucent",
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: BRAND.url,
      siteName: site.name,
      title: site.name,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1a120c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

function JsonLd({ name, description, url }: { name: string; description: string; url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "LifestyleApplication",
    inLanguage: "ko",
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const siteId = await getSiteId();
  const catalog = await getCatalog();
  const site = findSite(catalog, siteId);
  const changelog = await getChangelog();

  return (
    <html lang="ko">
      <head>
        {site?.googleSiteVerification && <meta name="google-site-verification" content={site.googleSiteVerification} />}
        {site?.adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased">
        {site && <JsonLd name={site.name} description={site.description} url={BRAND.url} />}
        <Analytics />
        <SpeedInsights />
        <SiteProvider siteId={site?.id ?? null} site={site} catalog={catalog} changelog={changelog}>
          <QueryProvider>{children}</QueryProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
