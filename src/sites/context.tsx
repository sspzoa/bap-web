"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { SitePresentation } from "@/shared/types/index";

interface SiteContextValue {
  siteId: string | null;
  site: SitePresentation | null;
  catalog: SitePresentation[];
}

const SiteContext = createContext<SiteContextValue>({
  siteId: null,
  site: null,
  catalog: [],
});

export function SiteProvider({
  siteId,
  site,
  catalog,
  children,
}: {
  siteId: string | null;
  site: SitePresentation | null;
  catalog: SitePresentation[];
  children: ReactNode;
}) {
  return <SiteContext.Provider value={{ siteId, site, catalog }}>{children}</SiteContext.Provider>;
}

export function useSiteId(): string {
  const { siteId } = useContext(SiteContext);
  if (!siteId) {
    throw new Error("useSiteId must be used within a resolved site");
  }
  return siteId;
}

export function useSite(): SitePresentation {
  const { site } = useContext(SiteContext);
  if (!site) {
    throw new Error("useSite must be used within a resolved site");
  }
  return site;
}

export function useCatalog(): SitePresentation[] {
  return useContext(SiteContext).catalog;
}
