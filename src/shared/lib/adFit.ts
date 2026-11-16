export const ADFIT_SCRIPT_SRC = "https://t1.daumcdn.net/kas/static/ba.min.js";

/** Mobile banner. Official AdFit size. */
export const ADFIT_MOBILE_SIZE = { width: 320, height: 100 } as const;

/** Leaderboard. Official AdFit size. */
export const ADFIT_DESKTOP_SIZE = { width: 728, height: 90 } as const;

/**
 * Meal layout switches at 768px, but a 728px leaderboard plus the glass
 * card only fits once the viewport clears the shell padding.
 */
export const ADFIT_DESKTOP_MIN_WIDTH = 800;

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
): AdFitSlot | null {
  if (isDesktop) {
    return desktopUnit ? { unit: desktopUnit, ...ADFIT_DESKTOP_SIZE } : null;
  }

  return mobileUnit ? { unit: mobileUnit, ...ADFIT_MOBILE_SIZE } : null;
}
