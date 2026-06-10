import { CACHE_SETTINGS, MEAL_TIME_THRESHOLDS } from "@/shared/lib/constants";
import { getKoreanHours } from "@/shared/utils/timeZoneUtils";

// dgu는 중식(점심)·석식(저녁) 2개 끼니만 있으므로 스와이프 섹션도 2개.
export const DGU_SCROLL_SECTIONS = 2;

type MealTiming = {
  meal: "lunch" | "dinner";
  scrollPosition: number; // 0 = 중식, 1 = 석식
  opacity: { lunch: number; dinner: number };
};

const mealTimingCache = new Map<number, MealTiming>();

export const getMealTimingByHour = (hour: number): MealTiming => {
  const cached = mealTimingCache.get(hour);
  if (cached) {
    return cached;
  }

  let result: MealTiming;

  if (hour >= MEAL_TIME_THRESHOLDS.DINNER_START) {
    // 저녁 식사 시간 이후 → 다음 날 첫 끼니(중식). 날짜 +1은 useMealInitialization 에서 처리.
    result = { meal: "lunch", scrollPosition: 0, opacity: { lunch: 1, dinner: 0 } };
  } else if (hour >= MEAL_TIME_THRESHOLDS.LUNCH_END) {
    result = { meal: "dinner", scrollPosition: 1, opacity: { lunch: 0, dinner: 1 } };
  } else {
    result = { meal: "lunch", scrollPosition: 0, opacity: { lunch: 1, dinner: 0 } };
  }

  mealTimingCache.set(hour, result);
  return result;
};

export const getCurrentMealTiming = () => {
  return getMealTimingByHour(getKoreanHours());
};

const opacityCache = new Map<string, { lunch: number; dinner: number }>();

// 2개 섹션이므로 스크롤 진행도(0~1)에 따라 점심 → 저녁 배경을 선형 크로스페이드.
export const calculateOpacityFromScroll = (scrollPosition: number, totalWidth: number) => {
  const cacheKey = `${scrollPosition.toFixed(2)}-${totalWidth.toFixed(2)}`;

  const cached = opacityCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const progress = totalWidth > 0 ? Math.min(Math.max(scrollPosition / totalWidth, 0), 1) : 0;
  const result = { lunch: 1 - progress, dinner: progress };

  if (opacityCache.size > CACHE_SETTINGS.OPACITY_CACHE_MAX_SIZE) {
    opacityCache.clear();
  }

  opacityCache.set(cacheKey, result);
  return result;
};
