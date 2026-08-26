export const SITE_PREFERENCE_COOKIE = "bap-site-id";
export const SITE_QUERY_PARAM = "site";
export const HOME_QUERY_PARAM = "home";
export const HOME_HREF = `/?${HOME_QUERY_PARAM}=1`;
export const SITE_PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;

/** 2026-08-25 select-first routing used a shared registrable domain. */
export const LEGACY_SITE_PREFERENCE_COOKIE_DOMAINS = [".xn--rh3b.net"] as const;

export const SITE_PREFERENCE_COOKIE_OPTIONS = {
  path: "/",
  maxAge: SITE_PREFERENCE_MAX_AGE,
  sameSite: "lax" as const,
  httpOnly: false,
};

export function legacySitePreferenceCookieDomains(hostname: string): readonly string[] {
  if (
    hostname === "xn--rh3b.net" ||
    hostname.endsWith(".xn--rh3b.net") ||
    hostname.endsWith(".밥.net") ||
    hostname === "밥.net"
  ) {
    return LEGACY_SITE_PREFERENCE_COOKIE_DOMAINS;
  }
  return [];
}

export function readSitePreference(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function isDocsPath(pathname: string): boolean {
  return pathname === "/docs" || pathname.startsWith("/docs/");
}

export function clearSitePreferenceCookie(): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SITE_PREFERENCE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;

  for (const domain of legacySitePreferenceCookieDomains(window.location.hostname)) {
    document.cookie = `${SITE_PREFERENCE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; Domain=${domain}${secure}`;
  }
}

type CookieStore = {
  set(name: string, value: string, options: Record<string, unknown>): void;
};

export function expireSitePreferenceCookies(store: CookieStore, hostname: string, secure: boolean): void {
  const base = {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: "lax" as const,
    secure,
    httpOnly: false,
  };

  store.set(SITE_PREFERENCE_COOKIE, "", base);

  for (const domain of legacySitePreferenceCookieDomains(hostname)) {
    store.set(SITE_PREFERENCE_COOKIE, "", { ...base, domain });
  }
}

export function sitePreferenceHref(siteId: string): string {
  return `/?${SITE_QUERY_PARAM}=${encodeURIComponent(siteId)}`;
}

export function readSiteQueryParam(value: string | null | undefined): string | null {
  return readSitePreference(value ?? undefined);
}
