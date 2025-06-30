import { addDays, format, subDays } from 'date-fns';
import { getKoreanTime, toKoreanTime, formatToDateString } from './timeZoneUtils';

export const formatDate = (date: Date): string => {
  const koreanTime = toKoreanTime(date);
  return format(koreanTime, 'yyyy-MM-dd');
};

export const getPreviousDay = (date: Date): Date => {
  const koreanTime = toKoreanTime(date);
  return subDays(koreanTime, 1);
};

export const getNextDay = (date: Date): Date => {
  const koreanTime = toKoreanTime(date);
  return addDays(koreanTime, 1);
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
  return formatToDateString(getPreviousDay(date));
};

export const getFormattedNextDay = (date: Date): string => {
  return formatToDateString(getNextDay(date));
};

export const getInitialDateForServer = (): Date => {
  const koreanTime = getKoreanTime();
  const hour = koreanTime.getHours();

  if (hour >= 20) {
    const tomorrow = new Date(koreanTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  return koreanTime;
};