import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export default async function Page() {
  const now = new Date();
  const koreanTime = toZonedTime(now, 'Asia/Seoul');
  const koreanHour = koreanTime.getHours();

  console.log(`Server local time: ${now.toISOString()}`);
  console.log(`Korean time: ${koreanTime.toISOString()}, Hour: ${koreanHour}`);

  let targetDate = koreanTime;
  if (koreanHour >= 20) {
    targetDate = new Date(koreanTime.getTime() + 24 * 60 * 60 * 1000);
  }

  const formattedDate = format(targetDate, 'yyyy-MM-dd');

  console.log(`Target date: ${targetDate.toISOString()}, Formatted: ${formattedDate}`);

  const initialData = await getMealDataServerSide(formattedDate);

  return <MealLayout initialData={initialData} initialDate={targetDate} />;
}