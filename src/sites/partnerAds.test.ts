import { describe, expect, test } from "bun:test";
import { type PartnerAdConfig, partnerAdSlot, resolvePartnerAd, withPartnerUtm } from "@/sites/partnerAds";

const sample: PartnerAdConfig = {
  mobile: "/ads/kdmhs/mobile.png",
  pc: "/ads/kdmhs/pc.png",
  href: "https://dimigo.hs.kr/club?from=poster",
  alt: "디미고 동아리",
};

describe("resolvePartnerAd", () => {
  test("maps 디미고 to the Growdrill banners and leaves other schools alone", () => {
    expect(resolvePartnerAd("kdmhs")).toEqual({
      siteId: "kdmhs",
      mobileSrc: "https://growdrill.app/banner-320x100.png",
      pcSrc: "https://growdrill.app/banner-728x90.png",
      href: "https://growdrill.app",
      alt: "그로우드릴, 드릴 키우기",
    });
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

  test("accepts an https creative and falls back when a field is unusable", () => {
    const remote: PartnerAdConfig = {
      ...sample,
      mobile: "https://growdrill.app/banner-320x100.png",
      pc: "https://growdrill.app/banner-728x90.png",
    };

    expect(resolvePartnerAd("kdmhs", { kdmhs: remote })?.mobileSrc).toBe(remote.mobile);
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, alt: "  " } })).toBeNull();
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, mobile: "ads/kdmhs/mobile.png" } })).toBeNull();
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, href: "javascript:alert(1)" } })).toBeNull();
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...sample, pc: "/ads/../secret.png" } })).toBeNull();
    expect(resolvePartnerAd("kdmhs", { kdmhs: { ...remote, pc: "javascript:alert(1)" } })).toBeNull();
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
