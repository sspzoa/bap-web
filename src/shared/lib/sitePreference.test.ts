import { describe, expect, test } from "bun:test";
import {
  expireSitePreferenceCookies,
  legacySitePreferenceCookieDomains,
  SITE_PREFERENCE_COOKIE,
} from "@/shared/lib/sitePreference";

describe("legacySitePreferenceCookieDomains", () => {
  test("includes the shared domain on 밥.net hosts", () => {
    expect(legacySitePreferenceCookieDomains("xn--rh3b.net")).toEqual([".xn--rh3b.net"]);
    expect(legacySitePreferenceCookieDomains("밥.net")).toEqual([".xn--rh3b.net"]);
  });

  test("skips localhost", () => {
    expect(legacySitePreferenceCookieDomains("localhost")).toEqual([]);
  });
});

describe("expireSitePreferenceCookies", () => {
  test("expires host-only and legacy domain cookies", () => {
    const writes: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

    expireSitePreferenceCookies(
      {
        set(name, value, options) {
          writes.push({ name, value, options });
        },
      },
      "xn--rh3b.net",
      true,
    );

    expect(writes).toHaveLength(2);
    expect(writes.every((write) => write.name === SITE_PREFERENCE_COOKIE && write.value === "")).toBe(true);
    expect(writes.every((write) => write.options.httpOnly === false)).toBe(true);
    expect(writes.some((write) => write.options.domain === ".xn--rh3b.net")).toBe(true);
  });
});
