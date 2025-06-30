import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { Recipe, DishRecommendation } from '../types/index.js';
import { getRandomItems, shuffleArray } from '../utils/recipeUtils.js';

export const whatToEatTool: Tool = {
  name: 'whatToEat',
  description: '不知道吃什么？根据人数直接推荐适合的菜品组合',
  inputSchema: {
    type: 'object',
    properties: {
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

const WhatToEatSchema = z.object({
  peopleCount: z.number().min(1).max(10)
});

export async function handleWhatToEat(
  args: any,
  recipes: Recipe[]
): Promise<string> {
  try {
    const { peopleCount } = WhatToEatSchema.parse(args);
    
    // Calculate dish counts based on people count
    const vegetableCount = Math.floor((peopleCount + 1) / 2);
    const meatCount = Math.ceil((peopleCount + 1) / 2);
    const fishCount = peopleCount >= 8 ? 1 : 0;
    
    // Meat types for variety
    const meatTypes = ['猪肉', '鸡肉', '牛肉', '羊肉', '鸭肉', '鱼肉'];
    const shuffledMeatTypes = shuffleArray(meatTypes);
    
    const dishes: string[] = [];
    const usedRecipes = new Set<string>();
    
    // Select meat dishes
    let meatDishesAdded = 0;
    for (const meatType of shuffledMeatTypes) {
      if (meatDishesAdded >= meatCount) break;
      
      const meatRecipes = recipes.filter(recipe => 
        recipe.ingredients.some(ingredient => 
          ingredient.name.includes(meatType)
        ) && !usedRecipes.has(recipe.name)
      );
      
      if (meatRecipes.length > 0) {
        const selectedMeat = getRandomItems(meatRecipes, 1)[0];
        dishes.push(selectedMeat.name);
        usedRecipes.add(selectedMeat.name);
        meatDishesAdded++;
      }
    }
    
    // If we still need more meat dishes, get any meat dishes
    if (meatDishesAdded < meatCount) {
      const remainingMeatRecipes = recipes.filter(recipe => 
        (recipe.category === '荤菜' || 
         recipe.ingredients.some(ingredient => 
           meatTypes.some(meat => ingredient.name.includes(meat))
         )) && !usedRecipes.has(recipe.name)
      );
      
      const needed = meatCount - meatDishesAdded;
      const selectedMeat = getRandomItems(remainingMeatRecipes, needed);
      selectedMeat.forEach(recipe => {
        dishes.push(recipe.name);
        usedRecipes.add(recipe.name);
      });
    }
    
    // Select fish dish for large groups
    if (fishCount > 0) {
      const fishRecipes = recipes.filter(recipe => 
        (recipe.category === '水产' || 
         recipe.ingredients.some(ingredient => 
           ingredient.name.includes('鱼') || 
           ingredient.name.includes('虾') || 
           ingredient.name.includes('蟹') || 
           ingredient.name.includes('贝')
         )) && !usedRecipes.has(recipe.name)
      );
      
      if (fishRecipes.length > 0) {
        const selectedFish = getRandomItems(fishRecipes, fishCount);
        selectedFish.forEach(recipe => {
          dishes.push(recipe.name);
          usedRecipes.add(recipe.name);
        });
      }
    }
    
    // Select vegetable dishes
    const vegetableRecipes = recipes.filter(recipe => 
      !usedRecipes.has(recipe.name) && 
      (recipe.category === '素菜' || 
       recipe.ingredients.some(ingredient => 
         isVegetableIngredient(ingredient.name)
       ))
    );
    
    const selectedVegetables = getRandomItems(vegetableRecipes, vegetableCount);
    selectedVegetables.forEach(recipe => {
      dishes.push(recipe.name);
      usedRecipes.add(recipe.name);
    });
    
    // If we don't have enough dishes, fill with any remaining recipes
    if (dishes.length < (meatCount + vegetableCount + fishCount)) {
      const remainingRecipes = recipes.filter(recipe => !usedRecipes.has(recipe.name));
      const needed = (meatCount + vegetableCount + fishCount) - dishes.length;
      const additional = getRandomItems(remainingRecipes, needed);
      additional.forEach(recipe => {
        dishes.push(recipe.name);
      });
    }
    
    const recommendation: DishRecommendation = {
      peopleCount,
      vegetableDishCount: vegetableCount,
      meatDishCount: meatCount,
      fishDishCount: fishCount > 0 ? fishCount : undefined,
      dishes,
      message: generateRecommendationMessage(peopleCount, dishes.length)
    };
    
    return JSON.stringify({
      success: true,
      recommendation,
      message: `为 ${peopleCount} 人推荐了 ${dishes.length} 道菜`
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
      error: '推荐菜品时发生错误',
      details: error instanceof Error ? error.message : String(error)
    }, null, 2);
  }
}

function isVegetableIngredient(ingredientName: string): boolean {
  const vegetableKeywords = [
    '菜', '菇', '瓜', '茄', '椒', '萝卜', '白菜', '菠菜', '韭菜', '芹菜', 
    '土豆', '番茄', '黄瓜', '冬瓜', '南瓜', '丝瓜', '苦瓜', '青椒', '红椒', 
    '洋葱', '胡萝卜', '莲藕', '山药', '芋头', '红薯', '玉米', '豌豆', 
    '四季豆', '西兰花', '花菜', '包菜', '大白菜', '小白菜', '油菜', 
    '生菜', '空心菜', '苋菜', '木耳', '银耳', '香菇', '金针菇', 
    '杏鲍菇', '平菇', '茶树菇', '海带', '紫菜', '豆芽', '韭黄', 
    '蒜苗', '蒜薹', '芦笋', '竹笋', '莴笋', '冬笋', '春笋', '豆腐'
  ];
  
  return vegetableKeywords.some(keyword => ingredientName.includes(keyword));
}

function generateRecommendationMessage(peopleCount: number, dishCount: number): string {
  const messages = [
    `${peopleCount}人聚餐，${dishCount}道菜刚刚好！荤素搭配，营养均衡`,
    `为${peopleCount}位朋友精心搭配了${dishCount}道美味佳肴`,
    `${dishCount}道菜品组合，满足${peopleCount}人的味蕾需求`,
    `贴心为${peopleCount}人准备的${dishCount}道菜，有荤有素有营养`,
    `${peopleCount}人用餐，${dishCount}道菜的完美搭配方案`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}