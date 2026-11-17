import { describe, expect, test } from "bun:test";
import { PARTNER_ADS, type PartnerAdConfig, partnerAdSlot, resolvePartnerAd, withPartnerUtm } from "@/sites/partnerAds";

const sample: PartnerAdConfig = {
  mobile: "/ads/kdmhs/mobile.png",
  pc: "/ads/kdmhs/pc.png",
  href: "https://dimigo.hs.kr/club?from=poster",
  alt: "디미고 동아리",
};

describe("resolvePartnerAd", () => {
  test("maps 디미고 to kdmhs and stays off until the creative is filled", () => {
    expect(PARTNER_ADS.kdmhs).toBeDefined();
    expect(resolvePartnerAd("kdmhs")).toBeNull();
    expect(resolvePartnerAd("dgu")).toBeNull();
    expect(resolvePartnerAd(null)).toBeNull();
  });

  test("accepts a complete creative", () => {
    expect(resolvePartnerAd("kdmhs", { kdmhs: sample })).toEqual({
      siteId: "kdmhs",
      mobileSrc: sample.mobile,
      pcSrc: sample.pc,
      href: sample.href,
      alt: sample.alt,
    });
  });

  test("falls back when any field, the path, or the link is unusable", () => {
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, alt: "  " } })).toBeNull();
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, mobile: "ads/kdmhs/mobile.png" } })).toBeNull();
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, href: "javascript:alert(1)" } })).toBeNull();
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, pc: "/ads/../secret.png" } })).toBeNull();
  });
});

describe("partnerAdSlot", () => {
  test("names the three mobile meal cards and the single desktop slot", () => {
    expect(partnerAdSlot("mobile", "breakfast")).toBe("mobile-breakfast");
    expect(partnerAdSlot("mobile", "lunch")).toBe("mobile-lunch");
    expect(partnerAdSlot("mobile", "dinner")).toBe("mobile-dinner");
    expect(partnerAdSlot("desktop")).toBe("pc");
    expect(partnerAdSlot("mobile")).toBeNull();
  });
});

describe("withPartnerUtm", () => {
  test("adds the bap.net campaign and keeps the existing query and hash", () => {
    const href = withPartnerUtm("https://dimigo.hs.kr/club?from=poster#apply", "kdmhs", "mobile-lunch");
    const url = new URL(href);

    expect(url.origin + url.pathname).toBe("https://dimigo.hs.kr/club");
    expect(url.searchParams.get("from")).toBe("poster");
    expect(url.searchParams.get("utm_source")).toBe("bapnet");
    expect(url.searchParams.get("utm_medium")).toBe("banner");
    expect(url.searchParams.get("utm_campaign")).toBe("kdmhs");
    expect(url.searchParams.get("utm_content")).toBe("mobile-lunch");
    expect(url.hash).toBe("#apply");
  });

  test("replaces a destination utm so the click is attributed to bap.net", () => {
    const url = new URL(withPartnerUtm("https://example.com/?utm_source=other&utm_content=old", "kdmhs", "pc"));

    expect(url.searchParams.get("utm_source")).toBe("bapnet");
    expect(url.searchParams.get("utm_content")).toBe("pc");
  });
});
