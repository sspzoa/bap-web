import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const formatToDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const KOREA_TIMEZONE = 'Asia/Seoul';

export const getKoreanDate = (): Date => {
  const koreanTime = toZonedTime(new Date(), KOREA_TIMEZONE);
  return new Date(koreanTime.getFullYear(), koreanTime.getMonth(), koreanTime.getDate());
};

export const getKoreanHours = (): number => {
  const koreanTime = toZonedTime(new Date(), KOREA_TIMEZONE);
  return koreanTime.getHours();
};
