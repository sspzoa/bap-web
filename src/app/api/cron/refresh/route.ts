import { NextRequest } from 'next/server';
import { mongoDB } from '@/lib/mongodb';
import { refreshCafeteriaData } from '@/lib/cafeteria';
import { handleError } from '@/lib/error';

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();

  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await mongoDB.connect();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'today' | 'all' || 'all';

    await refreshCafeteriaData(type);

    return Response.json({
      requestId,
      timestamp: new Date().toISOString(),
      message: `Refresh completed (${type})`,
    });
  } catch (error) {
    return handleError(error, requestId);
  }
}
