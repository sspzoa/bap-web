export type SiteId = "kdmhs" | "dgu";

export interface SiteConfig {
  id: SiteId;
  title: string;
  schoolName: string;
  url: string;
  hosts: string[];
  apiPath: string;
  description: string;
  keywords: string[];
  manifestName: string;
  googleSiteVerification?: string;
  adsenseClient?: string;
  errorMessages: {
    noMealData: string;
    noMealOperation: string;
  };
}

export const SITES: Record<SiteId, SiteConfig> = {
  kdmhs: {
    id: "kdmhs",
    title: "밥.net",
    schoolName: "한국디지털미디어고등학교",
    url: "https://밥.net",
    hosts: ["밥.net", "xn--rh3b.net", "www.xn--rh3b.net"],
    apiPath: "/kdmhs",
    description: "한국디지털미디어고등학교 급식. 아침·점심·저녁 메뉴를 한눈에 확인하세요.",
    keywords: ["급식", "디미고", "한국디지털미디어고등학교", "식단", "밥.net"],
    manifestName: "밥.net",
    googleSiteVerification: "Autqjgf5q34Q-Bi4JnRwIuiJW-WzwkCU6Y4wlGU0IVU",
    adsenseClient: "ca-pub-2186209581588169",
    errorMessages: {
      noMealData: "정보가 없어요",
      noMealOperation: "급식 운영이 없어요",
    },
  },
  dgu: {
    id: "dgu",
    title: "dflex.밥.net",
    schoolName: "동국대학교 경영관 D-Flex",
    url: "https://dflex.밥.net",
    hosts: ["dflex.밥.net", "dflex.xn--rh3b.net"],
    apiPath: "/dgu",
    description: "동국대학교 경영관 D-Flex 학식. 중식·석식 코너 메뉴를 확인하세요.",
    keywords: ["학식", "동국대", "D-Flex", "경영관", "식단", "밥.net"],
    manifestName: "D-Flex 식단",
    errorMessages: {
      noMealData: "정보가 없어요",
      noMealOperation: "운영이 없어요",
    },
  },
};

export const SITE_IDS = Object.keys(SITES) as SiteId[];

export function isSiteId(value: string | null | undefined): value is SiteId {
  return !!value && value in SITES;
}

export function getSiteConfig(siteId: SiteId): SiteConfig {
  return SITES[siteId];
}

export function getSiteIdByHost(hostname: string): SiteId | null {
  return SITE_IDS.find((id) => SITES[id].hosts.includes(hostname)) ?? null;
}
