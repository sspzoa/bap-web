import { describe, expect, test } from "bun:test";
import { creativeUpstream } from "@/shared/lib/creativeFiles";

describe("creativeUpstream", () => {
  test("maps 디미고 sizes to the hosted files", () => {
    expect(creativeUpstream("kdmhs", "narrow")).toBe("https://growdrill.app/banner-320x100.png");
    expect(creativeUpstream("kdmhs", "wide")).toBe("https://growdrill.app/banner-728x90.png");
  });

  test("ignores unknown sites and kinds", () => {
    expect(creativeUpstream("dgu", "narrow")).toBeNull();
    expect(creativeUpstream("kdmhs", "other")).toBeNull();
  });
});
