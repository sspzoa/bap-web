export type SiteId = "kdmhs" | "dgu";

export interface SiteConfig {
  id: SiteId;
  title: string;
  schoolName: string;
  url: string;
  apiPath: string;
  description: string;
  keywords: string[];
  manifestName: string;
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
    apiPath: "/kdmhs",
    description: "한국디지털미디어고등학교 오늘의 급식. 아침·점심·저녁 메뉴를 한눈에 확인하세요.",
    keywords: ["급식", "디미고", "한국디지털미디어고등학교", "식단", "밥.net"],
    manifestName: "밥.net",
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
    apiPath: "/dgu",
    description: "동국대학교 경영관 D-Flex 오늘의 학식. 중식·석식 코너 메뉴를 확인하세요.",
    keywords: ["학식", "동국대", "D-Flex", "경영관", "식단", "밥.net"],
    manifestName: "D-Flex 식단",
    errorMessages: {
      noMealData: "정보가 없어요",
      noMealOperation: "운영이 없어요",
    },
  },
};

export function getSiteConfig(siteId: SiteId): SiteConfig {
  return SITES[siteId];
}
