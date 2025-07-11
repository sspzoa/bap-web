// Time thresholds for meal timing
export const MEAL_TIME_THRESHOLDS = {
  BREAKFAST_END: 8,
  LUNCH_END: 14,
  DINNER_START: 20,
} as const;

// Cache settings
export const CACHE_SETTINGS = {
  KOREAN_TIME_DURATION: 60000, // 1 minute
  OPACITY_CACHE_MAX_SIZE: 100,
  QUERY_STALE_TIME: 1000 * 60 * 10, // 10 minutes
  QUERY_GC_TIME: 1000 * 60 * 30, // 30 minutes
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
} as const;

// UI constants
export const UI_CONSTANTS = {
  SCROLL_SECTIONS: 3,
  DEBOUNCE_DELAY: 100,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NO_MEAL_DATA: '급식 정보가 없어요',
  NO_MEAL_OPERATION: '급식 운영이 없어요',
  NO_SIMPLE_MEAL: '간편식이 없어요',
} as const;
