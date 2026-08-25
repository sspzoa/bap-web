export type SiteId = "kdmhs" | "dgu" | "horang";

export interface MealSlot {
  time: string;
  operatingHours: string | null;
}

export interface SiteConfig {
  id: SiteId;
  siteName: string;
  schoolName: string;
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
    siteName: "디미고 급식",
    schoolName: "한국디지털미디어고등학교",
    apiPath: "/kdmhs",
    description: "디미고 급식을 확인해보세요",
    keywords: ["급식", "디미고", "한국디지털미디어고등학교", "식단", "밥.net"],
    googleSiteVerification: "Autqjgf5q34Q-Bi4JnRwIuiJW-WzwkCU6Y4wlGU0IVU",
    adsenseClient: "ca-pub-2186209581588169",
  },
  dgu: {
    id: "dgu",
    siteName: "D-Flex 학식",
    schoolName: "동국대학교 경영관 D-Flex",
    apiPath: "/dgu",
    description: "D-Flex 학식을 확인해보세요",
    keywords: ["학식", "동국대", "D-Flex", "경영관", "식단", "밥.net"],
    mealSlots: [
      { time: "중식", operatingHours: "11:30~14:00" },
      { time: "석식", operatingHours: "17:00~19:00" },
    ],
  },
  horang: {
    id: "horang",
    siteName: "호랑에듀 구내식당",
    schoolName: "호랑에듀 구내식당",
    apiPath: "/horang",
    description: "호랑에듀 구내식당을 확인해보세요",
    keywords: ["구내식당", "호랑에듀", "horang-edu", "식단", "밥.net"],
    mealSlots: [
      { time: "중식", operatingHours: null },
      { time: "석식", operatingHours: null },
    ],
  },
};

export const BRAND = {
  title: "밥.net",
  tagline: "급식·학식·구내식당을 확인해보세요",
  url: "https://밥.net",
} as const;

export const SITE_IDS = Object.keys(SITES) as SiteId[];

export function isSiteId(value: string | null | undefined): value is SiteId {
  return !!value && value in SITES;
}

export function getSiteConfig(siteId: SiteId): SiteConfig {
  return SITES[siteId];
}
