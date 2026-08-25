import { getMealDataServerSide } from "@/shared/lib/mealService";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteConfig, type SiteId } from "@/sites/config";
import DguMealLayout from "@/sites/dgu/components/mealLayout";
import type { DayMenu } from "@/sites/dgu/types";
import { getCurrentMealTiming } from "@/sites/dgu/utils/mealTimingUtils";

export async function renderCornerMenuHome(siteId: SiteId) {
  const { apiPath } = getSiteConfig(siteId);
  const formattedDate = formatToDateString(getInitialDateForServer());
  const initialData = await getMealDataServerSide<DayMenu>(apiPath, formattedDate);
  const { opacity } = getCurrentMealTiming();

  return <DguMealLayout initialData={initialData} initialOpacity={opacity} />;
}

export async function renderDguHome() {
  return renderCornerMenuHome("dgu");
}
