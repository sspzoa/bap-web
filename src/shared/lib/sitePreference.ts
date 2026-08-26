export const SITE_PREFERENCE_COOKIE = "bap-site-id";
export const SITE_QUERY_PARAM = "site";
export const HOME_QUERY_PARAM = "home";
export const HOME_HREF = `/?${HOME_QUERY_PARAM}=1`;
export const SITE_PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;

export const SITE_PREFERENCE_COOKIE_OPTIONS = {
  path: "/",
  maxAge: SITE_PREFERENCE_MAX_AGE,
  sameSite: "lax" as const,
  httpOnly: false,
};

export function readSitePreference(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function isDocsPath(pathname: string): boolean {
  return pathname === "/docs" || pathname.startsWith("/docs/");
}

export function setSitePreferenceCookie(siteId: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SITE_PREFERENCE_COOKIE}=${siteId}; Path=/; Max-Age=${SITE_PREFERENCE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearSitePreferenceCookie(): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SITE_PREFERENCE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export function goHome(): void {
  window.location.assign(HOME_HREF);
}

export function readSiteQueryParam(value: string | null | undefined): string | null {
  return readSitePreference(value ?? undefined);
}
