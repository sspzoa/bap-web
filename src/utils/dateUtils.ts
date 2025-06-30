import { addDays } from 'date-fns';
import {getKoreanDate, getKoreanHours} from "@/utils/timeZoneUtils";

export const getInitialDateForServer = (): Date => {
  const hour = getKoreanHours();
  const now = getKoreanDate();

  if (hour >= 20) {
    return addDays(now, 1);
  }

  return now;
};