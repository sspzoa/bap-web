import MealLayout from '@/components/MealLayout';
import { getMealDataServerSide } from '@/services/mealService';
import { getKoreanTime } from '@/utils/timeZoneUtils';
import { format } from 'date-fns';

export default async function Page() {
  const koreanTime = getKoreanTime();
  const koreanHour = koreanTime.getHours();

  console.log(`Server Korean time: ${koreanTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}, Hour: ${koreanHour}`);

  let initialDate = koreanTime;
  if (koreanHour >= 20) {
    const tomorrow = new Date(koreanTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    initialDate = tomorrow;
  }

  const formattedDate = format(initialDate, 'yyyy-MM-dd');
  const initialData = await getMealDataServerSide(formattedDate);

  console.log(`Initial date: ${initialDate.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}, Formatted: ${formattedDate}`);

  return <MealLayout initialData={initialData} initialDate={initialDate} />;
}