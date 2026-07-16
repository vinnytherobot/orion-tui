# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Backend API with Fastify (auth, projects, tasks, agents endpoints)
- JWT authentication with persistent login
- PostgreSQL database with Drizzle ORM
- Docker and docker-compose configuration
- Biome linter and formatter (replaced ESLint + Prettier)
- Login persistence on device (tokens stored in ~/.orion/auth.json)
- API key management
- Agent initialization and management
- Task assignment and completion tracking

### Changed
- Migrated from ESLint + Prettier to Biome
- Refresh tokens now have 100-year lifetime (no expiration)

### Packages
- `@orion/shared` - Shared utilities (Result, AppError, Logger, Config)
- `@orion/domain` - Domain entities (Agent, Task, Project, Value Objects)
- `@orion/application` - Use cases (AnalyzeProject, Plan, Implement)
- `@orion/infrastructure` - Implementations (Database, Providers, Cache)
- `@orion/backend` - Fastify API server
- `@orion/frontend` - TUI interface with Ink/React

## [0.1.0] - 2026-07-15

### Added
- Initial project setup
- Multi-agent TUI architecture
- DDD (Domain-Driven Design) structure
- Interactive TUI with Ink/React
- Welcome screen with ASCII art
- Command palette with autocomplete
- Agent and task status panels
- Message history display
- Status bar with model info
- Slash commands (/help, /status, /agents, /tasks, /projects, etc.)
- Monorepo with npm workspaces + Turborepo
- TypeScript strict mode with ESM
