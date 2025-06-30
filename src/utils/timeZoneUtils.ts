import { format } from 'date-fns';

export const formatToDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};