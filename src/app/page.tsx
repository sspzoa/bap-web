import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { getInitialDateForServer } from '@/utils/dateUtils';
import { formatToKoreanDateString } from '@/utils/timeZoneUtils';

export default async function Page() {
  const initialDate = getInitialDateForServer();
  const formattedDate = formatToKoreanDateString(initialDate);
  const initialData = await getMealDataServerSide(formattedDate);

  console.log(`Fetching data for date: ${formattedDate} (KST)`);

  return <MealLayout initialData={initialData} initialDate={initialDate} />;
}
