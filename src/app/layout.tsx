import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import QueryProvider from "@/shared/lib/provider";
import { BRAND, getSiteConfig } from "@/sites/config";
import { SiteProvider } from "@/sites/context";
import { getSiteId, isSelectPath } from "@/sites/server";

const FALLBACK_METADATA = {
  title: BRAND.title,
  description: BRAND.tagline,
  url: BRAND.url,
};

export async function generateMetadata(): Promise<Metadata> {
  const siteId = await getSiteId();
  if (!siteId || (await isSelectPath())) {
    return {
      metadataBase: new URL(FALLBACK_METADATA.url),
      title: FALLBACK_METADATA.title,
      description: FALLBACK_METADATA.description,
      applicationName: FALLBACK_METADATA.title,
      keywords: ["식단", "급식", "학식", "밥.net"],
      alternates: { canonical: `${FALLBACK_METADATA.url}/select` },
      openGraph: {
        type: "website",
        locale: "ko_KR",
        url: `${FALLBACK_METADATA.url}/select`,
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

  const config = getSiteConfig(siteId);
  const description = config.description;

  return {
    metadataBase: new URL(BRAND.url),
    title: {
      default: config.siteName,
      template: `%s | ${config.siteName}`,
    },
    description,
    applicationName: config.siteName,
    keywords: config.keywords,
    alternates: {
      canonical: BRAND.url,
    },
    robots: {
      index: true,
      follow: true,
    },
    appleWebApp: {
      capable: true,
      title: config.siteName,
      statusBarStyle: "black-translucent",
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: BRAND.url,
      siteName: config.siteName,
      title: config.siteName,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: config.siteName,
      description,
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
  const config = siteId && !(await isSelectPath()) ? getSiteConfig(siteId) : null;

  return (
    <html lang="ko">
      <head>
        {config?.googleSiteVerification && <meta name="google-site-verification" content={config.googleSiteVerification} />}
        {config?.adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="antialiased">
        {config && <JsonLd name={config.siteName} description={config.description} url={BRAND.url} />}
        <Analytics />
        <SpeedInsights />
        <SiteProvider siteId={siteId}>
          <QueryProvider>{children}</QueryProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
