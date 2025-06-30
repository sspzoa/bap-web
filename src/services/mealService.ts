import { CONFIG } from '@/config';
import type { MealData } from '@/types';
import { ApiError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { api } from './api';

const mealLogger = logger.child({ component: 'meal-service' });

interface MealResponse {
  data: MealData;
}

class MealService {
  private cache: Map<string, { data: MealData; timestamp: number }> = new Map();
  private cacheTimeout = CONFIG.CACHE.MEAL_DATA_STALE_TIME;

  async fetchMealData(date: string): Promise<MealData> {
    const timer = mealLogger.time('fetchMealData', { date });

    try {
      const cached = this.getFromCache(date);
      if (cached) {
        mealLogger.debug('Cache hit', { date });
        timer();
        return cached;
      }

      mealLogger.info('Fetching meal data', { date });

      const response = await api.get<MealResponse>(`/${date}`);
      const mealData = response.data;

      this.validateMealData(mealData);

      this.setCache(date, mealData);

      timer();
      return mealData;
    } catch (error) {
      timer();

      if (error instanceof ApiError) {
        mealLogger.warn('API error fetching meal data', {
          date,
          status: error.status,
          message: error.message,
        });
        throw error;
      }

      mealLogger.error('Unexpected error fetching meal data', error);
      throw new Error('급식 정보를 불러올 수 없어요');
    }
  }

  async getMealDataServerSide(date: string): Promise<MealData | null> {
    const timer = mealLogger.time('getMealDataServerSide', { date });

    try {
      mealLogger.info('Server-side meal data fetch', { date });

      const response = await fetch(`${CONFIG.API.BASE_URL}/${date}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw ApiError.fromResponse(response, errorData);
      }

      const responseData: MealResponse = await response.json();
      const mealData = responseData.data;

      this.validateMealData(mealData);

      timer();
      return mealData;
    } catch (error) {
      timer();

      if (error instanceof ApiError && error.status === 404) {
        mealLogger.info('No meal data available', { date });
        return null;
      }

      mealLogger.error('Server-side fetch error', error);
      return null;
    }
  }

  private validateMealData(data: MealData): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid meal data format');
    }

    const meals = ['breakfast', 'lunch', 'dinner'] as const;

    for (const meal of meals) {
      if (!data[meal] || typeof data[meal] !== 'object') {
        throw new Error(`Invalid ${meal} data`);
      }

      const mealData = data[meal];

      if (!Array.isArray(mealData.regular) || !Array.isArray(mealData.simple)) {
        throw new Error(`Invalid ${meal} menu arrays`);
      }

      if (typeof mealData.image !== 'string') {
        throw new Error(`Invalid ${meal} image`);
      }
    }
  }

  private getFromCache(date: string): MealData | null {
    const cached = this.cache.get(date);

    if (!cached) {
      return null;
    }

    const isExpired = Date.now() - cached.timestamp > this.cacheTimeout;

    if (isExpired) {
      this.cache.delete(date);
      return null;
    }

    return cached.data;
  }

  private setCache(date: string, data: MealData): void {
    this.cache.set(date, {
      data,
      timestamp: Date.now(),
    });

    if (this.cache.size > 30) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
  }

  clearCache(): void {
    mealLogger.info('Clearing meal data cache');
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        date: key,
        timestamp: value.timestamp,
        age: Date.now() - value.timestamp,
      })),
    };
  }
}

export const mealService = new MealService();

export const fetchMealData = (date: string) => mealService.fetchMealData(date);
export const getMealDataServerSide = (date: string) => mealService.getMealDataServerSide(date);
