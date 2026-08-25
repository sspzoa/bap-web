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

export interface ApiDocsField {
  name: string;
  type: string;
  description: string;
}

export interface ApiDocsEndpoint {
  id: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  curls: string[];
  responseExample?: string;
  notes?: string[];
  fieldTables?: { title?: string; rows: ApiDocsField[] }[];
}

export interface ApiDocsGuideStep {
  title: string;
  body: string;
  code?: string;
}

export interface ApiDocsGuide {
  id: string;
  title: string;
  intro: string;
  steps: ApiDocsGuideStep[];
  fieldTables?: { title?: string; rows: ApiDocsField[] }[];
  checklist: string[];
  notes: string[];
}

export interface ApiDocsPayload {
  title: string;
  subtitle: string;
  baseUrl: string;
  exampleDate: string;
  toc: { id: string; label: string }[];
  overviewBullets: string[];
  providerNote: string;
  endpoints: ApiDocsEndpoint[];
  typeSchemas: { title: string; rows: ApiDocsField[] }[];
  guides?: ApiDocsGuide[];
  errors: {
    example: string;
    rows: ApiDocsField[];
    note: string;
  };
}

export interface ApiDocsResponse {
  requestId: string;
  timestamp: string;
  providers: SitePresentation[];
  docs: ApiDocsPayload;
}
