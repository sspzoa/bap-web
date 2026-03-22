import MealLayout from "@/app/(pages)/(home)/(components)/mealLayout";
import { getMealDataServerSide } from "@/shared/lib/mealService";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { getCurrentMealTiming } from "@/shared/utils/mealTimingUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";

export default async function Page() {
  const initialDate = getInitialDateForServer();
  const formattedDate = formatToDateString(initialDate);
  const initialData = await getMealDataServerSide(formattedDate);
  const { opacity: initialOpacity } = getCurrentMealTiming();

  return <MealLayout initialData={initialData} initialDate={initialDate} initialOpacity={initialOpacity} />;
}
