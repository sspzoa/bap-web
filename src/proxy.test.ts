import { describe, expect, test } from "bun:test";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { HOME_QUERY_PARAM, SITE_PREFERENCE_COOKIE, SITE_QUERY_PARAM } from "@/shared/lib/sitePreference";

function request(path: string, cookie?: string) {
  return new NextRequest(`http://localhost${path}`, {
    headers: cookie ? { cookie: `${SITE_PREFERENCE_COOKIE}=${cookie}` } : undefined,
  });
}

function setCookieHeaders(response: Response) {
  return response.headers.getSetCookie?.() ?? [];
}

describe("proxy", () => {
  test("/?site= sets the preference cookie and redirects home", async () => {
    const response = proxy(request(`/?${SITE_QUERY_PARAM}=kdmhs`));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/");
    expect(setCookieHeaders(response).join("\n")).toContain(`${SITE_PREFERENCE_COOKIE}=kdmhs`);
  });

  test("/?home=1 expires the preference cookie and ignores the leftover site", async () => {
    const response = proxy(request(`/?${HOME_QUERY_PARAM}=1`, "dgu"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-override-headers") ?? "").not.toContain("x-site-id");
    expect(setCookieHeaders(response).join("\n")).toMatch(new RegExp(`${SITE_PREFERENCE_COOKIE}=;`));
    expect(setCookieHeaders(response).join("\n")).toMatch(/Max-Age=0/i);
  });

  test("/?home=1 also expires legacy domain cookies on 밥.net hosts", async () => {
    const response = proxy(new NextRequest(`https://xn--rh3b.net/?${HOME_QUERY_PARAM}=1`));

    const cookies = setCookieHeaders(response).join("\n");
    expect(cookies).toMatch(/Domain=\.xn--rh3b\.net/i);
    expect(cookies).toMatch(/Max-Age=0/i);
  });

  test("prefers the latest cookie when duplicates exist", async () => {
    const response = proxy(
      new NextRequest("http://localhost/", {
        headers: { cookie: `${SITE_PREFERENCE_COOKIE}=dgu; ${SITE_PREFERENCE_COOKIE}=kdmhs` },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-override-headers")).toContain("x-site-id");
  });

  test("forwards the cookie as x-site-id on /", async () => {
    const response = proxy(request("/", "dgu"));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-override-headers")).toContain("x-site-id");
  });
});
