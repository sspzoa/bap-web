import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import Providers from "@/app/providers";
import localFont from 'next/font/local';

const suitFont = localFont({
  src: [
    {
      path: './fonts/SUIT-Variable.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-suit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "밥",
  description: "한국디지털미디어고등학고 급식 API",
  openGraph: {
    images: [{ url: 'https://xn--rh3b.net/og-image.png' }],
  },
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ko" className={`${suitFont.variable}`}>
    <head>
      <meta name="google-site-verification" content="Autqjgf5q34Q-Bi4JnRwIuiJW-WzwkCU6Y4wlGU0IVU" />
    </head>
    <body className={`antialiased font-suit`}>
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  );
}