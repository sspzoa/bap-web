"use client";

import type { ReactNode } from "react";
import { setSitePreferenceCookie } from "@/shared/lib/sitePreference";
import type { SiteId } from "@/sites/config";

export function SiteSelectLink({
  siteId,
  href,
  children,
}: {
  siteId: SiteId;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() => {
        setSitePreferenceCookie(siteId);
      }}>
      {children}
    </a>
  );
}
