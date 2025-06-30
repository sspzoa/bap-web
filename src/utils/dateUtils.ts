import { addDays, format, subDays } from 'date-fns';
import { toKoreanTime, getKoreanTime, formatUTCToKoreanDateString } from './timeZoneUtils';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getPreviousDay = (date: Date): Date => {
  return subDays(date, 1);
};

export const getNextDay = (date: Date): Date => {
  return addDays(date, 1);
};

export const getDateToFetch = (): Date => {
  const koreanTime = getKoreanTime();
  const hour = koreanTime.getHours();

  if (hour >= 20) {
    return addDays(koreanTime, 1);
  }

  return koreanTime;
};

export const getFormattedPreviousDay = (date: Date): string => {
  return formatDate(getPreviousDay(date));
};

export const getFormattedNextDay = (date: Date): string => {
  return formatDate(getNextDay(date));
};

export const getInitialDateForServer = (): Date => {
  const koreanTime = getKoreanTime();
  const hour = koreanTime.getHours();

  console.log(`Server Korean Time: ${koreanTime.toISOString()}, Hour: ${hour}`);

  if (hour >= 20) {
    const nextDay = addDays(koreanTime, 1);
    console.log(`After 8 PM, moving to next day: ${nextDay.toISOString()}`);
    return nextDay;
  }

  return koreanTime;
};