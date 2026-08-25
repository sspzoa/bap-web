"use client";

import type { ReactNode } from "react";
import { setSitePreferenceCookie } from "@/shared/lib/sitePreference";

export function SiteSelectLink({
  siteId,
  href,
  className,
  children,
}: {
  siteId: string;
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        setSitePreferenceCookie(siteId);
      }}>
      {children}
    </a>
  );
}
