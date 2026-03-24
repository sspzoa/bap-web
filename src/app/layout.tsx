import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import QueryProvider from "@/shared/lib/provider";
import { getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";
import { SiteProvider } from "@/sites/context";

export async function generateMetadata(): Promise<Metadata> {
  const siteId = await getSiteId();
  const config = getSiteConfig(siteId);
  return {
    title: config.title,
    description: config.schoolName,
    appleWebApp: true,
    openGraph: {
      images: [
        {
          url: "./logo/icon-512.png",
        },
      ],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const siteId = await getSiteId();
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
        <Analytics />
        <SpeedInsights />
        <SiteProvider siteId={siteId}>
          <QueryProvider>{children}</QueryProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
