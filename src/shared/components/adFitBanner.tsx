"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { type RefObject, useEffect, useRef, useState } from "react";
import { AdInquiryLink } from "@/shared/components/adInquiryLink";
import {
  ADFIT_DESKTOP_MIN_WIDTH,
  ADFIT_SCRIPT_SRC,
  type AdFitPlacement,
  type AdFitSlot,
  adSlotFrameClass,
  adSlotVisibilityClass,
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

function AdSlotNotice() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-[12px] border border-white/50 bg-transparent px-2.5">
      <p className="text-center font-medium text-[11px] text-white/75 leading-[1.35] [word-break:keep-all] min-[800px]:text-[13px] min-[800px]:leading-snug">
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

      try {
        window.adfit.render(ins);
      } catch {
        // A second ins with the same unit can throw after the first is registered.
        // Keep this slot mounted so a later route change can render it again.
      }
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
 * Kakao AdFit banner. An empty unit id still reserves the slot and shows the notice,
 * but does not mount `<ins>` or load ba.min.js. A set id keeps the current render path.
 * Route changes destroy and render mounted units again.
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
  const frameClass = adSlotFrameClass(placement);
  const visibilityClass = adSlotVisibilityClass(placement);

  const insetClass = flush ? "px-0" : "px-4";

  return (
    <aside aria-label="광고" className={`${visibilityClass} w-full shrink-0 justify-center ${insetClass} ${className}`}>
      <div ref={frameRef} className={`relative shrink-0 overflow-hidden rounded-[12px] ${frameClass}`}>
        {slot && <AdFitIns key={`${pathname}:${placement}:${slot.unit}:${slot.width}x${slot.height}`} slot={slot} />}
        {!filled && <AdSlotNotice />}
        {filled && <AdInquiryLink />}
      </div>
      {slot && <Script id="kakao-adfit" src={ADFIT_SCRIPT_SRC} strategy="afterInteractive" />}
    </aside>
  );
}
