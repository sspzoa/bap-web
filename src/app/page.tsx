import { format } from "date-fns";
import { MealData } from "@/types";
import MealLayout from "@/components/MealLayout";

async function getMealData(date: string): Promise<MealData | null> {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meal data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching initial meal data:", error);
    return null;
  }
}

function getDateToFetch() {
  const now = new Date();

  if (now.getHours() >= 20) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow;
  }

  return now;
}

export default async function Page() {
  const initialDate = getDateToFetch();
  const formattedDate = format(initialDate, "yyyy-MM-dd");
  const initialData = await getMealData(formattedDate);

  console.log(`Fetching data for date: ${formattedDate}`);

  return <MealLayout initialData={initialData} initialDate={initialDate} />;
}