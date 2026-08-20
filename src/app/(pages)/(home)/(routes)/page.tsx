import { getMealDataServerSide } from "@/shared/lib/mealService";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";
import DguMealLayout from "@/sites/dgu/components/mealLayout";
import type { DayMenu } from "@/sites/dgu/types";
import { getCurrentMealTiming as getDguMealTiming } from "@/sites/dgu/utils/mealTimingUtils";
import KdmhsMealLayout from "@/sites/kdmhs/components/mealLayout";
import type { MealData } from "@/sites/kdmhs/types";
import { getCurrentMealTiming } from "@/sites/kdmhs/utils/mealTimingUtils";

export default async function Page() {
  const siteId = await getSiteId();
  const siteConfig = getSiteConfig(siteId);
  const formattedDate = formatToDateString(getInitialDateForServer());

  if (siteId === "dgu") {
    const initialData = await getMealDataServerSide<DayMenu>(siteConfig.apiPath, formattedDate);
    const { opacity: dguInitialOpacity } = getDguMealTiming();
    return <DguMealLayout initialData={initialData} initialOpacity={dguInitialOpacity} />;
  }

  const initialData = await getMealDataServerSide<MealData>(siteConfig.apiPath, formattedDate);
  const { opacity: initialOpacity } = getCurrentMealTiming();
  return <KdmhsMealLayout initialData={initialData} initialOpacity={initialOpacity} />;
}
