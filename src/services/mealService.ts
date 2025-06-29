import type { MealData, ApiResponse, ApiErrorResponse } from '@/types';

export const fetchMealData = async (date: string): Promise<MealData> => {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`);

    if (!response.ok) {
      let errorMessage = '급식 정보가 없어요';

      try {
        const errorData: ApiErrorResponse = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }

      throw new Error(errorMessage);
    }

    const responseData: ApiResponse = await response.json();
    return responseData.data;
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

      try {
        const errorData: ApiErrorResponse = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }

      throw new Error(errorMessage);
    }

    const responseData: ApiResponse = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching initial meal data:', error);
    return null;
  }
};