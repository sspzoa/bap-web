import type { MealData } from '@/types';

export const fetchMealData = async (date: string): Promise<MealData> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`);
    if (!response.ok) {
      let errorMessage = '급식 정보가 없어요';

      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('급식 정보가 없어요');
  }
};

export const getMealDataServerSide = async (date: string): Promise<MealData | null> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorMessage = '급식 정보가 없어요';

      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching initial meal data:', error);
    return null;
  }
};
