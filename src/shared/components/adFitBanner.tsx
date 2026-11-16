"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { type RefObject, useEffect, useRef, useState } from "react";
import {
  ADFIT_DESKTOP_MIN_WIDTH,
  ADFIT_SCRIPT_SRC,
  type AdFitPlacement,
  type AdFitSlot,
  readAdFitUnit,
  selectAdFitSlot,
} from "@/shared/lib/adFit";

const NO_FILL_CALLBACK = "__bapAdFitNoFill";

interface AdFitApi {
  render: (element: HTMLElement) => void;
  destroy: (target: HTMLElement | string) => void;
}

declare global {
  interface Window {
    adfit?: AdFitApi;
    [NO_FILL_CALLBACK]?: (element: HTMLElement) => void;
  }
}

function installNoFillCallback() {
  window[NO_FILL_CALLBACK] = (element) => {
    element.replaceChildren();
    element.style.display = "none";
  };
}

function AdFitIns({ slot }: { slot: AdFitSlot }) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) {
      return;
    }

    installNoFillCallback();
    let cancelled = false;
    let timer = 0;

    const render = () => {
      if (cancelled || !ins.isConnected || !window.adfit) {
        return;
      }

      window.adfit.render(ins);
    };

    if (window.adfit) {
      render();
    } else {
      const started = Date.now();
      timer = window.setInterval(() => {
        if (window.adfit) {
          window.clearInterval(timer);
          render();
          return;
        }

        if (Date.now() - started > 10000) {
          window.clearInterval(timer);
        }
      }, 50);
    }

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.adfit?.destroy(ins);
      ins.replaceChildren();
      ins.style.display = "none";
    };
  }, [pathname, slot.unit, slot.width, slot.height]);

  return (
    <ins
      ref={insRef}
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit={slot.unit}
      data-ad-width={slot.width}
      data-ad-height={slot.height}
      data-ad-onfail={NO_FILL_CALLBACK}
    />
  );
}

function useAdFitSlot(mobileUnit: string | null, desktopUnit: string | null, placement: AdFitPlacement) {
  const [slot, setSlot] = useState<AdFitSlot | null>(null);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${ADFIT_DESKTOP_MIN_WIDTH}px)`);
    const apply = () => setSlot(selectAdFitSlot(media.matches, mobileUnit, desktopUnit, placement));
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mobileUnit, desktopUnit, placement]);

  return slot;
}

function useCreativeFilled(containerRef: RefObject<HTMLElement | null>, slot: AdFitSlot | null) {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !slot) {
      setFilled(false);
      return;
    }

    const check = () => setFilled(container.querySelector("iframe") !== null);
    check();
    const observer = new MutationObserver(check);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [containerRef, slot]);

  return filled;
}

/**
 * Kakao AdFit banner. Renders nothing when the units for this placement are empty.
 * `ba.min.js` loads once. Route changes and remounts destroy the unit, then render it again.
 * Only one instance of a unit may be mounted: callers must not show two banners at once.
 */
export function AdFitBanner({
  placement = "responsive",
  flush = false,
  align = "center",
  className = "",
}: {
  placement?: AdFitPlacement;
  /** Skip the banner's own horizontal inset when the parent already pads. */
  flush?: boolean;
  align?: "start" | "center";
  className?: string;
}) {
  const pathname = usePathname();
  const frameRef = useRef<HTMLDivElement>(null);
  const mobileUnit = readAdFitUnit(process.env.NEXT_PUBLIC_ADFIT_UNIT_MOBILE);
  const desktopUnit = readAdFitUnit(process.env.NEXT_PUBLIC_ADFIT_UNIT_PC);
  const slot = useAdFitSlot(mobileUnit, desktopUnit, placement);
  const filled = useCreativeFilled(frameRef, slot);
  const mobileOnly = placement === "mobile";

  if (mobileOnly ? !mobileUnit : !(mobileUnit || desktopUnit)) {
    return null;
  }

  const frameClass = mobileOnly
    ? "h-[100px] w-[320px]"
    : mobileUnit && desktopUnit
      ? "h-[100px] w-[320px] min-[800px]:h-[90px] min-[800px]:w-[728px]"
      : desktopUnit
        ? "h-[90px] w-[728px]"
        : "h-[100px] w-[320px]";

  const visibilityClass = mobileOnly
    ? "flex md:hidden"
    : mobileUnit && desktopUnit
      ? "flex"
      : desktopUnit
        ? "hidden min-[800px]:flex"
        : "flex min-[800px]:hidden";

  const insetClass = flush ? "px-0" : "px-4";
  const alignClass = align === "start" ? "justify-start" : "justify-center";

  return (
    <aside aria-label="광고" className={`${visibilityClass} w-full shrink-0 ${alignClass} ${insetClass} ${className}`}>
      <div ref={frameRef} className={`relative shrink-0 overflow-hidden rounded-[12px] ${frameClass}`}>
        {slot && <AdFitIns key={`${pathname}:${placement}:${slot.unit}:${slot.width}x${slot.height}`} slot={slot} />}
        {!filled && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 text-white">
            <span className="font-bold text-[12px] leading-none tracking-tight opacity-55">
              {mobileOnly ? (
                "320 × 100"
              ) : mobileUnit && desktopUnit ? (
                <>
                  <span className="min-[800px]:hidden">320 × 100</span>
                  <span className="hidden min-[800px]:inline">728 × 90</span>
                </>
              ) : desktopUnit ? (
                "728 × 90"
              ) : (
                "320 × 100"
              )}
            </span>
          </div>
        )}
      </div>
      <Script id="kakao-adfit" src={ADFIT_SCRIPT_SRC} strategy="afterInteractive" />
    </aside>
  );
}
