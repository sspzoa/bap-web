import { NextRequest } from 'next/server';
import { mongoDB } from '@/lib/mongodb';
import { ApiError, handleError } from '@/lib/error';
import type { FoodSearchResponse } from '@/lib/types';

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ foodName: string }> }
) {
  const requestId = generateRequestId();
  const { foodName } = await params;
  const decodedFoodName = decodeURIComponent(foodName);

  try {
    await mongoDB.connect();

    const latestImage = await mongoDB.searchLatestFoodImage(decodedFoodName);

    if (!latestImage) {
      throw new ApiError(404, '해당 메뉴를 찾을 수 없어요');
    }

    const response: FoodSearchResponse = {
      requestId,
      timestamp: new Date().toISOString(),
      foodName: decodedFoodName,
      image: latestImage.image,
      date: latestImage.date,
      mealType: latestImage.mealType,
    };

    return Response.json(response);
  } catch (error) {
    return handleError(error, requestId);
  }
}
