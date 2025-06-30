#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { fetchRecipes } from './data/recipes.js';
import { Recipe } from './types/index.js';

// Import all tools
import { getAllRecipesTool, handleGetAllRecipes } from './tools/getAllRecipes.js';
import { getRecipesByCategoryTool, handleGetRecipesByCategory } from './tools/getRecipesByCategory.js';
import { getRecipeByIdTool, handleGetRecipeById } from './tools/getRecipeById.js';
import { recommendMealsTool, handleRecommendMeals } from './tools/recommendMeals.js';
import { whatToEatTool, handleWhatToEat } from './tools/whatToEat.js';

class HowToCookMcpServer {
  private server: Server;
  private recipes: Recipe[] = [];

  constructor() {
    this.server = new Server(
      {
        name: 'howtocook-mcp',
        version: '0.1.1',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          getAllRecipesTool,
          getRecipesByCategoryTool,
          getRecipeByIdTool,
          recommendMealsTool,
          whatToEatTool,
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'getAllRecipes':
            return {
              content: [
                {
                  type: 'text',
                  text: await handleGetAllRecipes(this.recipes),
                },
              ],
            };

          case 'getRecipesByCategory':
            return {
              content: [
                {
                  type: 'text',
                  text: await handleGetRecipesByCategory(args, this.recipes),
                },
              ],
            };

          case 'getRecipeById':
            return {
              content: [
                {
                  type: 'text',
                  text: await handleGetRecipeById(args, this.recipes),
                },
              ],
            };

          case 'recommendMeals':
            return {
              content: [
                {
                  type: 'text',
                  text: await handleRecommendMeals(args, this.recipes),
                },
              ],
            };

          case 'whatToEat':
            return {
              content: [
                {
                  type: 'text',
                  text: await handleWhatToEat(args, this.recipes),
                },
              ],
            };

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${errorMessage}`
        );
      }
    });
  }

  async initialize(): Promise<void> {
    console.log('正在初始化 HowToCook MCP 服务器...');
    
    try {
      this.recipes = await fetchRecipes();
      
      if (this.recipes.length === 0) {
        console.error('错误: 未能加载任何菜谱数据');
        process.exit(1);
      }
      
      console.log(`成功加载 ${this.recipes.length} 个菜谱`);
      
      // Log available categories for debugging
      const categories = [...new Set(this.recipes.map(r => r.category))].sort();
      console.log(`可用分类: ${categories.join(', ')}`);
      
    } catch (error) {
      console.error('初始化失败:', error);
      process.exit(1);
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('HowToCook MCP 服务器已启动并准备接收请求');
  }
}

async function main(): Promise<void> {
  const server = new HowToCookMcpServer();
  await server.initialize();
  await server.run();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}