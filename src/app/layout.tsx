import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: '밥.net',
  description: '한국디지털미디어고등학교 급식 API',
  keywords: '디미고,급식,디미급식,디미고 급식,밥,밥넷,밥.net,한국디지털미디어고',
  authors: [{ name: 'sspzoa' }],
  creator: 'sspzoa',
  publisher: 'sspzoa',
  icons: {
    icon: [
      { url: './logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: './logo/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: './logo/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: [{ url: './favicon.ico' }],
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
  applicationName: '밥.net',
  category: 'food',
  metadataBase: new URL('https://밥.net'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '밥.net',
    description: '한국디지털미디어고등학교 급식 API',
    url: 'https://밥.net',
    siteName: '밥.net',
    images: [
      {
        url: './logo/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: '밥.net 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
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
