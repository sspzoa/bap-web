import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { getKoreanTime, formatToDateString } from '@/utils/timeZoneUtils';

export default async function Page() {
  const koreanTime = getKoreanTime();
  const koreanHour = koreanTime.getHours();

  let initialDate = koreanTime;
  if (koreanHour >= 20) {
    const tomorrow = new Date(koreanTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    initialDate = tomorrow;
  }

  const formattedDate = formatToDateString(initialDate);
  const initialData = await getMealDataServerSide(formattedDate);

  console.log(`Korean time: ${koreanTime.toISOString()}, Hour: ${koreanHour}, Fetching data for date: ${formattedDate}`);

  return <MealLayout initialData={initialData} initialDate={initialDate} />;
}