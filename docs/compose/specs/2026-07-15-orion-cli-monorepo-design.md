# Orion CLI - Design Specification

## [S1] Problem

Construir uma CLI multi-agente que atua como Tech Lead virtual, orquestrando agentes especializados para desenvolvimento de software. A CLI deve ser modular, extensível e seguir princípios de DDD e Clean Architecture.

## [S2] Solution Overview

Monorepo com separação clara entre aplicações (`apps/`) e packages compartilhados (`packages/`). Cada camada DDD é um package independente com dependências unidirecionais.

## [S3] Architecture

### Estrutura de Pastas

```
orion-cli/
├── apps/
│   ├── backend/                  # CLI principal + API server
│   │   ├── src/
│   │   │   ├── cli.ts           # Entry point CLI
│   │   │   ├── server.ts        # Entry point API
│   │   │   └── commands/        # Comandos Commander.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── frontend/                 # Interface TUI (Ink/React)
│       ├── src/
│       │   ├── App.tsx
│       │   └── components/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── domain/                   # Camada de domínio (pura)
│   │   ├── src/
│   │   │   ├── entities/        # Agent, Task, Project, etc.
│   │   │   ├── value-objects/   # TaskId, AgentStatus, etc.
│   │   │   ├── repositories/    # Interfaces (IAgentRepo, ITaskRepo)
│   │   │   └── events/          # Domain events
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── application/              # Casos de uso
│   │   ├── src/
│   │   │   ├── use-cases/       # ImplementUseCase, ReviewUseCase, etc.
│   │   │   ├── dtos/            # Input/Output DTOs
│   │   │   └── ports/           # Interfaces de entrada
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── infrastructure/           # Implementações concretas
│   │   ├── src/
│   │   │   ├── database/        # Repositórios, ORM, migrations
│   │   │   ├── providers/       # OpenAI, Anthropic, Ollama, etc.
│   │   │   ├── cache/           # Redis, in-memory
│   │   │   ├── queue/           # BullMQ, etc.
│   │   │   └── filesystem/      # State, history, config
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                   # Utilitários compartilhados
│       ├── src/
│       │   ├── errors/          # Custom errors
│       │   ├── types/           # Generic types
│       │   ├── utils/           # Helpers
│       │   └── config/          # Config loader
│       ├── package.json
│       └── tsconfig.json
│
├── package.json                  # Root workspace
├── turbo.json                    # Turborepo pipeline
├── tsconfig.base.json            # TS config base
├── .eslintrc.cjs                 # Lint config
├── .prettierrc                   # Format config
├── PROJECT.md
└── AGENTS.md
```

### Dependências entre Packages

```
shared (zero deps)
    ↑
domain (depende de shared)
    ↑
application (depende de domain + shared)
    ↑
infrastructure (depende de domain + shared)
    ↑
apps (depende de application + infrastructure)
```

### Regras de Dependência

- `domain` NUNCA depende de `application` ou `infrastructure`
- `application` define interfaces; `infrastructure` implementa
- `shared` não depende de nenhum outro package
- `apps` orquestra tudo, mas não expõe lógica de negócio

## [S4] Components

### Domain Layer (`packages/domain`)

**Responsabilidade:** Entidades, Value Objects, interfaces de repositório.

**Dependências:** Apenas `shared`.

**Conteúdo:**
- `entities/Agent.ts` - Entidade agente
- `entities/Task.ts` - Entidade tarefa
- `entities/Project.ts` - Entidade projeto
- `entities/Workflow.ts` - DAG de execução
- `value-objects/TaskId.ts` - ID gerado
- `value-objects/AgentStatus.ts` - Estado do agente
- `value-objects/TaskStatus.ts` - Estado da tarefa
- `repositories/IAgentRepository.ts` - Interface
- `repositories/ITaskRepository.ts` - Interface
- `repositories/IProjectRepository.ts` - Interface
- `events/TaskCompleted.ts` - Domain event

