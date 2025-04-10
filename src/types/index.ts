export interface MealItem {
  regular: string[];
  simple: string[];
}

export interface MealData {
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
  };
  images: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface MealSectionProps {
  icon: string;
  title: string;
  regularItems: string[];
  simpleMealItems: string[];
  imageUrl: string;
  isLoading: boolean;
  isError?: boolean;
  id?: string;
  showContent: boolean;
  isSimpleMealMode?: boolean;
}

export interface MealLayoutProps {
  initialData: MealData | null;
  initialDate: Date;
}