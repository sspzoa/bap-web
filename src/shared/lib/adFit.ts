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
