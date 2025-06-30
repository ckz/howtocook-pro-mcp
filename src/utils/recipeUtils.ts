import { Recipe, SimpleRecipe, Ingredient } from '../types/index.js';

export function simplifyRecipe(recipe: Recipe): SimpleRecipe {
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    ingredients: recipe.ingredients.map(ing => ing.name)
  };
}

export function processRecipeIngredients(recipes: Recipe[]): string[] {
  const ingredientMap = new Map<string, number>();
  
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      ingredientMap.set(name, (ingredientMap.get(name) || 0) + 1);
    });
  });
  
  return Array.from(ingredientMap.keys());
}

export function categorizeIngredients(ingredients: string[]): {
  fresh: string[];
  pantry: string[];
  spices: string[];
  others: string[];
} {
  const fresh: string[] = [];
  const pantry: string[] = [];
  const spices: string[] = [];
  const others: string[] = [];
  
  const freshKeywords = ['肉', '鱼', '虾', '蟹', '菜', '葱', '蒜', '姜', '豆腐', '蛋', '奶', '菇', '笋', '瓜', '茄', '椒', '萝卜', '白菜', '菠菜', '韭菜', '芹菜', '土豆', '番茄', '黄瓜', '冬瓜', '南瓜', '丝瓜', '苦瓜', '青椒', '红椒', '洋葱', '胡萝卜', '莲藕', '山药', '芋头', '红薯', '玉米', '豌豆', '四季豆', '茄子', '西兰花', '花菜', '包菜', '大白菜', '小白菜', '油菜', '生菜', '空心菜', '苋菜', '木耳', '银耳', '香菇', '金针菇', '杏鲍菇', '平菇', '茶树菇', '海带', '紫菜', '豆芽', '韭黄', '蒜苗', '蒜薹', '芦笋', '竹笋', '莴笋', '冬笋', '春笋'];
  const spiceKeywords = ['盐', '糖', '醋', '酱油', '料酒', '胡椒', '花椒', '八角', '桂皮', '香叶', '丁香', '草果', '白胡椒', '黑胡椒', '孜然', '五香粉', '十三香', '鸡精', '味精', '蚝油', '生抽', '老抽', '香醋', '米醋', '白醋', '料酒', '黄酒', '白酒', '啤酒', '红酒', '香油', '芝麻油', '辣椒油', '花椒油', '蒜蓉辣椒酱', '豆瓣酱', '甜面酱', '黄豆酱', '海鲜酱', '沙茶酱', '番茄酱', '辣椒酱', '韩式辣椒酱', '咖喱粉', '咖喱块', '芥末', '山葵', '柠檬汁', '青柠汁', '蜂蜜', '冰糖', '红糖', '白糖', '砂糖', '糖浆', '枫糖浆'];
  const pantryKeywords = ['米', '面', '粉', '油', '豆', '干', '罐头', '酱', '醋', '糖', '盐', '淀粉', '面粉', '玉米淀粉', '土豆淀粉', '红薯淀粉', '绿豆淀粉', '小麦粉', '高筋面粉', '低筋面粉', '中筋面粉', '自发粉', '泡打粉', '酵母', '小苏打', '塔塔粉', '吉利丁', '琼脂', '明膠', '椰浆', '椰奶', '淡奶油', '黄油', '奶油', '芝士', '奶酪', '酸奶', '牛奶', '豆浆', '杏仁奶', '燕麦奶', '大米', '小米', '黑米', '糯米', '薏米', '红豆', '绿豆', '黑豆', '黄豆', '白芸豆', '红芸豆', '蚕豆', '豌豆', '扁豆', '花生', '核桃', '杏仁', '腰果', '开心果', '松子', '瓜子', '芝麻', '黑芝麻', '白芝麻', '花生油', '菜籽油', '玉米油', '大豆油', '葵花籽油', '橄榄油', '芝麻油', '花椒油', '辣椒油', '香油', '猪油', '牛油', '鸡油', '鸭油'];
  
  ingredients.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    
    if (freshKeywords.some(keyword => lowerIngredient.includes(keyword))) {
      fresh.push(ingredient);
    } else if (spiceKeywords.some(keyword => lowerIngredient.includes(keyword))) {
      spices.push(ingredient);
    } else if (pantryKeywords.some(keyword => lowerIngredient.includes(keyword))) {
      pantry.push(ingredient);
    } else {
      others.push(ingredient);
    }
  });
  
  return { fresh, pantry, spices, others };
}

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, array.length));
}