import { format } from "date-fns";
import { MealData } from "@/types";
import ClientHome from "@/components/ClientHome";

async function fetchMealData(date: string): Promise<MealData> {
  try {
    const response = await fetch(`https://api.xn--rh3b.net/${date}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meal data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching meal data:", error);
    return {
      breakfast: "",
      lunch: "",
      dinner: "",
      images: {
        breakfast: "",
        lunch: "",
        dinner: ""
      }
    };
  }
}

export default async function Home() {
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");

  const initialData = await fetchMealData(formattedDate);

  return (
    <ClientHome initialData={initialData} initialDate={today} />
  );
}