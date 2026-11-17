export interface PartnerAdConfig {
  /** 320×100. `public` 경로(`/ads/...`) 또는 https 주소. */
  mobile: string;
  /** 728×90. `public` 경로(`/ads/...`) 또는 https 주소. */
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
 * 1. 이미지를 `public/ads/<id>/` 에 두거나, 이미 호스팅된 https 주소를 그대로 적습니다.
 *    파일로 둘 때 관례는 `mobile.png` 320×100, `pc.png` 728×90 입니다.
 * 2. 해당 기관의 mobile, pc, href, alt 를 모두 채웁니다.
 *    - mobile, pc: `/ads/kdmhs/mobile.png` 또는 `https://example.com/banner.png`
 *    - href: https 절대 주소 하나
 *    - alt: 배너 설명
 * 3. 네 값 중 하나라도 비어 있거나 주소가 아니면 그 기관은 제휴 배너를 쓰지 않습니다.
 *    이미지 요청이 실패해도 급식 화면은 카카오 AdFit(유닛이 없으면 안내 문구)으로 돌아갑니다.
 *    배너는 `<img>`로 그리므로 next/image remotePatterns 는 쓰지 않습니다.
 *
 * 홈(사이트 선택)은 이 맵을 보지 않고 항상 AdFit 입니다.
 * 급식 화면에서 제휴가 켜지면 모바일 3칸과 데스크톱 1칸을 모두 이 배너로 바꿉니다.
 */
export const PARTNER_ADS: Record<string, PartnerAdConfig> = {
  kdmhs: {
    mobile: "https://growdrill.app/banner-320x100.png",
    pc: "https://growdrill.app/banner-728x90.png",
    href: "https://growdrill.app",
    alt: "그로우드릴, 드릴 키우기",
  },
};

function filled(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function isPublicAssetPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//") && !value.includes("..");
}

function isCreativeSrc(value: string): boolean {
  return isPublicAssetPath(value) || isHttpUrl(value);
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

  if (!isCreativeSrc(mobile) || !isCreativeSrc(pc) || !isHttpUrl(href)) {
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
