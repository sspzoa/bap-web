import { getMealDataServerSide } from "@/shared/lib/mealService";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteConfig } from "@/sites/config";
import KdmhsMealLayout from "@/sites/kdmhs/components/mealLayout";
import type { MealData } from "@/sites/kdmhs/types";
import { getCurrentMealTiming } from "@/sites/kdmhs/utils/mealTimingUtils";

export async function renderKdmhsHome() {
  const { apiPath } = getSiteConfig("kdmhs");
  const formattedDate = formatToDateString(getInitialDateForServer());
  const initialData = await getMealDataServerSide<MealData>(apiPath, formattedDate);
  const { opacity } = getCurrentMealTiming();

  return <KdmhsMealLayout initialData={initialData} initialOpacity={opacity} />;
}
