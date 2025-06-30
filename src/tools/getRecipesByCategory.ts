import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { Recipe, SimpleRecipe } from '../types/index.js';
import { simplifyRecipe } from '../utils/recipeUtils.js';

export const getRecipesByCategoryTool: Tool = {
  name: 'getRecipesByCategory',
  description: '按照分类筛选菜谱，想吃水产？早餐？荤菜？主食？一键搞定！',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: '菜谱分类'
      }
    },
    required: ['category']
  }
};

const GetRecipesByCategorySchema = z.object({
  category: z.string().min(1, '分类不能为空')
});

export async function handleGetRecipesByCategory(
  args: any,
  recipes: Recipe[]
): Promise<string> {
  try {
    const { category } = GetRecipesByCategorySchema.parse(args);
    
    const filteredRecipes = recipes.filter(recipe => 
      recipe.category === category
    );
    
    if (filteredRecipes.length === 0) {
      const availableCategories = [...new Set(recipes.map(r => r.category))].sort();
      return JSON.stringify({
        success: false,
        message: `未找到分类为 "${category}" 的菜谱`,
        availableCategories,
        suggestion: '请检查分类名称是否正确，或从可用分类中选择'
      }, null, 2);
    }
    
    const simpleRecipes: SimpleRecipe[] = filteredRecipes.map(simplifyRecipe);
    
    return JSON.stringify({
      success: true,
      category,
      count: simpleRecipes.length,
      recipes: simpleRecipes,
      message: `找到 ${simpleRecipes.length} 个 "${category}" 分类的菜谱`
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
      error: '获取分类菜谱时发生错误',
      details: error instanceof Error ? error.message : String(error)
    }, null, 2);
  }
}