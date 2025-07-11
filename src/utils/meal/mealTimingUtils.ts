import { CACHE_SETTINGS, MEAL_TIME_THRESHOLDS, UI_CONSTANTS } from '@/constants';
import { getKoreanHours } from '@/utils/date';

type MealTiming = {
  meal: 'breakfast' | 'lunch' | 'dinner';
  scrollPosition: number;
  opacity: { breakfast: number; lunch: number; dinner: number };
};

const mealTimingCache = new Map<number, MealTiming>();

export const getMealTimingByHour = (hour: number): MealTiming => {
  const cached = mealTimingCache.get(hour);
  if (cached) {
    return cached;
  }

  let result: MealTiming;

  if (hour >= MEAL_TIME_THRESHOLDS.DINNER_START || hour < MEAL_TIME_THRESHOLDS.BREAKFAST_END) {
    result = {
      meal: 'breakfast',
      scrollPosition: 0,
      opacity: { breakfast: 1, lunch: 0, dinner: 0 },
    };
  } else if (hour >= MEAL_TIME_THRESHOLDS.LUNCH_END) {
    result = {
      meal: 'dinner',
      scrollPosition: 2,
      opacity: { breakfast: 0, lunch: 0, dinner: 1 },
    };
  } else {
    result = {
      meal: 'lunch',
      scrollPosition: 1,
      opacity: { breakfast: 0, lunch: 1, dinner: 0 },
    };
  }

  mealTimingCache.set(hour, result);
  return result;
};

export const getCurrentMealTiming = () => {
  const currentHour = getKoreanHours();
  return getMealTimingByHour(currentHour);
};

const opacityCache = new Map<string, { breakfast: number; lunch: number; dinner: number }>();

export const calculateOpacityFromScroll = (scrollPosition: number, totalWidth: number) => {
  const cacheKey = `${scrollPosition.toFixed(2)}-${totalWidth.toFixed(2)}`;

  const cached = opacityCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const sectionWidth = totalWidth / UI_CONSTANTS.SCROLL_SECTIONS;
  let result: { breakfast: number; lunch: number; dinner: number };

  if (scrollPosition < sectionWidth) {
    const progress = scrollPosition / sectionWidth;
    result = {
      breakfast: 1,
      lunch: progress,
      dinner: 0,
    };
  } else if (scrollPosition < sectionWidth * 2) {
    const progress = (scrollPosition - sectionWidth) / sectionWidth;
    result = {
      breakfast: 0,
      lunch: 1,
      dinner: progress,
    };
  } else {
    result = {
      breakfast: 0,
      lunch: 0,
      dinner: 1,
    };
  }

  if (opacityCache.size > CACHE_SETTINGS.OPACITY_CACHE_MAX_SIZE) {
    opacityCache.clear();
  }

  opacityCache.set(cacheKey, result);
  return result;
};
