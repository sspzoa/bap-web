import { describe, expect, test } from "bun:test";
import { adSlotFrameClass, adSlotVisibilityClass, readAdFitUnit, selectAdFitSlot } from "@/shared/lib/adFit";

describe("ad slot box", () => {
  test("keeps the AdFit sizes and the 800px switch", () => {
    expect(adSlotFrameClass("mobile")).toBe("h-[100px] w-[320px]");
    expect(adSlotFrameClass("desktop")).toBe("h-[90px] w-[728px]");
    expect(adSlotVisibilityClass("mobile")).toBe("flex min-[800px]:hidden");
    expect(adSlotVisibilityClass("desktop")).toBe("hidden min-[800px]:flex");
    expect(adSlotVisibilityClass("desktop", "from-1200")).toBe("hidden min-[1200px]:flex");
    expect(adSlotVisibilityClass("desktop", "from-800-until-1200")).toBe("hidden min-[800px]:flex min-[1200px]:hidden");
  });
});

describe("readAdFitUnit", () => {
  test("drops blank values and trims a real unit id", () => {
    expect(readAdFitUnit(undefined)).toBeNull();
    expect(readAdFitUnit("")).toBeNull();
    expect(readAdFitUnit("   ")).toBeNull();
    expect(readAdFitUnit(" DAN-mobile ")).toBe("DAN-mobile");
  });
});

describe("selectAdFitSlot", () => {
  test("returns nothing when the matching unit is empty", () => {
    expect(selectAdFitSlot(false, null, "DAN-pc")).toBeNull();
    expect(selectAdFitSlot(true, "DAN-mobile", null)).toBeNull();
    expect(selectAdFitSlot(false, null, null)).toBeNull();
  });

  test("uses 320x100 on mobile and 728x90 on desktop", () => {
    expect(selectAdFitSlot(false, "DAN-mobile", "DAN-pc")).toEqual({
      unit: "DAN-mobile",
      width: 320,
      height: 100,
    });
    expect(selectAdFitSlot(true, "DAN-mobile", "DAN-pc")).toEqual({
      unit: "DAN-pc",
      width: 728,
      height: 90,
    });
  });

  test("mobile placement never uses the desktop unit", () => {
    expect(selectAdFitSlot(false, "DAN-mobile", "DAN-pc", "mobile")).toEqual({
      unit: "DAN-mobile",
      width: 320,
      height: 100,
    });
    expect(selectAdFitSlot(true, "DAN-mobile", "DAN-pc", "mobile")).toBeNull();
    expect(selectAdFitSlot(false, null, "DAN-pc", "mobile")).toBeNull();
  });

  test("desktop placement is only the 728x90 unit", () => {
    expect(selectAdFitSlot(true, "DAN-mobile", "DAN-pc", "desktop")).toEqual({
      unit: "DAN-pc",
      width: 728,
      height: 90,
    });
    expect(selectAdFitSlot(false, "DAN-mobile", "DAN-pc", "desktop")).toBeNull();
    expect(selectAdFitSlot(true, "DAN-mobile", null, "desktop")).toBeNull();
  });
});
