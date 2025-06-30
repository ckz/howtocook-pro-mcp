import { Recipe } from '../types/index.js';

let cachedRecipes: Recipe[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchRecipes(): Promise<Recipe[]> {
  const now = Date.now();
  
  // Return cached recipes if they're still fresh
  if (cachedRecipes.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRecipes;
  }
  
  try {
    console.log('Fetching recipes from remote URL...');
    const response = await fetch('https://weilei.site/all_recipes.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate and transform the data
    if (Array.isArray(data)) {
      cachedRecipes = data.map((item: any) => ({
        id: item.id || item.name || Math.random().toString(36).substr(2, 9),
        name: item.name || '',
        description: item.description || '',
        source_path: item.source_path || '',
        image_path: item.image_path,
        category: item.category || '其他',
        difficulty: item.difficulty,
        tags: item.tags || [],
        servings: item.servings,
        ingredients: Array.isArray(item.ingredients) ? item.ingredients.map((ing: any) => ({
          name: ing.name || ing,
          quantity: ing.quantity,
          unit: ing.unit,
          text_quantity: ing.text_quantity,
          notes: ing.notes
        })) : [],
        steps: Array.isArray(item.steps) ? item.steps.map((step: any, index: number) => ({
          step: step.step || index + 1,
          description: step.description || step
        })) : [],
        prep_time_minutes: item.prep_time_minutes,
        cook_time_minutes: item.cook_time_minutes,
        total_time_minutes: item.total_time_minutes,
        additional_notes: item.additional_notes
      }));
      
      lastFetchTime = now;
      console.log(`Successfully fetched ${cachedRecipes.length} recipes`);
      return cachedRecipes;
    } else {
      throw new Error('Invalid data format: expected array');
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    
    // Return cached recipes if available, otherwise empty array
    if (cachedRecipes.length > 0) {
      console.log('Using cached recipes due to fetch error');
      return cachedRecipes;
    }
    
    return [];
  }
}

export function getAllCategories(recipes: Recipe[]): string[] {
  const categories = new Set<string>();
  
  recipes.forEach(recipe => {
    if (recipe.category) {
      categories.add(recipe.category);
    }
  });
  
  return Array.from(categories).sort();
}

export function getCachedRecipes(): Recipe[] {
  return cachedRecipes;
}