import { describe, expect, test } from "bun:test";
import {
  allowPartnerAdEvent,
  partnerAdEventBody,
  partnerAdEventUrl,
  resetPartnerAdEventGate,
} from "@/shared/lib/partnerAdTracking";

describe("partner ad events", () => {
  test("posts only the institution, slot, and event type", () => {
    expect(partnerAdEventUrl()).toMatch(/\/c\/hit$/);
    expect(JSON.parse(partnerAdEventBody({ siteId: "kdmhs", slot: "mobile-breakfast", type: "impression" }))).toEqual({
      siteId: "kdmhs",
      slot: "mobile-breakfast",
      type: "impression",
    });
  });

  test("counts an impression once and ignores a click repeat inside one second", () => {
    resetPartnerAdEventGate();
    const impression = { siteId: "kdmhs", slot: "pc", type: "impression" as const };
    const click = { siteId: "kdmhs", slot: "mobile-lunch", type: "click" as const };

    expect(allowPartnerAdEvent(impression, 1_000)).toBe(true);
    expect(allowPartnerAdEvent(impression, 5_000)).toBe(false);
    expect(allowPartnerAdEvent(click, 1_000)).toBe(true);
    expect(allowPartnerAdEvent(click, 1_500)).toBe(false);
    expect(allowPartnerAdEvent(click, 2_000)).toBe(true);
  });
});
