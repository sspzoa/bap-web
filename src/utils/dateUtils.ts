import { addDays, format, subDays } from 'date-fns';

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
  const now = new Date();

  if (now.getHours() >= 20) {
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
