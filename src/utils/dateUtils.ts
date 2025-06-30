import { addDays, format, subDays } from 'date-fns';
import {
  formatToKoreanDateString,
  getCurrentKoreanTime,
  getKoreanHours,
  getKoreanNextDay,
  getKoreanPreviousDay,
} from './timeZoneUtils';

export const formatDate = (date: Date): string => {
  return formatToKoreanDateString(date);
};

export const getPreviousDay = (date: Date): Date => {
  return getKoreanPreviousDay(date);
};

export const getNextDay = (date: Date): Date => {
  return getKoreanNextDay(date);
};

export const getDateToFetch = (): Date => {
  const koreanHour = getKoreanHours();
  const now = getCurrentKoreanTime();

  if (koreanHour >= 20) {
    return addDays(now, 1);
  }

  return now;
};

export const getFormattedPreviousDay = (date: Date): string => {
  return formatDate(getPreviousDay(date));
};

export const getFormattedNextDay = (date: Date): string => {
  return formatDate(getNextDay(date));
};

export const getInitialDateForServer = (): Date => {
  const koreanHour = getKoreanHours();
  const now = getCurrentKoreanTime();

  if (koreanHour >= 20) {
    return addDays(now, 1);
  }

  return now;
};
