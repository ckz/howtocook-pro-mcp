import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { Recipe } from '../types/index.js';

export const getRecipeByIdTool: Tool = {
  name: 'mcp_howtocook_getRecipeById',
  description: '根据菜谱名称查询特定菜谱的完整详情，包括食材、步骤等',
  inputSchema: {
    type: 'object',
    properties: {
      recipeName: {
        type: 'string',
        description: '菜谱名称'
      }
    },
    required: ['recipeName']
  }
};

const GetRecipeByIdSchema = z.object({
  recipeName: z.string().min(1, '菜谱名称不能为空')
});

export async function handleGetRecipeById(
  args: any,
  recipes: Recipe[]
): Promise<string> {
  try {
    const { recipeName } = GetRecipeByIdSchema.parse(args);
    
    // First try exact match
    let foundRecipe = recipes.find(recipe => 
      recipe.name.toLowerCase() === recipeName.toLowerCase()
    );
    
    // If no exact match, try partial match
    if (!foundRecipe) {
      foundRecipe = recipes.find(recipe => 
        recipe.name.toLowerCase().includes(recipeName.toLowerCase())
      );
    }
    
    if (!foundRecipe) {
      // Find similar recipes for suggestions
      const similarRecipes = recipes
        .filter(recipe => 
          recipe.name.toLowerCase().includes(recipeName.toLowerCase().substring(0, 2)) ||
          recipeName.toLowerCase().includes(recipe.name.toLowerCase().substring(0, 2))
        )
        .slice(0, 5)
        .map(recipe => recipe.name);
      
      return JSON.stringify({
        success: false,
        message: `未找到名称为 "${recipeName}" 的菜谱`,
        suggestions: similarRecipes.length > 0 ? similarRecipes : undefined,
        tip: '请检查菜谱名称是否正确，或尝试使用部分关键词搜索'
      }, null, 2);
    }
    
    return JSON.stringify({
      success: true,
      recipe: foundRecipe,
      message: `成功找到菜谱: ${foundRecipe.name}`
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
      error: '查询菜谱详情时发生错误',
      details: error instanceof Error ? error.message : String(error)
    }, null, 2);
  }
}