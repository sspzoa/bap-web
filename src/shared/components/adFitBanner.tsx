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
const FILL_CALLBACK = "__bapAdFitFilled";

interface AdFitApi {
  render: (element: HTMLElement) => void;
  destroy: (target: HTMLElement | string) => void;
}

declare global {
  interface Window {
    adfit?: AdFitApi;
    [NO_FILL_CALLBACK]?: (element: HTMLElement) => void;
    [FILL_CALLBACK]?: (element: HTMLElement) => void;
  }
}

function installAdFitCallbacks() {
  window[NO_FILL_CALLBACK] = (element) => {
    element.replaceChildren();
    element.style.display = "none";
    delete element.dataset.adfitFilled;
  };
  window[FILL_CALLBACK] = (element) => {
    element.dataset.adfitFilled = "1";
  };
}

function AdSlotNotice({ size }: { size: "mobile" | "desktop" | "responsive" }) {
  const sizeLabel =
    size === "mobile" ? (
      "320 × 100"
    ) : size === "desktop" ? (
      "728 × 90"
    ) : (
      <>
        <span className="min-[800px]:hidden">320 × 100</span>
        <span className="hidden min-[800px]:inline">728 × 90</span>
      </>
    );

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2.5">
      <p className="text-center font-medium text-[10px] text-white/45 leading-none tracking-tight">{sizeLabel}</p>
      <p className="text-center font-medium text-[11px] text-white/70 leading-[1.35] [word-break:keep-all] min-[800px]:text-[13px] min-[800px]:leading-snug">
        유지 비용 때문에 부득이하게 이곳에 광고가 게시될 예정이에요. 동아리 등 제휴 광고 문의는{" "}
        <a href="mailto:me@sspzoa.io" className="underline underline-offset-2">
          me@sspzoa.io
        </a>
        로 연락 주세요.
      </p>
    </div>
  );
}

function AdFitIns({ slot }: { slot: AdFitSlot }) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) {
      return;
    }

    installAdFitCallbacks();
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
      data-ad-onload={FILL_CALLBACK}
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

    const check = () => {
      const creative = container.querySelector("iframe") ?? container.querySelector("[data-adfit-filled]");
      setFilled(creative !== null);
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-adfit-filled"],
    });
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
  className = "",
}: {
  placement?: AdFitPlacement;
  /** Skip the banner's own horizontal inset when the parent already pads. */
  flush?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const frameRef = useRef<HTMLDivElement>(null);
  const mobileUnit = readAdFitUnit(process.env.NEXT_PUBLIC_ADFIT_UNIT_MOBILE);
  const desktopUnit = readAdFitUnit(process.env.NEXT_PUBLIC_ADFIT_UNIT_PC);
  const slot = useAdFitSlot(mobileUnit, desktopUnit, placement);
  const filled = useCreativeFilled(frameRef, slot);
  const mobileOnly = placement === "mobile";
  const desktopOnly = placement === "desktop";

  if (mobileOnly ? !mobileUnit : desktopOnly ? !desktopUnit : !(mobileUnit || desktopUnit)) {
    return null;
  }

  const frameClass = mobileOnly
    ? "h-[100px] w-[320px]"
    : desktopOnly
      ? "h-[90px] w-[728px]"
      : mobileUnit && desktopUnit
        ? "h-[100px] w-[320px] min-[800px]:h-[90px] min-[800px]:w-[728px]"
        : desktopUnit
          ? "h-[90px] w-[728px]"
          : "h-[100px] w-[320px]";

  const visibilityClass = mobileOnly
    ? "flex min-[800px]:hidden"
    : desktopOnly
      ? "hidden min-[800px]:flex"
      : mobileUnit && desktopUnit
        ? "flex"
        : desktopUnit
          ? "hidden min-[800px]:flex"
          : "flex min-[800px]:hidden";

  const insetClass = flush ? "px-0" : "px-4";

  return (
    <aside aria-label="광고" className={`${visibilityClass} w-full shrink-0 justify-center ${insetClass} ${className}`}>
      <div ref={frameRef} className={`relative shrink-0 overflow-hidden rounded-[12px] ${frameClass}`}>
        {slot && <AdFitIns key={`${pathname}:${placement}:${slot.unit}:${slot.width}x${slot.height}`} slot={slot} />}
        {!filled && <AdSlotNotice size={mobileOnly ? "mobile" : desktopOnly ? "desktop" : "responsive"} />}
      </div>
      <Script id="kakao-adfit" src={ADFIT_SCRIPT_SRC} strategy="afterInteractive" />
    </aside>
  );
}
