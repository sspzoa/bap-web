import { isSiteId, type SiteId } from "@/sites/config";

export const SITE_PREFERENCE_COOKIE = "bap-site-id";
export const SITE_PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;

export function readSitePreference(value: string | undefined): SiteId | null {
  return isSiteId(value) ? value : null;
}

export function isSelectPath(pathname: string): boolean {
  return pathname === "/select" || pathname.startsWith("/select/");
}

export function setSitePreferenceCookie(siteId: SiteId): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SITE_PREFERENCE_COOKIE}=${siteId}; Path=/; Max-Age=${SITE_PREFERENCE_MAX_AGE}; SameSite=Lax${secure}`;
}
