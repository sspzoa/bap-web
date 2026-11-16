import { describe, expect, test } from "bun:test";
import { readAdFitUnit, selectAdFitSlot } from "@/shared/lib/adFit";

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
});
