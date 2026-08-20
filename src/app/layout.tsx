import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getMealDataServerSide } from "@/shared/lib/mealService";
import { summarizeMealPreview } from "@/shared/lib/ogMeal";
import QueryProvider from "@/shared/lib/provider";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteConfig } from "@/sites/config";
import { SiteProvider } from "@/sites/context";
import { getSiteId } from "@/sites/server";

export async function generateMetadata(): Promise<Metadata> {
  const siteId = await getSiteId();
  const config = getSiteConfig(siteId);
  const date = getInitialDateForServer();
  const meal = await getMealDataServerSide(config.apiPath, formatToDateString(date));
  const preview = summarizeMealPreview(siteId, meal?.data);
  const dateLabel = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const description =
    preview.length > 0 ? `${dateLabel} ${config.schoolName} 식단: ${preview.join(", ")}` : config.description;

  return {
    metadataBase: new URL(config.url),
    title: {
      default: `${config.schoolName} 식단`,
      template: `%s | ${config.title}`,
    },
    description,
    applicationName: config.manifestName,
    keywords: config.keywords,
    alternates: {
      canonical: config.url,
    },
    robots: {
      index: true,
      follow: true,
    },
    appleWebApp: {
      capable: true,
      title: config.manifestName,
      statusBarStyle: "black-translucent",
    },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url: config.url,
      siteName: config.title,
      title: `${config.schoolName} 식단`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.schoolName} 식단`,
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

function JsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
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
  const config = getSiteConfig(siteId);

  return (
    <html lang="ko">
      <head>
        {siteId === "kdmhs" && (
          <>
            <meta name="google-site-verification" content="Autqjgf5q34Q-Bi4JnRwIuiJW-WzwkCU6Y4wlGU0IVU" />
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2186209581588169"
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className="antialiased">
        <JsonLd name={config.manifestName} description={config.description} url={config.url} />
        <Analytics />
        <SpeedInsights />
        <SiteProvider siteId={siteId}>
          <QueryProvider>{children}</QueryProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
