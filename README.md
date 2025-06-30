# HowToCook Pro MCP

A Model Context Protocol (MCP) server that provides cooking recipes, culinary techniques, and kitchen assistance.

## Overview

HowToCook Pro MCP is an MCP server designed to help with cooking and culinary tasks. It provides tools and resources for:

- Recipe lookup and management
- Cooking technique guidance
- Ingredient substitutions
- Meal planning assistance
- Kitchen tips and tricks

## Installation

```bash
npm install
npm run build
```

## Usage

### As an MCP Server

Add this to your MCP client configuration:

```json
{
  "mcpServers": {
    "howtocook-pro-mcp": {
      "command": "node",
      "args": ["path/to/howtocook-pro-mcp/dist/index.js"]
    }
  }
}
```

### Development

```bash
npm run dev
```

## Features

- **Recipe Database**: Access to a comprehensive recipe database
- **Cooking Tools**: Various cooking calculation and conversion tools
- **Ingredient Management**: Ingredient substitution and availability checking
- **Meal Planning**: Tools for planning meals and managing shopping lists

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

This project is hosted at: https://github.com/ckz/howtocook-pro-mcp