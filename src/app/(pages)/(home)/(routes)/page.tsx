import { redirect } from "next/navigation";
import MealLayout from "@/shared/components/mealLayout";
import { findSite, getCatalog } from "@/shared/lib/catalog";
import { getMealDataServerSide } from "@/shared/lib/mealService";
import type { PublicDayMenu } from "@/shared/types/index";
import { getInitialDateForServer } from "@/shared/utils/dateUtils";
import { getCurrentMealTiming } from "@/shared/utils/mealTimingUtils";
import { formatToDateString } from "@/shared/utils/timeZoneUtils";
import { getSiteId } from "@/sites/server";

export default async function Page() {
  const siteId = await getSiteId();
  const catalog = await getCatalog();
  const site = findSite(catalog, siteId);

  if (!site) {
    redirect("/select");
  }

  const formattedDate = formatToDateString(getInitialDateForServer());
  const initialData = await getMealDataServerSide<PublicDayMenu>(site.basePath, formattedDate);
  const { opacities } = getCurrentMealTiming(site.meals);

  return <MealLayout initialData={initialData} initialFormattedDate={formattedDate} initialOpacities={opacities} />;
}
