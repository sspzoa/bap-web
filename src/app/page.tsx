import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { getInitialDateForServer } from '@/utils/dateUtils';
import { formatToDateString, getKoreanTime } from '@/utils/timeZoneUtils';

export default async function Page() {
  const koreanTime = getKoreanTime();
  const initialDate = getInitialDateForServer();
  const formattedDate = formatToDateString(initialDate);

  const initialData = await getMealDataServerSide(formattedDate);

  console.log(`Server Korean Time: ${koreanTime.toISOString()}`);
  console.log(`Fetching data for Korean date: ${formattedDate}`);
  console.log(`Initial Date: ${initialDate.toISOString()}`);

  return <MealLayout initialData={initialData} initialDate={initialDate} />;
}