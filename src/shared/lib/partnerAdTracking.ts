import { API_BASE_URL } from "@/shared/lib/apiBase";

export type PartnerAdEventType = "impression" | "click";

export interface PartnerAdEvent {
  siteId: string;
  slot: string;
  type: PartnerAdEventType;
}

const CLICK_GAP_MS = 1000;
const seen = new Map<string, number>();

export function partnerAdEventUrl(): string {
  return `${API_BASE_URL}/partner-ads/events`;
}

export function partnerAdEventBody(event: PartnerAdEvent): string {
  return JSON.stringify({
    siteId: event.siteId,
    slot: event.slot,
    type: event.type,
  });
}

/** One impression per page load. Clicks closer than a second on the same slot are dropped. */
export function allowPartnerAdEvent(event: PartnerAdEvent, now = Date.now()): boolean {
  const key = `${event.type}:${event.siteId}:${event.slot}`;
  const previous = seen.get(key);
  if (event.type === "impression") {
    if (previous !== undefined) {
      return false;
    }
    seen.set(key, now);
    return true;
  }

  if (previous !== undefined && now - previous < CLICK_GAP_MS) {
    return false;
  }

  seen.set(key, now);
  return true;
}

export function resetPartnerAdEventGate(): void {
  seen.clear();
}

/** Fire-and-forget. The meal page stays open, so the beacon is not racing an unload. */
export function recordPartnerAdEvent(event: PartnerAdEvent): void {
  if (!allowPartnerAdEvent(event)) {
    return;
  }

  const url = partnerAdEventUrl();
  const body = partnerAdEventBody(event);

  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const sent = navigator.sendBeacon(url, new Blob([body], { type: "text/plain;charset=UTF-8" }));
      if (sent) {
        return;
      }
    }
  } catch {
    // Fall through to fetch.
  }

  if (typeof fetch !== "function") {
    return;
  }

  void fetch(url, {
    method: "POST",
    body,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    keepalive: true,
    mode: "cors",
    credentials: "omit",
  }).catch(() => {});
}
