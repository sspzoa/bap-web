export const MEAL_TIME_THRESHOLDS = {
  BREAKFAST_END: 8,
  LUNCH_END: 14,
  DINNER_START: 20,
} as const;

export const CACHE_SETTINGS = {
  KOREAN_TIME_DURATION: 60000,
  OPACITY_CACHE_MAX_SIZE: 100,
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
} as const;

export const UI_CONSTANTS = {
  SCROLL_SECTIONS: 3,
  DEBOUNCE_DELAY: 100,
} as const;

export const ERROR_MESSAGES = {
  NO_MEAL_DATA: '급식 정보가 없어요',
  NO_MEAL_OPERATION: '급식 운영이 없어요',
  NO_SIMPLE_MEAL: '간편식이 없어요',
} as const;
