"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { AdFitBanner } from "@/shared/components/adFitBanner";
import { AdInquiryLink } from "@/shared/components/adInquiryLink";
import {
  ADFIT_DESKTOP_SIZE,
  ADFIT_MOBILE_SIZE,
  type AdFitPlacement,
  adSlotFrameClass,
  adSlotVisibilityClass,
} from "@/shared/lib/adFit";
import { recordPartnerAdEvent } from "@/shared/lib/partnerAdTracking";
import { useOptionalSiteId } from "@/sites/context";
import {
  type PartnerAdCreative,
  type PartnerAdPlacement,
  partnerAdSlot,
  resolvePartnerAd,
  withPartnerUtm,
} from "@/sites/partnerAds";

function useImpression(frameRef: RefObject<HTMLElement | null>, siteId: string, slot: string, ready: boolean) {
  useEffect(() => {
    const frame = frameRef.current;
    if (!ready || !frame || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5);
        if (!visible) {
          return;
        }

        observer.disconnect();
        recordPartnerAdEvent({ siteId, slot, type: "impression" });
      },
      { threshold: [0.5] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRef, ready, siteId, slot]);
}

function PartnerBanner({
  creative,
  placement,
  slot,
  flush,
  className,
  onBroken,
}: {
  creative: PartnerAdCreative;
  placement: PartnerAdPlacement;
  slot: string;
  flush: boolean;
  className: string;
  onBroken: () => void;
}) {
  const frameRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const adPlacement: AdFitPlacement = placement === "desktop" ? "desktop" : "mobile";
  const size = placement === "desktop" ? ADFIT_DESKTOP_SIZE : ADFIT_MOBILE_SIZE;
  const src = placement === "desktop" ? creative.pcSrc : creative.mobileSrc;
  const href = withPartnerUtm(creative.href, creative.siteId, slot);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setReady(true);
    }
  }, [src]);

  useImpression(frameRef, creative.siteId, slot, ready);

  return (
    <aside
      aria-label="광고"
      className={`${adSlotVisibilityClass(adPlacement)} w-full shrink-0 justify-center ${flush ? "px-0" : "px-4"} ${className}`}>
      <div className={`relative shrink-0 overflow-hidden rounded-[12px] ${adSlotFrameClass(adPlacement)}`}>
        <a
          ref={frameRef}
          href={href}
          target="_blank"
          rel="noopener"
          referrerPolicy="origin"
          data-partner-slot={slot}
          onClick={() => recordPartnerAdEvent({ siteId: creative.siteId, slot, type: "click" })}
          className="block h-full w-full">
          <img
            ref={imageRef}
            src={src}
            alt={creative.alt}
            width={size.width}
            height={size.height}
            draggable={false}
            decoding="async"
            className="h-full w-full object-cover"
            onLoad={() => setReady(true)}
            onError={onBroken}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-1 bottom-1 rounded bg-black/60 px-1 py-px font-semibold text-[9px] text-white leading-none">
            광고
          </span>
        </a>
        <AdInquiryLink />
      </div>
    </aside>
  );
}

/**
 * Meal-screen ad. A filled partner creative replaces every AdFit slot for that school.
 * Home does not use this component.
 */
export function MealAdBanner({
  placement,
  mealId,
  flush = false,
  className = "",
}: {
  placement: PartnerAdPlacement;
  mealId?: string;
  flush?: boolean;
  className?: string;
}) {
  const siteId = useOptionalSiteId();
  const creative = resolvePartnerAd(siteId);
  const slot = partnerAdSlot(placement, mealId);
  const [broken, setBroken] = useState(false);
  const adPlacement: AdFitPlacement = placement === "desktop" ? "desktop" : "mobile";

  if (!creative || !slot || broken) {
    return <AdFitBanner placement={adPlacement} flush={flush} className={className} />;
  }

  return (
    <PartnerBanner
      creative={creative}
      placement={placement}
      slot={slot}
      flush={flush}
      className={className}
      onBroken={() => setBroken(true)}
    />
  );
}
