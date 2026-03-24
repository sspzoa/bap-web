"use client";

import { createContext, useContext } from "react";
import type { SiteId } from "@/sites/config";

const SiteContext = createContext<SiteId>("kdmhs");

export function SiteProvider({ siteId, children }: { siteId: SiteId; children: React.ReactNode }) {
  return <SiteContext.Provider value={siteId}>{children}</SiteContext.Provider>;
}

export function useSiteId(): SiteId {
  return useContext(SiteContext);
}
