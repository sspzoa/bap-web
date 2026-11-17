/**
 * Upstream files fetched by the server. The browser only sees `/c/<site>/<kind>`,
 * because EasyList blocks any image URL containing `-728x90.` and AdGuard hides
 * `img[width="728"][height="90"]`.
 */
const CREATIVE_FILES: Record<string, Record<string, string>> = {
  kdmhs: {
    narrow: "https://growdrill.app/banner-320x100.png",
    wide: "https://growdrill.app/banner-728x90.png",
  },
};

export function creativeUpstream(site: string, kind: string): string | null {
  return CREATIVE_FILES[site]?.[kind] ?? null;
}
