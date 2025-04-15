import { getKoreanHours } from './timeZoneUtils';

export const getMealTimingByHour = (hour: number) => {
  if (hour >= 20 || hour < 8) {
    return {
      meal: 'breakfast',
      scrollPosition: 0,
      opacity: { breakfast: 1, lunch: 0, dinner: 0 },
    };
  }
  if (hour >= 14) {
    return {
      meal: 'dinner',
      scrollPosition: 2,
      opacity: { breakfast: 0, lunch: 0, dinner: 1 },
    };
  }
  return {
    meal: 'lunch',
    scrollPosition: 1,
    opacity: { breakfast: 0, lunch: 1, dinner: 0 },
  };
};

export const getCurrentMealTiming = () => {
  const currentHour = getKoreanHours();
  return getMealTimingByHour(currentHour);
};

export const calculateOpacityFromScroll = (scrollPosition: number, totalWidth: number) => {
  const sectionWidth = totalWidth / 3;

  if (scrollPosition < sectionWidth) {
    const progress = scrollPosition / sectionWidth;
    return {
      breakfast: 1 - progress,
      lunch: progress,
      dinner: 0,
    };
  }
  if (scrollPosition < sectionWidth * 2) {
    const progress = (scrollPosition - sectionWidth) / sectionWidth;
    return {
      breakfast: 0,
      lunch: 1 - progress,
      dinner: progress,
    };
  }
  return {
    breakfast: 0,
    lunch: 0,
    dinner: 1,
  };
};
