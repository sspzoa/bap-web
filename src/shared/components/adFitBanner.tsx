"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { type RefObject, useEffect, useId, useRef, useState } from "react";
import Glass from "@/shared/components/common/glass";
import {
  ADFIT_DESKTOP_MIN_WIDTH,
  ADFIT_SCRIPT_SRC,
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

function useAdFitSlot(mobileUnit: string | null, desktopUnit: string | null) {
  const [slot, setSlot] = useState<AdFitSlot | null>(null);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${ADFIT_DESKTOP_MIN_WIDTH}px)`);
    const apply = () => setSlot(selectAdFitSlot(media.matches, mobileUnit, desktopUnit));
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mobileUnit, desktopUnit]);

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
 * Kakao AdFit banner. Renders nothing when both public unit env vars are empty.
 * `ba.min.js` is loaded once; route changes destroy and render the unit again.
 */
export function AdFitBanner({ className = "" }: { className?: string }) {
  const labelId = useId();
  const pathname = usePathname();
  const frameRef = useRef<HTMLDivElement>(null);
  const mobileUnit = readAdFitUnit(process.env.NEXT_PUBLIC_ADFIT_UNIT_MOBILE);
  const desktopUnit = readAdFitUnit(process.env.NEXT_PUBLIC_ADFIT_UNIT_PC);
  const slot = useAdFitSlot(mobileUnit, desktopUnit);
  const filled = useCreativeFilled(frameRef, slot);

  if (!mobileUnit && !desktopUnit) {
    return null;
  }

  const frameClass =
    mobileUnit && desktopUnit
      ? "h-[100px] w-[320px] min-[800px]:h-[90px] min-[800px]:w-[728px]"
      : desktopUnit
        ? "h-[90px] w-[728px]"
        : "h-[100px] w-[320px]";

  const visibilityClass =
    mobileUnit && desktopUnit ? "flex" : desktopUnit ? "hidden min-[800px]:flex" : "flex min-[800px]:hidden";

  return (
    <aside
      aria-labelledby={labelId}
      className={`${visibilityClass} w-full shrink-0 justify-center px-2 min-[376px]:px-4 min-[800px]:px-0 ${className}`}>
      <Glass className="flex w-full flex-col gap-2 px-2 py-2.5 min-[800px]:w-fit min-[800px]:px-2.5">
        <p id={labelId} className="px-1 font-bold text-[12px] leading-none tracking-tight opacity-50">
          광고
        </p>
        <div ref={frameRef} className={`relative mx-auto shrink-0 ${frameClass}`}>
          {slot && <AdFitIns key={`${pathname}:${slot.unit}:${slot.width}x${slot.height}`} slot={slot} />}
          {!filled && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[12px] border border-white/15 bg-black/25 text-white">
              <span className="font-bold text-[12px] leading-none tracking-tight opacity-55">
                {mobileUnit && desktopUnit ? (
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
      </Glass>
      <Script id="kakao-adfit" src={ADFIT_SCRIPT_SRC} strategy="afterInteractive" />
    </aside>
  );
}
