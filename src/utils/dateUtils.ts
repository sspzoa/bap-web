import { getKoreanDate, getKoreanHours } from '@/utils/timeZoneUtils';
import { addDays } from 'date-fns';

export const getInitialDateForServer = (): Date => {
  const hour = getKoreanHours();
  const now = getKoreanDate();

  if (hour >= 20) {
    return addDays(now, 1);
  }

  return now;
};
