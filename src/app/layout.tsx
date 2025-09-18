import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: '밥.net',
  description: '한국디지털미디어고등학교 급식 API',
  keywords: '디미고,급식,디미고급식,디미고 급식,밥,밥넷,밥.net,한국디지털미디어고,한국디지털미디어고등학교',
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    images: [
      {
        url: './logo/icon.png',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="Autqjgf5q34Q-Bi4JnRwIuiJW-WzwkCU6Y4wlGU0IVU" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2186209581588169"
          crossOrigin="anonymous"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2186209581588169"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <Analytics />
        <SpeedInsights />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
