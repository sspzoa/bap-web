import type { ReactNode } from "react";
import { renderDguHome } from "@/sites/dgu/home";
import { renderKdmhsHome } from "@/sites/kdmhs/home";
import { renderHorangHome } from "@/sites/horang/home";
import type { SiteId } from "@/sites/config";

export const SITE_HOME: Record<SiteId, () => Promise<ReactNode>> = {
  kdmhs: renderKdmhsHome,
  dgu: renderDguHome,
  horang: renderHorangHome,
};
