"use client";

import type { MouseEvent, ReactNode } from "react";
import { setSitePreferenceCookie } from "@/shared/lib/sitePreference";

export function SiteSelectLink({
  siteId,
  className,
  children,
}: {
  siteId: string;
  className?: string;
  children: ReactNode;
}) {
  const selectSite = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setSitePreferenceCookie(siteId);
    window.location.assign("/");
  };

  return (
    <a href="/" className={className} onClick={selectSite}>
      {children}
    </a>
  );
}
