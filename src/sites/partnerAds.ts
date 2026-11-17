export interface PartnerAdConfig {
  /** Site-root path under `public/`. 320×100. Example: `/ads/kdmhs/mobile.png`. */
  mobile: string;
  /** Site-root path under `public/`. 728×90. Example: `/ads/kdmhs/pc.png`. */
  pc: string;
  /** Absolute http(s) URL. UTM params are added at render time. */
  href: string;
  alt: string;
}

export interface PartnerAdCreative {
  siteId: string;
  mobileSrc: string;
  pcSrc: string;
  href: string;
  alt: string;
}

/**
 * 기관별 제휴 광고.
 *
 * 키는 카탈로그 provider id 입니다. 디미고(한국디지털미디어고등학교)는 `kdmhs` 입니다.
 * `GET /` providers[].id 와 같고, basePath 는 `/kdmhs` 입니다.
 *
 * 소재를 넣는 방법:
 * 1. 이미지를 `public/ads/<id>/` 에 둡니다.
 *    - `mobile.png` — 320×100. 급식 카드 안 (아침·점심·저녁, 800px 미만).
 *    - `pc.png` — 728×90. 끼니 카드 줄 아래 (800px 이상).
 *    png / webp / jpg 모두 됩니다. 파일명이 다르면 아래 경로를 그 파일로 적습니다.
 * 2. 해당 기관의 mobile, pc, href, alt 를 모두 채웁니다.
 *    - mobile, pc: `/ads/kdmhs/mobile.png` 처럼 `/` 로 시작하는 경로
 *    - href: https 절대 주소 하나
 *    - alt: 배너 설명
 * 3. 네 값 중 하나라도 비어 있거나 주소가 http(s)가 아니면 그 기관은 제휴 배너를 쓰지 않습니다.
 *    이미지 파일 요청이 실패해도 급식 화면은 카카오 AdFit(유닛이 없으면 안내 문구)으로 돌아갑니다.
 *
 * 홈(사이트 선택)은 이 맵을 보지 않고 항상 AdFit 입니다.
 * 급식 화면에서 제휴가 켜지면 모바일 3칸과 데스크톱 1칸을 모두 이 배너로 바꿉니다.
 */
export const PARTNER_ADS: Record<string, PartnerAdConfig> = {
  kdmhs: {
    mobile: "",
    pc: "",
    href: "",
    alt: "",
  },
};

function filled(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function isPublicAssetPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("..");
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function resolvePartnerAd(
  siteId: string | null | undefined,
  ads: Record<string, PartnerAdConfig> = PARTNER_ADS,
): PartnerAdCreative | null {
  if (!siteId) {
    return null;
  }

  const config = ads[siteId];
  if (!config) {
    return null;
  }

  const mobile = filled(config.mobile);
  const pc = filled(config.pc);
  const href = filled(config.href);
  const alt = filled(config.alt);
  if (!mobile || !pc || !href || !alt) {
    return null;
  }

  if (!isPublicAssetPath(mobile) || !isPublicAssetPath(pc) || !isHttpUrl(href)) {
    return null;
  }

  return { siteId, mobileSrc: mobile, pcSrc: pc, href, alt };
}

export type PartnerAdPlacement = "mobile" | "desktop";

/**
 * Slot stored with the event and sent as `utm_content`.
 * Mobile meal cards: `mobile-<mealId>` (디미고: breakfast, lunch, dinner).
 * The single desktop leaderboard: `pc`.
 */
export function partnerAdSlot(placement: PartnerAdPlacement, mealId?: string): string | null {
  if (placement === "desktop") {
    return "pc";
  }

  const id = mealId?.trim() ?? "";
  if (!id) {
    return null;
  }

  return `mobile-${id}`;
}

/** Keep existing query params and hash. Our four UTM keys are set on top. */
export function withPartnerUtm(href: string, siteId: string, slot: string): string {
  const url = new URL(href);
  url.searchParams.set("utm_source", "bapnet");
  url.searchParams.set("utm_medium", "banner");
  url.searchParams.set("utm_campaign", siteId);
  url.searchParams.set("utm_content", slot);
  return url.toString();
}
