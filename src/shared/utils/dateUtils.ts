import { addDays } from "date-fns";
import { MEAL_TIME_THRESHOLDS } from "@/shared/lib/constants";
import { getKoreanDate, getKoreanHours } from "./timeZoneUtils";
import type { SiteId } from "@/sites/config";

export const getInitialDateForServer = (siteId: SiteId): Date => {
  const now = getKoreanDate();
  if (siteId === "kdmhs") {
    const hour = getKoreanHours();
    if (hour >= MEAL_TIME_THRESHOLDS.DINNER_START) {
      return addDays(now, 1);
    }
  }
  return now;
};
