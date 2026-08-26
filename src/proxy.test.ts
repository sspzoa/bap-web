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

  test("/?home=1 expires the preference cookie and redirects home", async () => {
    const response = proxy(request(`/?${HOME_QUERY_PARAM}=1`, "kdmhs"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/");
    expect(setCookieHeaders(response).join("\n")).toMatch(new RegExp(`${SITE_PREFERENCE_COOKIE}=;`));
    expect(setCookieHeaders(response).join("\n")).toMatch(/Max-Age=0/i);
  });

  test("forwards the cookie as x-site-id on /", async () => {
    const response = proxy(request("/", "dgu"));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-override-headers")).toContain("x-site-id");
  });
});
