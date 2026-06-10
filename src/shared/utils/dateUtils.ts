import { addDays } from "date-fns";
import { MEAL_TIME_THRESHOLDS } from "@/shared/lib/constants";
import { getKoreanDate, getKoreanHours } from "./timeZoneUtils";
import type { SiteId } from "@/sites/config";

export const getInitialDateForServer = (siteId: SiteId): Date => {
  const now = getKoreanDate();
  // kdmhs·dgu 모두 저녁 식사 시간 이후엔 다음 날 식단을 보여줌 (클라이언트 setMealByTime 과 일치).
  if (siteId === "kdmhs" || siteId === "dgu") {
    const hour = getKoreanHours();
    if (hour >= MEAL_TIME_THRESHOLDS.DINNER_START) {
      return addDays(now, 1);
    }
  }
  return now;
};
