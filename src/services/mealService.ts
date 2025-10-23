import type { MealData, MealResponse, MealSearchResponse } from '@/types';
import { handleMealError, handleMealResponse } from './mealServiceHelpers';

export const fetchMealData = async (date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`https://bap.sharp0802.com/${date}`);
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const getMealDataServerSide = async (date: string): Promise<MealResponse | null> => {
  try {
    const response = await fetch(`https://bap.sharp0802.com/${date}`, {
      cache: 'no-store',
    });
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const refreshMealData = async (date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`https://bap.sharp0802.com/refresh/${date}`, {
      method: 'POST',
    });
    return await handleMealResponse(response);
  } catch (error) {
    return handleMealError(error);
  }
};

export const searchFoodImage = async (foodName: string): Promise<MealSearchResponse | null> => {
  try {
    const response = await fetch(`https://bap.sharp0802.com/search/${encodeURIComponent(foodName)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as MealSearchResponse;
  } catch (error) {
    console.error('Food search error:', error);
    return null;
  }
};
