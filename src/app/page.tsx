import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { getInitialDateForServer } from '@/utils/dateUtils';
import { logger } from '@/utils/logger';
import { formatToKoreanDateString } from '@/utils/timeZoneUtils';
import { headers } from 'next/headers';

const pageLogger = logger.child({ component: 'HomePage' });

export default async function Page() {
  const timer = pageLogger.time('server-render');

  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const referer = headersList.get('referer') || 'direct';

    pageLogger.info('Page request', {
      userAgent: userAgent.substring(0, 100),
      referer,
    });

    const initialDate = getInitialDateForServer();
    const formattedDate = formatToKoreanDateString(initialDate);

    pageLogger.info('Fetching initial data', { date: formattedDate });

    const dataTimer = pageLogger.time('fetch-initial-data');
    const initialData = await getMealDataServerSide(formattedDate);
    dataTimer();

    if (!initialData) {
      pageLogger.warn('No initial data available', { date: formattedDate });
    } else {
      pageLogger.info('Initial data fetched successfully', {
        date: formattedDate,
        hasBreakfast: initialData.breakfast.regular.length > 0,
        hasLunch: initialData.lunch.regular.length > 0,
        hasDinner: initialData.dinner.regular.length > 0,
      });
    }

    timer();

    return <MealLayout initialData={initialData} initialDate={initialDate} />;
  } catch (error) {
    timer();
    pageLogger.error('Failed to render page', error);

    const initialDate = getInitialDateForServer();
    return <MealLayout initialData={null} initialDate={initialDate} />;
  }
}
