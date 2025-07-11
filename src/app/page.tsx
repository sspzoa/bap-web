import { MealLayout } from '@/components/layout';
import { getMealDataServerSide } from '@/services/mealService';
import { getInitialDateForServer } from '@/utils/date';
import { formatToDateString } from '@/utils/date';
import { getCurrentMealTiming } from '@/utils/meal';

export default async function Page() {
  const initialDate = getInitialDateForServer();
  const formattedDate = formatToDateString(initialDate);
  const initialData = await getMealDataServerSide(formattedDate);
  const { opacity: initialOpacity } = getCurrentMealTiming();

  return <MealLayout initialData={initialData} initialDate={initialDate} initialOpacity={initialOpacity} />;
}
