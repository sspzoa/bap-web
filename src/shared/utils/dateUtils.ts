import { addDays } from "date-fns";
import { MEAL_TIME_THRESHOLDS } from "@/shared/lib/constants";
import { getKoreanDate, getKoreanHours } from "./timeZoneUtils";

export function getMealDisplayDate(now = getKoreanDate(), hour = getKoreanHours()): Date {
  if (hour >= MEAL_TIME_THRESHOLDS.DINNER_START) {
    return addDays(now, 1);
  }
  return now;
}

export const getInitialDateForServer = (): Date => getMealDisplayDate();
