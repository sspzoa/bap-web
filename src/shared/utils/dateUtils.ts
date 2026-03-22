import { addDays } from "date-fns";
import { MEAL_TIME_THRESHOLDS } from "@/shared/lib/constants";
import { getKoreanDate, getKoreanHours } from "./timeZoneUtils";

export const getInitialDateForServer = (): Date => {
  const hour = getKoreanHours();
  const now = getKoreanDate();

  if (hour >= MEAL_TIME_THRESHOLDS.DINNER_START) {
    return addDays(now, 1);
  }

  return now;
};
