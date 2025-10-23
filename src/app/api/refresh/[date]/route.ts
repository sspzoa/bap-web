import { NextRequest } from 'next/server';
import { mongoDB } from '@/lib/mongodb';
import { refreshSpecificDate } from '@/lib/cafeteria';
import { isValidDate } from '@/lib/date';
import { ApiError, handleError } from '@/lib/error';
import type { CafeteriaResponse } from '@/lib/types';

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const requestId = generateRequestId();
  const { date: dateParam } = await params;

  try {
    await mongoDB.connect();

    if (!isValidDate(dateParam)) {
      throw new ApiError(400, 'Invalid date format');
    }

    const data = await refreshSpecificDate(dateParam);

    const response: CafeteriaResponse = {
      requestId,
      timestamp: new Date().toISOString(),
      date: dateParam,
      data,
    };

    return Response.json(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'NO_INFORMATION' || error.message.includes('not found')) {
        return handleError(new ApiError(404, '급식 정보가 없어요'), requestId);
      }
    }
    return handleError(error, requestId);
  }
}
