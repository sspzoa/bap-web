import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { getInitialDateForServer } from '@/utils/dateUtils';
import { getCurrentMealTiming } from '@/utils/mealTimingUtils';
import { formatToDateString } from '@/utils/timeZoneUtils';

export default async function Page() {
  const initialDate = getInitialDateForServer();
  const formattedDate = formatToDateString(initialDate);
  const initialData = await getMealDataServerSide(formattedDate);
  const { opacity: initialOpacity } = getCurrentMealTiming();

  console.log(`Fetching data for date: ${formattedDate}`);

  return <MealLayout initialData={initialData} initialDate={initialDate} initialOpacity={initialOpacity} />;
}
