import type { MealData, MealResponse } from '@/types';
import { handleMealError, handleMealResponse } from './mealServiceHelpers';

export const fetchMealData = async (date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`);
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const getMealDataServerSide = async (date: string): Promise<MealResponse | null> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`, {
      cache: 'no-store',
    });
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const refreshMealData = async (date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/refresh/${date}`, {
      method: 'POST',
    });
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};
