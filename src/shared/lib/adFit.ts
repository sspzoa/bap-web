export const ADFIT_SCRIPT_SRC = "https://t1.daumcdn.net/kas/static/ba.min.js";

/** Mobile banner. Official AdFit size. */
export const ADFIT_MOBILE_SIZE = { width: 320, height: 100 } as const;

/** Leaderboard. Official AdFit size. */
export const ADFIT_DESKTOP_SIZE = { width: 728, height: 90 } as const;

/** 728px leaderboard fits on the home screen once the viewport clears page padding. */
export const ADFIT_DESKTOP_MIN_WIDTH = 800;

export type AdFitPlacement = "responsive" | "mobile" | "desktop";

export interface AdFitSlot {
  unit: string;
  width: number;
  height: number;
}

export function readAdFitUnit(value: string | undefined): string | null {
  const unit = value?.trim();
  return unit ? unit : null;
}

/** Fixed frame so a partner banner occupies the same box as AdFit. */
export function adSlotFrameClass(placement: AdFitPlacement): string {
  if (placement === "mobile") {
    return "h-[100px] w-[320px]";
  }

  if (placement === "desktop") {
    return "h-[90px] w-[728px]";
  }

  return "h-[100px] w-[320px] min-[800px]:h-[90px] min-[800px]:w-[728px]";
}

/** Where the desktop slot is shown. Wide means the three-card arrangement. */
export type DesktopAdSpan = "from-800" | "from-1200" | "from-800-until-1200";

/** Mobile slots hide at 800px. The desktop slot is hidden below that. */
export function adSlotVisibilityClass(placement: AdFitPlacement, desktopSpan: DesktopAdSpan = "from-800"): string {
  if (placement === "mobile") {
    return "flex min-[800px]:hidden";
  }

  if (placement === "desktop") {
    if (desktopSpan === "from-1200") {
      return "hidden min-[1200px]:flex";
    }

    if (desktopSpan === "from-800-until-1200") {
      return "hidden min-[800px]:flex min-[1200px]:hidden";
    }

    return "hidden min-[800px]:flex";
  }

  return "flex";
}

export function selectAdFitSlot(
  isDesktop: boolean,
  mobileUnit: string | null,
  desktopUnit: string | null,
  placement: AdFitPlacement = "responsive",
): AdFitSlot | null {
  if (placement === "mobile") {
    if (isDesktop) {
      return null;
    }

    return mobileUnit ? { unit: mobileUnit, ...ADFIT_MOBILE_SIZE } : null;
  }

  if (placement === "desktop") {
    if (!isDesktop) {
      return null;
    }

    return desktopUnit ? { unit: desktopUnit, ...ADFIT_DESKTOP_SIZE } : null;
  }

  if (isDesktop) {
    return desktopUnit ? { unit: desktopUnit, ...ADFIT_DESKTOP_SIZE } : null;
  }

  return mobileUnit ? { unit: mobileUnit, ...ADFIT_MOBILE_SIZE } : null;
}
