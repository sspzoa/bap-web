export type SiteId = "kdmhs" | "dgu" | "mega";

export interface MealSlot {
  time: string;
  operatingHours: string | null;
}

export interface SiteConfig {
  id: SiteId;
  /** Subdomain label for OG mark and technical references */
  title: string;
  /** Browser tab, PWA, and SEO title */
  siteName: string;
  /** Full institution name for in-page UI */
  schoolName: string;
  url: string;
  hosts: string[];
  apiPath: string;
  description: string;
  keywords: string[];
  googleSiteVerification?: string;
  adsenseClient?: string;
  mealSlots?: MealSlot[];
}

export const SITES: Record<SiteId, SiteConfig> = {
  kdmhs: {
    id: "kdmhs",
    title: "kdmhs.밥.net",
    siteName: "디미고 급식",
    schoolName: "한국디지털미디어고등학교",
    url: "https://kdmhs.밥.net",
    hosts: ["kdmhs.밥.net", "kdmhs.xn--rh3b.net"],
    apiPath: "/kdmhs",
    description: "디미고 급식을 확인해보세요",
    keywords: ["급식", "디미고", "한국디지털미디어고등학교", "식단", "밥.net"],
    googleSiteVerification: "Autqjgf5q34Q-Bi4JnRwIuiJW-WzwkCU6Y4wlGU0IVU",
    adsenseClient: "ca-pub-2186209581588169",
  },
  dgu: {
    id: "dgu",
    title: "dflex.밥.net",
    siteName: "D-Flex 학식",
    schoolName: "동국대학교 경영관 D-Flex",
    url: "https://dflex.밥.net",
    hosts: ["dflex.밥.net", "dflex.xn--rh3b.net"],
    apiPath: "/dgu",
    description: "D-Flex 학식을 확인해보세요",
    keywords: ["학식", "동국대", "D-Flex", "경영관", "식단", "밥.net"],
    mealSlots: [
      { time: "중식", operatingHours: "11:30~14:00" },
      { time: "석식", operatingHours: "17:00~19:00" },
    ],
  },
  mega: {
    id: "mega",
    title: "mega.밥.net",
    siteName: "메가스터디 식단",
    schoolName: "메가스터디 구내식당",
    url: "https://mega.밥.net",
    hosts: ["mega.밥.net", "mega.xn--rh3b.net"],
    apiPath: "/mega",
    description: "메가스터디 식단을 확인해보세요",
    keywords: ["학식", "메가스터디", "메가라운지", "구내식당", "식단", "밥.net"],
    mealSlots: [
      { time: "중식", operatingHours: null },
      { time: "석식", operatingHours: null },
    ],
  },
};

export const BRAND = {
  title: "밥.net",
  tagline: "학교 식단을 확인해보세요",
  url: "https://밥.net",
  hosts: ["밥.net", "xn--rh3b.net", "www.xn--rh3b.net"],
} as const;

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
