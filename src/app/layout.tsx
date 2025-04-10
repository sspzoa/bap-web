import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "밥",
  description: "한국디지털미디어고등학고 급식 API",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="ko">
    <head>
      <meta name="google-site-verification" content="Autqjgf5q34Q-Bi4JnRwIuiJW-WzwkCU6Y4wlGU0IVU" />
    </head>
    <body className={`antialiased`}>
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  );
}
