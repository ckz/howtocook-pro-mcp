export interface Ingredient {
  name: string;
  quantity?: number;
  unit?: string;
  text_quantity?: string;
  notes?: string;
}

export interface Step {
  step: number;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  source_path: string;
  image_path?: string;
  category: string;
  difficulty?: string;
  tags?: string[];
  servings?: number;
  ingredients: Ingredient[];
  steps: Step[];
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  additional_notes?: string;
}

export interface SimpleRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
}

export interface NameOnlyRecipe {
  name: string;
  description: string;
}

export interface DayPlan {
  day: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export interface GroceryList {
  ingredients: string[];
  shoppingPlan: {
    fresh: string[];
    pantry: string[];
    spices: string[];
    others: string[];
  };
}

export interface MealPlan {
  weekdays: DayPlan[];
  weekend: DayPlan[];
  groceryList: GroceryList;
}

export interface DishRecommendation {
  peopleCount: number;
  vegetableDishCount: number;
  meatDishCount: number;
  fishDishCount?: number;
  dishes: string[];
  message: string;
}