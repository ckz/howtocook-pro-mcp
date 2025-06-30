# HowToCook Pro MCP

一个基于 Model Context Protocol (MCP) 的做菜百科全书服务器，提供智能菜谱推荐、膳食计划和购物清单功能。

A Model Context Protocol (MCP) server that provides cooking recipes, culinary techniques, and kitchen assistance.

## 功能特色 / Features

### 🍳 五大核心工具 / Five Core Tools

1. **获取所有菜谱** (`getAllRecipes`)
   - 获取完整的菜谱数据库概览
   - 返回菜谱名称和描述信息
   - ⚠️ 注意：数据量较大，建议谨慎使用

2. **按分类筛选菜谱** (`getRecipesByCategory`)
   - 按照菜谱分类进行精准筛选
   - 支持水产、早餐、荤菜、主食等多种分类
   - 返回简化的菜谱信息和食材列表

3. **查询菜谱详情** (`getRecipeById`)
   - 根据菜谱名称查询完整详情
   - 包含详细的食材清单和制作步骤
   - 支持模糊匹配和智能建议

4. **智能膳食计划** (`recommendMeals`)
   - 根据人数、过敏原、忌口食材智能推荐
   - 生成完整的一周膳食计划
   - 自动生成购物清单和分类整理
   - 工作日和周末差异化安排

5. **快速菜品推荐** (`whatToEat`)
   - 不知道吃什么？一键解决选择困难
   - 根据用餐人数智能搭配荤素菜品
   - 自动平衡营养和口味

### 🎯 智能特性 / Smart Features

- **过敏原识别**：自动过滤含有过敏原的菜谱
- **营养均衡**：智能搭配荤素菜品，确保营养平衡
- **人数适配**：根据用餐人数调整菜品数量和搭配
- **购物优化**：自动生成分类购物清单，提高采购效率
- **随机推荐**：使用 Fisher-Yates 洗牌算法确保推荐多样性

## 安装方式 / Installation

### 方式一：NPM 全局安装（推荐） / Method 1: NPM Global Install (Recommended)

```bash
npm install -g howtocook-pro-mcp
```

### 方式二：本地构建 / Method 2: Local Build

```bash
git clone https://github.com/ckz/howtocook-pro-mcp.git
cd howtocook-pro-mcp
npm install
npm run build
```

## 配置说明 / Configuration

### Cursor IDE 配置

在 Cursor 的设置中添加 MCP 服务器配置：

```json
{
  "mcpServers": {
    "howtocook-pro-mcp": {
      "command": "npx",
      "args": ["howtocook-pro-mcp"]
    }
  }
}
```

### 其他 MCP 客户端配置 / Other MCP Client Configuration

```json
{
  "mcpServers": {
    "howtocook-pro-mcp": {
      "command": "node",
      "args": ["/path/to/howtocook-pro-mcp/build/index.js"]
    }
  }
}
```

## 使用示例 / Usage Examples

### 基础查询 / Basic Queries

```
# 查看所有菜谱分类
请帮我查看有哪些菜谱分类

# 查找水产类菜谱
请帮我找一些水产类的菜谱

# 查询具体菜谱做法
请告诉我红烧肉的详细做法
```

### 智能推荐 / Smart Recommendations

```
# 快速推荐
我们4个人吃饭，不知道做什么菜，请推荐一下

# 膳食计划
请为我们一家3口制定一周的膳食计划，我对海鲜过敏

# 忌口推荐
请推荐适合6个人的菜谱，不要有牛肉和羊肉
```

### 高级功能 / Advanced Features

```
# 详细膳食计划
请为8个人制定一周膳食计划，避免花生和海鲜，生成购物清单

# 聚餐推荐
我们要办10人聚餐，请推荐合适的菜品搭配
```

## 数据来源 / Data Source

菜谱数据来源于 [HowToCook](https://github.com/Anduin2017/HowToCook) 项目，包含丰富的中式菜谱和详细的制作步骤。

Recipe data is sourced from the [HowToCook](https://github.com/Anduin2017/HowToCook) project, containing rich Chinese recipes and detailed cooking instructions.

## 技术架构 / Technical Architecture

- **语言 / Language**: TypeScript
- **框架 / Framework**: Model Context Protocol SDK
- **数据验证 / Data Validation**: Zod
- **通信方式 / Communication**: Stdio Transport
- **数据获取 / Data Fetching**: RESTful API

## 开发命令 / Development Commands

```bash
# 安装依赖 / Install dependencies
npm install

# 构建项目 / Build project
npm run build

# 启动服务器 / Start server
npm start

# 开发模式 / Development mode
npm run dev

# 发布包 / Publish package
npm run publish
```

## 贡献指南 / Contributing

欢迎提交 Issue 和 Pull Request 来改进这个项目！

Contributions are welcome! Please feel free to submit Issues and Pull Requests to improve this project.

## 许可证 / License

MIT License - see [LICENSE](LICENSE) file for details.

## Repository

This project is hosted at: https://github.com/ckz/howtocook-pro-mcp

## 更新日志 / Changelog

### v0.1.9
- 移除工具名称前缀 mcp_howtocook_
- 简化工具名称，提升用户体验
- 重新构建和发布到 NPM

### v0.1.4
- 项目重命名为 howtocook-pro-mcp
- 完善项目文档和配置
- 统一命名规范

### v0.1.1
- 初始版本发布
- 实现五大核心工具
- 支持智能膳食计划和购物清单
- 完善错误处理和参数验证

---

**享受烹饪的乐趣，让 AI 成为你的厨房助手！** 🍽️✨

**Enjoy the joy of cooking, let AI be your kitchen assistant!** 🍽️✨
