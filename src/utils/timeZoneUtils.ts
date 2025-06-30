import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const KOREA_TIMEZONE = 'Asia/Seoul';

export const formatToDateString = (date: Date): string => {
  const koreanTime = toZonedTime(date, KOREA_TIMEZONE);
  return format(koreanTime, 'yyyy-MM-dd');
};

export const getKoreanHours = (): number => {
  const koreanTime = toZonedTime(new Date(), KOREA_TIMEZONE);
  return koreanTime.getHours();
};

export const getKoreanTime = (): Date => {
  return toZonedTime(new Date(), KOREA_TIMEZONE);
};

export const toKoreanTime = (date: Date): Date => {
  return toZonedTime(date, KOREA_TIMEZONE);
};