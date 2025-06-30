import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { Recipe, NameOnlyRecipe } from '../types/index.js';

export const getAllRecipesTool: Tool = {
  name: 'getAllRecipes',
  description: '获取所有可用菜谱数据，做菜百科全书 -- 慎用这个--上下文太大',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  }
};

export async function handleGetAllRecipes(recipes: Recipe[]): Promise<string> {
  try {
    const nameOnlyRecipes: NameOnlyRecipe[] = recipes.map(recipe => ({
      name: recipe.name,
      description: recipe.description
    }));
    
    return JSON.stringify({
      success: true,
      count: nameOnlyRecipes.length,
      recipes: nameOnlyRecipes,
      message: `成功获取 ${nameOnlyRecipes.length} 个菜谱的基本信息`
    }, null, 2);
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: '获取菜谱列表时发生错误',
      details: error instanceof Error ? error.message : String(error)
    }, null, 2);
  }
}