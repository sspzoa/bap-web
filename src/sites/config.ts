export type SiteId = "kdmhs" | "dgu";

export interface SiteConfig {
  id: SiteId;
  title: string;
  schoolName: string;
  url: string;
  apiPath: string;
  manifestName?: string;
}

export const SITES: Record<SiteId, SiteConfig> = {
  kdmhs: {
    id: "kdmhs",
    title: "밥.net",
    schoolName: "한국디지털미디어고등학교",
    url: "https://밥.net",
    apiPath: "",
  },
  dgu: {
    id: "dgu",
    title: "상록원.밥.net",
    schoolName: "동국대학교 서울캠퍼스 상록원",
    url: "https://상록원.밥.net",
    apiPath: "/dgu",
    manifestName: "동국대 식단",
  },
};

export function getSiteConfig(siteId: SiteId): SiteConfig {
  return SITES[siteId];
}
