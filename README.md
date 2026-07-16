<p align="center">
  <img src="logo.svg" alt="Orion Logo" width="120" />
</p>

<h1 align="center">Orion TUI</h1>

<p align="center">
  <strong>Multi-Agent TUI - Intelligent Orchestration of AI Agents</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Overview

Orion TUI is a multi-agent orchestration system that acts as a virtual Tech Lead, coordinating specialized AI agents to collaborate on software projects. It provides an interactive **TUI** (Terminal User Interface) for seamless interaction.

## Features

- **Interactive TUI** - Beautiful terminal interface with Ink/React
- **Multi-Agent Orchestration** - Parallel execution of specialized agents
- **DDD Architecture** - Clean, maintainable codebase
- **REST API Backend** - Fastify-based backend with JWT authentication
- **Persistent Login** - Tokens persist on device until logout
- **Multiple LLM Providers** - OpenAI, Anthropic, Ollama support
- **Docker Support** - Containerized deployment ready

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0
- PostgreSQL (for production)

### From Source

```bash
# Clone the repository
git clone https://github.com/vinnytherobot/orion-tui.git
cd orion-tui

# Install dependencies
npm install

# Build all packages
npm run build

# Start development servers
npm run dev
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ORION_API_URL` - Backend API URL (default: http://localhost:3000)

## Quick Start

### Interactive Mode

```bash
# Start the TUI
npm run dev:frontend

# Start the backend
npm run dev:backend
```

### Available Commands

| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/register <name> <email> <password>` | Register a new user |
| `/login <email> <password>` | Login to the API |
| `/logout` | Logout and remove saved credentials |
| `/me` | Show current user info |
| `/status` | Show API status and active agents |
| `/agents [role]` | List all available agents |
| `/init <projectId>` | Initialize agents for a project |
| `/projects` | List all projects |
| `/create-project <name> <path>` | Create a new project |
| `/delete-project <id>` | Delete a project |
| `/project <id>` | Show project details |
| `/tasks [status]` | List active tasks |
| `/create-task <projectId> <title>` | Create a new task |
| `/delete-task <taskId>` | Delete a task |
| `/task-stats <projectId>` | Show task statistics |
| `/assign <agentId> <taskId>` | Assign a task to an agent |
| `/complete <agentId> [result]` | Mark task as completed |
| `/reset-agent <agentId>` | Reset agent to idle state |
| `/api-keys [list\|create\|delete]` | Manage API keys |
| `/config [key] [value]` | Show or update configuration |
| `/version` | Show Orion version |
| `/clear` | Clear screen |
| `/exit` | Exit TUI |

## Architecture

### Monorepo Structure

```
orion-tui/
├── apps/
│   ├── backend/          # Fastify API server
│   └── frontend/         # TUI interface (Ink/React)
├── packages/
│   ├── shared/           # Shared utilities
│   ├── domain/           # Domain entities (DDD)
│   ├── application/      # Use cases
│   └── infrastructure/   # Database, providers, cache
└── docs/                 # Documentation
```

### DDD Layers

```
┌─────────────────────────────────────┐
│           Presentation (TUI)        │
├─────────────────────────────────────┤
│         Application Layer           │
│         (Use Cases, DTOs)           │
├─────────────────────────────────────┤
│           Domain Layer              │
│    (Entities, Value Objects)        │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│   (Database, Providers, Cache)      │
└─────────────────────────────────────┘
```

### Agent Types

| Agent | Responsibility |
|-------|----------------|
| Planner | Task planning and decomposition |
| Architect | Architecture decisions |
| Backend | Business logic implementation |
| Database | Data persistence |
| Frontend | UI implementation |
| Documentation | Docs generation |
| QA | Test creation |
| Reviewer | Code review |
| DevOps | Infrastructure |
| Security | Security analysis |
| Performance | Optimization |
| Git | Version control |

## Development

### Setup

```bash
# Clone and install
git clone https://github.com/vinnytherobot/orion-tui.git
cd orion-tui
npm install

# Build
npm run build

# Development mode
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build all packages |
| `npm run dev` | Watch mode for all packages |
| `npm run dev:frontend` | Watch frontend only |
| `npm run dev:backend` | Watch backend only |
| `npm run lint` | Run Biome linter |
| `npm run lint:fix` | Fix lint issues |
| `npm run format` | Format code with Biome |
| `npm run check` | Run Biome check (lint + format) |
| `npm run check:fix` | Fix all Biome issues |
| `npm run typecheck` | Type checking |
| `npm run clean` | Clean artifacts |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate database migrations |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |

### Database

The project uses PostgreSQL with Drizzle ORM:

```bash
# Run migrations
npm run db:migrate

# Generate new migration
npm run db:generate
```

## Docker

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# Rebuild and start
npm run docker:build
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation
- Share feedback

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ink](https://github.com/vadimdemedes/ink) - React for TUI
- [Fastify](https://www.fastify.io/) - Backend framework
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Turborepo](https://turbo.build/) - Monorepo tooling
- [Biome](https://biomejs.dev/) - Linter and formatter

---

<p align="center">
  Made with ❤️ by vinnytherobot and the ORION Community
</p>
