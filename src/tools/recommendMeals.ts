import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { Recipe, MealPlan, DayPlan, GroceryList } from '../types/index.js';
import { getRandomItems, processRecipeIngredients, categorizeIngredients } from '../utils/recipeUtils.js';

export const recommendMealsTool: Tool = {
  name: 'recommendMeals',
  description: '根据用户的忌口、过敏原、人数智能推荐菜谱，创建一周的膳食计划以及大致的购物清单',
  inputSchema: {
    type: 'object',
    properties: {
      allergies: {
        type: 'array',
        items: { type: 'string' },
        description: '过敏原列表',
        default: []
      },
      avoidItems: {
        type: 'array',
        items: { type: 'string' },
        description: '忌口食材列表',
        default: []
      },
      peopleCount: {
        type: 'number',
        minimum: 1,
        maximum: 10,
        description: '用餐人数'
      }
    },
    required: ['peopleCount']
  }
};

const RecommendMealsSchema = z.object({
  allergies: z.array(z.string()).default([]),
  avoidItems: z.array(z.string()).default([]),
  peopleCount: z.number().min(1).max(10)
});

export async function handleRecommendMeals(
  args: any,
  recipes: Recipe[]
): Promise<string> {
  try {
    const { allergies, avoidItems, peopleCount } = RecommendMealsSchema.parse(args);
    
    // Combine allergies and avoid items for filtering
    const avoidList = [...allergies, ...avoidItems].map(item => item.toLowerCase());
    
    // Filter recipes that don't contain avoided ingredients
    const safeRecipes = recipes.filter(recipe => {
      if (avoidList.length === 0) return true;
      
      return !recipe.ingredients.some(ingredient => 
        avoidList.some(avoid => 
          ingredient.name.toLowerCase().includes(avoid)
        )
      );
    });
    
    if (safeRecipes.length < 10) {
      return JSON.stringify({
        success: false,
        message: '根据您的忌口要求，可用菜谱太少，无法制定完整的膳食计划',
        availableRecipes: safeRecipes.length,
        suggestion: '请减少忌口限制或联系管理员添加更多菜谱'
      }, null, 2);
    }
    
    // Target categories for balanced meal planning
    const targetCategories = ['水产', '早餐', '荤菜', '主食'];
    const categorizedRecipes = new Map<string, Recipe[]>();
    
    // Group recipes by category
    safeRecipes.forEach(recipe => {
      const category = recipe.category;
      if (!categorizedRecipes.has(category)) {
        categorizedRecipes.set(category, []);
      }
      categorizedRecipes.get(category)!.push(recipe);
    });
    
    // Create weekday meal plans (5 days)
    const weekdays: DayPlan[] = [];
    const weekdayNames = ['周一', '周二', '周三', '周四', '周五'];
    
    for (let i = 0; i < 5; i++) {
      const breakfastCount = Math.min(2, Math.max(1, Math.floor(peopleCount / 3)));
      const lunchCount = Math.max(2, Math.floor((peopleCount + 1) / 2));
      const dinnerCount = Math.max(2, Math.floor((peopleCount + 1) / 2));
      
      const breakfast = getRandomMeals(categorizedRecipes, ['早餐'], breakfastCount, safeRecipes);
      const lunch = getRandomMeals(categorizedRecipes, ['荤菜', '主食', '水产'], lunchCount, safeRecipes);
      const dinner = getRandomMeals(categorizedRecipes, ['荤菜', '主食', '水产'], dinnerCount, safeRecipes);
      
      weekdays.push({
        day: weekdayNames[i],
        breakfast,
        lunch,
        dinner
      });
    }
    
    // Create weekend meal plans (2 days)
    const weekend: DayPlan[] = [];
    const weekendNames = ['周六', '周日'];
    
    for (let i = 0; i < 2; i++) {
      const breakfastCount = Math.min(3, Math.max(2, Math.floor(peopleCount / 2)));
      const lunchCount = Math.max(3, Math.floor((peopleCount + 2) / 2));
      const dinnerCount = Math.max(3, Math.floor((peopleCount + 2) / 2));
      
      const breakfast = getRandomMeals(categorizedRecipes, ['早餐'], breakfastCount, safeRecipes);
      const lunch = getRandomMeals(categorizedRecipes, ['荤菜', '主食', '水产'], lunchCount, safeRecipes);
      const dinner = getRandomMeals(categorizedRecipes, ['荤菜', '主食', '水产'], dinnerCount, safeRecipes);
      
      weekend.push({
        day: weekendNames[i],
        breakfast,
        lunch,
        dinner
      });
    }
    
    // Generate grocery list
    const allSelectedRecipes: Recipe[] = [];
    [...weekdays, ...weekend].forEach(day => {
      [...day.breakfast, ...day.lunch, ...day.dinner].forEach(recipeName => {
        const recipe = safeRecipes.find(r => r.name === recipeName);
        if (recipe) allSelectedRecipes.push(recipe);
      });
    });
    
    const ingredients = processRecipeIngredients(allSelectedRecipes);
    const shoppingPlan = categorizeIngredients(ingredients);
    
    const groceryList: GroceryList = {
      ingredients,
      shoppingPlan
    };
    
    const mealPlan: MealPlan = {
      weekdays,
      weekend,
      groceryList
    };
    
    return JSON.stringify({
      success: true,
      peopleCount,
      allergies,
      avoidItems,
      mealPlan,
      stats: {
        totalRecipesUsed: allSelectedRecipes.length,
        uniqueRecipesUsed: new Set(allSelectedRecipes.map(r => r.name)).size,
        totalIngredients: ingredients.length
      },
      message: `成功为 ${peopleCount} 人制定了一周膳食计划，包含 ${allSelectedRecipes.length} 道菜和购物清单`
    }, null, 2);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return JSON.stringify({
        success: false,
        error: '参数验证失败',
        details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      }, null, 2);
    }
    
    return JSON.stringify({
      success: false,
      error: '生成膳食计划时发生错误',
      details: error instanceof Error ? error.message : String(error)
    }, null, 2);
  }
}

function getRandomMeals(
  categorizedRecipes: Map<string, Recipe[]>,
  preferredCategories: string[],
  count: number,
  fallbackRecipes: Recipe[]
): string[] {
  const meals: string[] = [];
  const usedRecipes = new Set<string>();
  
  // Try to get meals from preferred categories first
  for (const category of preferredCategories) {
    const categoryRecipes = categorizedRecipes.get(category) || [];
    const availableRecipes = categoryRecipes.filter(r => !usedRecipes.has(r.name));
    
    if (availableRecipes.length > 0 && meals.length < count) {
      const needed = Math.min(count - meals.length, Math.ceil(count / preferredCategories.length));
      const selected = getRandomItems(availableRecipes, needed);
      
      selected.forEach(recipe => {
        meals.push(recipe.name);
        usedRecipes.add(recipe.name);
      });
    }
  }
  
  // Fill remaining slots with any available recipes
  if (meals.length < count) {
    const remainingRecipes = fallbackRecipes.filter(r => !usedRecipes.has(r.name));
    const needed = count - meals.length;
    const selected = getRandomItems(remainingRecipes, needed);
    
    selected.forEach(recipe => {
      meals.push(recipe.name);
      usedRecipes.add(recipe.name);
    });
  }
  
  return meals;
}