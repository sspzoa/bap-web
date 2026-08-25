import { BRAND, isSiteId, SITES, type SiteId } from "@/sites/config";

export const SITE_PREFERENCE_COOKIE = "bap-site-id";
export const SITE_PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;
export const SITE_PREFERENCE_COOKIE_DOMAIN = ".xn--rh3b.net";

export function readSitePreference(value: string | undefined): SiteId | null {
  return isSiteId(value) ? value : null;
}

export function isSelectPath(pathname: string): boolean {
  return pathname === "/select" || pathname.startsWith("/select/");
}

export function isBrandRootHost(hostname: string): boolean {
  return (BRAND.hosts as readonly string[]).includes(hostname);
}

export function getPreferredSiteUrl(siteId: SiteId): string {
  return SITES[siteId].url;
}

export function setSitePreferenceCookie(siteId: SiteId): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const domain = isBrandRootHost(window.location.hostname)
    ? `; Domain=${SITE_PREFERENCE_COOKIE_DOMAIN}`
    : "";

  document.cookie = `${SITE_PREFERENCE_COOKIE}=${siteId}; Path=/; Max-Age=${SITE_PREFERENCE_MAX_AGE}; SameSite=Lax${secure}${domain}`;
}
