import { addDays, format as fnsFormat, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Seoul';

export const toKoreanTime = (date: Date): Date => {
  return toZonedTime(date, TIMEZONE);
};

export const getCurrentKoreanTime = (): Date => {
  return toKoreanTime(new Date());
};

export const formatKoreanDate = (date: Date, formatStr: string): string => {
  const koreanDate = toKoreanTime(date);
  return fnsFormat(koreanDate, formatStr);
};

export const getKoreanHours = (): number => {
  return getCurrentKoreanTime().getHours();
};

export const formatToKoreanDateString = (date: Date): string => {
  return formatKoreanDate(date, 'yyyy-MM-dd');
};

export const getKoreanPreviousDay = (date: Date): Date => {
  const koreanDate = toKoreanTime(date);
  return subDays(koreanDate, 1);
};

export const getKoreanNextDay = (date: Date): Date => {
  const koreanDate = toKoreanTime(date);
  return addDays(koreanDate, 1);
};
