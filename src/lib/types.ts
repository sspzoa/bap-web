export interface MenuPost {
  documentId: string;
  title: string;
  date: string;
  registrationDate: string;
}

export interface ProcessedMeal {
  regular: string[];
  simple: string[];
  image: string;
}

export interface ProcessedMealMenu {
  breakfast: ProcessedMeal;
  lunch: ProcessedMeal;
  dinner: ProcessedMeal;
}

export interface CafeteriaData {
  breakfast: ProcessedMeal;
  lunch: ProcessedMeal;
  dinner: ProcessedMeal;
}

export interface CafeteriaResponse {
  requestId: string;
  date: string;
  timestamp: string;
  data: CafeteriaData;
}

export interface HealthCheckResponse {
  requestId: string;
  timestamp: string;
  status: string;
  database: {
    connected: boolean;
    totalMealData: number;
    lastUpdated: Date | null;
  };
}

export interface MealDataDocument {
  _id: string;
  data: CafeteriaData;
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodSearchResponse {
  requestId: string;
  timestamp: string;
  foodName: string;
  image: string;
  date: string;
  mealType: string;
}
