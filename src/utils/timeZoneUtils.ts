import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const KOREA_TIMEZONE = 'Asia/Seoul';

let cachedKoreanTime: { date: Date; hours: number; cacheTime: number } | null = null;
const CACHE_DURATION = 60000;

const getKoreanTimeCache = () => {
  const now = Date.now();

  if (cachedKoreanTime && now - cachedKoreanTime.cacheTime < CACHE_DURATION) {
    return cachedKoreanTime;
  }

  const koreanTime = toZonedTime(new Date(), KOREA_TIMEZONE);
  const koreanDate = new Date(koreanTime.getFullYear(), koreanTime.getMonth(), koreanTime.getDate());

  cachedKoreanTime = {
    date: koreanDate,
    hours: koreanTime.getHours(),
    cacheTime: now,
  };

  return cachedKoreanTime;
};

export const formatToDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getKoreanDate = (): Date => {
  return getKoreanTimeCache().date;
};

export const getKoreanHours = (): number => {
  return getKoreanTimeCache().hours;
};

export const clearKoreanTimeCache = () => {
  cachedKoreanTime = null;
};
