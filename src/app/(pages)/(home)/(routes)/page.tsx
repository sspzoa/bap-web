import { getMealDataServerSide } from "@/shared/lib/mealService";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteConfig } from "@/sites/config";
import { getSiteId } from "@/sites/server";
import DguMealLayout from "@/sites/dgu/components/mealLayout";
import KdmhsMealLayout from "@/sites/kdmhs/components/mealLayout";
import { getCurrentMealTiming } from "@/sites/kdmhs/utils/mealTimingUtils";

export default async function Page() {
  const siteId = await getSiteId();
  const siteConfig = getSiteConfig(siteId);
  const initialDate = getInitialDateForServer(siteId);
  const formattedDate = formatToDateString(initialDate);
  const initialData = await getMealDataServerSide(siteConfig.apiPath, formattedDate);

  if (siteId === "dgu") {
    return <DguMealLayout initialData={initialData} initialDate={initialDate} />;
  }

  const { opacity: initialOpacity } = getCurrentMealTiming();
  return <KdmhsMealLayout initialData={initialData} initialDate={initialDate} initialOpacity={initialOpacity} />;
}
