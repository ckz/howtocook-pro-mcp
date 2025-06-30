# HowToCook MCP Server

A Model Context Protocol (MCP) server that provides intelligent recipe recommendations, meal planning, and grocery list generation for cooking enthusiasts.

## Features

### 🍳 Five Core Tools

1. **Get All Recipes** (`mcp_howtocook_getAllRecipes`)
   - Retrieve complete recipe database overview
   - Returns recipe names and descriptions
   - ⚠️ Warning: Large dataset, use with caution

2. **Get Recipes by Category** (`mcp_howtocook_getRecipesByCategory`)
   - Filter recipes by specific categories
   - Supports seafood, breakfast, meat dishes, staples, and more
   - Returns simplified recipe information with ingredient lists

3. **Get Recipe Details** (`mcp_howtocook_getRecipeById`)
   - Query complete recipe details by name
   - Includes detailed ingredient lists and cooking steps
   - Supports fuzzy matching and intelligent suggestions

4. **Smart Meal Planning** (`mcp_howtocook_recommendMeals`)
   - Intelligent recommendations based on group size, allergies, and dietary restrictions
   - Generates complete weekly meal plans
   - Automatically creates categorized grocery lists
   - Differentiated planning for weekdays and weekends

5. **Quick Dish Recommendations** (`mcp_howtocook_whatToEat`)
   - Solve the "what to eat" dilemma instantly
   - Smart dish combinations based on group size
   - Automatically balances nutrition and flavors

### 🎯 Smart Features

- **Allergy Detection**: Automatically filters recipes containing allergens
- **Nutritional Balance**: Intelligently combines meat and vegetable dishes
- **Group Size Adaptation**: Adjusts dish quantity and combinations based on diners
- **Shopping Optimization**: Generates categorized shopping lists for efficient grocery runs
- **Diverse Recommendations**: Uses Fisher-Yates shuffle algorithm for variety

## Installation

### Method 1: Global NPM Installation (Recommended)

```bash
npm install -g howtocook-mcp
```

### Method 2: Local Build

```bash
git clone <repository-url>
cd howtocook-mcp
npm install
npm run build
```

## Configuration

### Cursor IDE Configuration

Add MCP server configuration in Cursor settings:

```json
{
  "mcpServers": {
    "howtocook": {
      "command": "npx",
      "args": ["howtocook-mcp"]
    }
  }
}
```

### Other MCP Client Configuration

```json
{
  "mcpServers": {
    "howtocook": {
      "command": "node",
      "args": ["/path/to/howtocook-mcp/build/index.js"]
    }
  }
}
```

## Usage Examples

### Basic Queries

```
# View all recipe categories
Show me all available recipe categories

# Find seafood recipes
Find some seafood recipes for me

# Query specific recipe instructions
Tell me how to make braised pork belly
```

### Smart Recommendations

```
# Quick recommendations
We have 4 people for dinner, not sure what to cook, please recommend

# Meal planning
Create a weekly meal plan for our family of 3, I'm allergic to seafood

# Dietary restrictions
Recommend dishes for 6 people, no beef or lamb
```

### Advanced Features

```
# Detailed meal planning
Create a weekly meal plan for 8 people, avoid peanuts and seafood, generate shopping list

# Party planning
We're hosting a 10-person dinner party, please recommend suitable dish combinations
```

## Data Source

Recipe data sourced from the [HowToCook](https://github.com/Anduin2017/HowToCook) project, featuring rich Chinese recipes with detailed cooking instructions.

## Technical Architecture

- **Language**: TypeScript
- **Framework**: Model Context Protocol SDK
- **Validation**: Zod
- **Communication**: Stdio Transport
- **Data Fetching**: RESTful API

## Development Commands

```bash
# Install dependencies
npm install

# Build project
npm run build

# Start server
npm start

# Development mode
npm run dev

# Publish package
npm run publish
```

## Contributing

Issues and Pull Requests are welcome to improve this project!

## License

MIT License

## Changelog

### v0.1.1
- Initial release
- Implemented five core tools
- Support for intelligent meal planning and grocery lists
- Comprehensive error handling and parameter validation

---

**Enjoy the art of cooking with AI as your kitchen assistant!** 🍽️✨