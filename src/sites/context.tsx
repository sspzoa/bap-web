"use client";

import { createContext, useContext } from "react";
import type { SiteId } from "@/sites/config";

const SiteContext = createContext<SiteId | null>(null);

export function SiteProvider({ siteId, children }: { siteId: SiteId | null; children: React.ReactNode }) {
  return <SiteContext.Provider value={siteId}>{children}</SiteContext.Provider>;
}

export function useSiteId(): SiteId {
  const siteId = useContext(SiteContext);
  if (!siteId) {
    throw new Error("useSiteId must be used within a resolved site");
  }
  return siteId;
}
