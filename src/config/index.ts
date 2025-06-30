export const CONFIG = {
  APP: {
    NAME: '밥.net',
    VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    ENVIRONMENT: process.env.NODE_ENV || 'development',
  },
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.xn--rh3b.net',
    TIMEOUT: 10000,
    RETRY: {
      COUNT: 3,
      DELAY: 1000,
    },
  },
  CACHE: {
    MEAL_DATA_STALE_TIME: 5 * 60 * 1000,
    PREFETCH_STALE_TIME: 5 * 60 * 1000,
  },
  UI: {
    MOBILE_BREAKPOINT: 768,
    SCROLL_SNAP_THRESHOLD: 50,
    ANIMATION_DURATION: 200,
    MEAL_TRANSITION_HOUR: 20,
  },
  MEAL_TIMING: {
    BREAKFAST: {
      START_HOUR: 0,
      END_HOUR: 8,
    },
    LUNCH: {
      START_HOUR: 8,
      END_HOUR: 14,
    },
    DINNER: {
      START_HOUR: 14,
      END_HOUR: 20,
    },
    NEXT_DAY_HOUR: 20,
  },
  SEARCH: {
    NAVER_URL: 'https://search.naver.com/search.naver',
    SEARCH_PARAMS: 'ssc=tab.image.all&where=image&sm=tab_jum&query=',
  },
  MONITORING: {
    ENABLE_PERFORMANCE_LOGGING: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_LOGGING === 'true',
    ENABLE_ERROR_TRACKING: process.env.NEXT_PUBLIC_ENABLE_ERROR_TRACKING === 'true',
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
  STORAGE_KEYS: {
    SIMPLE_MEAL_TOGGLE: 'simpleMealToggle',
    USER_PREFERENCES: 'userPreferences',
    LAST_VIEWED_DATE: 'lastViewedDate',
  },
} as const;

export type Config = typeof CONFIG;
