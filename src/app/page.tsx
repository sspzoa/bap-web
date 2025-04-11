import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { getDateToFetch } from '@/utils/dateUtils';
import { format } from 'date-fns';

export default async function Page() {
  const initialDate = getDateToFetch();
  const formattedDate = format(initialDate, 'yyyy-MM-dd');
  const initialData = await getMealDataServerSide(formattedDate);

  console.log(`Fetching data for date: ${formattedDate}`);

  return <MealLayout initialData={initialData} initialDate={initialDate} />;
}
