export interface MealFetchResult<T = unknown> {
  data: T | null;
  error: string | null;
  isError: boolean;
}

export interface MealSearchResponse {
  foodName: string;
  image: string;
  date: string;
  mealType: string;
  matchedMenu?: string;
  section?: "regular" | "simple" | "plus";
}

export interface MealSlotMeta {
  id: string;
  title: string;
  operatingHours: string | null;
  icon: string;
  background: string;
  activeUntilHour: number;
}

export interface SitePresentation {
  id: string;
  name: string;
  schoolName: string;
  basePath: string;
  description: string;
  keywords: string[];
  googleSiteVerification?: string;
  adsenseClient?: string;
  features: { foodSearch: boolean };
  meals: MealSlotMeta[];
}

export interface PublicMenuGroup {
  id: string;
  label: string | null;
  price: string | null;
  items: string[];
}

export interface PublicMeal {
  id: string;
  title: string;
  operatingHours: string | null;
  kcal: number | null;
  image: string | null;
  groups: PublicMenuGroup[];
}

export interface PublicDayMenu {
  meals: PublicMeal[];
}

export interface CatalogResponse {
  requestId: string;
  timestamp: string;
  message: string;
  providers: SitePresentation[];
}
