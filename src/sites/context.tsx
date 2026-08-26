"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { SitePresentation } from "@/shared/types/index";

interface SiteContextValue {
  siteId: string | null;
  site: SitePresentation | null;
  catalog: SitePresentation[];
  isSelecting: boolean;
  openSelect: () => void;
  closeSelect: () => void;
}

const SiteContext = createContext<SiteContextValue>({
  siteId: null,
  site: null,
  catalog: [],
  isSelecting: false,
  openSelect: () => undefined,
  closeSelect: () => undefined,
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
  const [isSelecting, setIsSelecting] = useState(false);
  const openSelect = useCallback(() => setIsSelecting(true), []);
  const closeSelect = useCallback(() => setIsSelecting(false), []);
  const value = useMemo(
    () => ({ siteId, site, catalog, isSelecting, openSelect, closeSelect }),
    [siteId, site, catalog, isSelecting, openSelect, closeSelect],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useOptionalSiteId(): string | null {
  return useContext(SiteContext).siteId;
}

export function useSiteId(): string {
  const siteId = useOptionalSiteId();
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

export function useSiteSelect() {
  const { isSelecting, openSelect, closeSelect } = useContext(SiteContext);
  return { isSelecting, openSelect, closeSelect };
}
