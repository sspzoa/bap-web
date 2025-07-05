import type { MealData, MealResponse } from '@/types';

export const fetchMealData = async (date: string): Promise<MealResponse> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`);

    if (!response.ok) {
      let errorMessage = '급식 정보가 없어요';

      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {}

      return {
        data: null,
        error: errorMessage,
        isError: true,
      };
    }

    const responseData = await response.json();
    return {
      data: responseData.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '급식 정보가 없어요';
    return {
      data: null,
      error: errorMessage,
      isError: true,
    };
  }
};

export const getMealDataServerSide = async (date: string): Promise<MealResponse | null> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorMessage = '급식 정보가 없어요';

      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {}

      return {
        data: null,
        error: errorMessage,
        isError: true,
      };
    }

    const responseData = await response.json();
    return {
      data: responseData.data,
      error: null,
      isError: false,
    };
  } catch (error) {
    console.error('Error fetching initial meal data:', error);
    const errorMessage = error instanceof Error ? error.message : '급식 정보가 없어요';
    return {
      data: null,
      error: errorMessage,
      isError: true,
    };
  }
};
