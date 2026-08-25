/** Punycode default matches production; override with NEXT_PUBLIC_API_BASE_URL for local/staging. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.xn--rh3b.net";

/** Human-readable production URL (same host as API_BASE_URL default). */
export const API_BASE_URL_DISPLAY = "https://api.밥.net";
