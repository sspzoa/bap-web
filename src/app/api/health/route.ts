import { NextRequest } from 'next/server';
import { mongoDB } from '@/lib/mongodb';
import type { HealthCheckResponse } from '@/lib/types';
import { handleError } from '@/lib/error';

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  try {
    await mongoDB.connect();
    const stats = await mongoDB.getStats();

    const response: HealthCheckResponse = {
      requestId,
      timestamp: new Date().toISOString(),
      status: 'ok',
      database: {
        connected: true,
        totalMealData: stats.totalMealData,
        lastUpdated: stats.lastUpdated,
      },
    };

    return Response.json(response);
  } catch (error) {
    return handleError(error, requestId);
  }
}