### Application Layer (`packages/application`)

**Responsabilidade:** Casos de uso, orquestração, DTOs.

**Dependências:** `domain`, `shared`.

**Conteúdo:**
- `use-cases/ImplementUseCase.ts` - Orquestrar implementação
- `use-cases/ReviewUseCase.ts` - Orquestrar revisão
- `use-cases/PlanUseCase.ts` - Orquestrar planejamento
- `use-cases/AnalyzeProjectUseCase.ts` - Analisar projeto
- `dtos/TaskDTO.ts` - DTOs de tarefa
- `dtos/AgentDTO.ts` - DTOs de agente
- `ports/IOrchestratorPort.ts` - Interface do orchestrator
- `ports/IAgentExecutorPort.ts` - Interface de execução

### Infrastructure Layer (`packages/infrastructure`)

**Responsabilidade:** Implementações concretas.

**Dependências:** `domain`, `shared`.

**Conteúdo:**
- `database/PrismaAgentRepository.ts`
- `database/PrismaTaskRepository.ts`
- `providers/OpenAIProvider.ts`
- `providers/AnthropicProvider.ts`
- `providers/OllamaProvider.ts`
- `cache/RedisCache.ts`
- `cache/InMemoryCache.ts`
- `filesystem/StateManager.ts`
- `filesystem/HistoryManager.ts`

### Shared Layer (`packages/shared`)

**Responsabilidade:** Utilitários, tipos, erros.

**Dependências:** Nenhuma.

**Conteúdo:**
- `errors/AppError.ts`
- `errors/ValidationError.ts`
- `types/Result.ts` - Result type (sucesso/erro)
- `utils/logger.ts`
- `config/OrionConfig.ts`
- `config/ConfigLoader.ts`

## [S5] Data Flow

```
User → CLI Command → Application Use Case → Domain Logic → Infrastructure
                              ↓
                        Orchestrator
                              ↓
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
                Agent A   Agent B   Agent C
                    ↓         ↓         ↓
                    └─────────┼─────────┘
                              ↓
                         Reviewer
                              ↓
                         Git Agent
                              ↓
                          PR Created
```

## [S6] Error Handling

- **Domain:** Erros de negócio (TaskAlreadyCompleted, InvalidAgentStatus)
- **Application:** Erros de orquechestration (AgentTimeout, DependencyCycle)
- **Infrastructure:** Erros técnicos (ConnectionFailed, ProviderError)
- **Shared:** Result type para operações que podem falhar

## [S7] Testing Strategy

- **Domain:** Unit tests (100% coverage)
- **Application:** Unit tests com mocks
- **Infrastructure:** Integration tests
- **Apps:** E2E tests

## [S8] Tech Stack

| Camada | Tecnologia |
|--------|------------|
| Language | TypeScript 5.4+ |
| Runtime | Node.js 18+ |
| Module System | ESM |
| Monorepo | npm workspaces + Turborepo |
| CLI Framework | Commander.js |
| TUI | Ink (React for CLI) |
| Testing | Vitest |
| Linting | ESLint + Prettier |
| Build | tsc |
| ORM | Prisma (opção) |
| Cache | Redis + in-memory |
| Providers | OpenAI, Anthropic, Ollama |

## [S9] Plugin System

Plugins são packages que adicionam:
- Prompts específicos
- Ferramentas especializadas
- Templates prontos
- Detectores de padrões
- Comandos adicionais

Estrutura de um plugin:
```
plugins/
├── fastify/
│   ├── package.json
│   ├── prompts/
│   ├── tools/
│   └── templates/
```

## [S10] Configuration

Arquivo `orion.config.ts` na raiz do projeto:
```ts
export default {
  provider: "anthropic",
  reviewer: "gpt-5.5",
  parallelAgents: 6,
  defaultBranch: "development",
  architecture: "ddd"
}
```
