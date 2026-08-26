"use client";

import type { MouseEvent, ReactNode } from "react";
import { setSitePreferenceCookie } from "@/shared/lib/sitePreference";
import { useOptionalSiteId, useSiteSelect } from "@/sites/context";

export function SiteSelectLink({
  siteId,
  className,
  children,
}: {
  siteId: string;
  className?: string;
  children: ReactNode;
}) {
  const currentSiteId = useOptionalSiteId();
  const { closeSelect } = useSiteSelect();

  const selectSite = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setSitePreferenceCookie(siteId);

    if (siteId === currentSiteId) {
      closeSelect();
      return;
    }

    window.location.assign("/");
  };

  return (
    <a href="/" className={className} onClick={selectSite}>
      {children}
    </a>
  );
}
