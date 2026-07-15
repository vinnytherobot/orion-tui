# Orion CLI - Agentes

> Guia completo dos agentes especializados do sistema multi-agente.

## Filosofia

A CLI não será um agente. Ela será um **orquestrador**. Cada agente será especialista em apenas uma responsabilidade. Isso aproxima o fluxo de trabalho de uma equipe real de engenharia.

---

## Hierarquia de Agentes

```
Orchestrator
    │
    ├── Planner Agent (planejamento)
    │
    ├── Architect Agent (arquitetura)
    │
    ├── Agentes de Implementação
    │   ├── Backend Agent
    │   ├── Database Agent
    │   └── Frontend Agent
    │
    ├── Agentes de Qualidade
    │   ├── QA Agent
    │   ├── Reviewer Agent
    │   └── Security Agent
    │
    ├── Agentes de Infraestrutura
    │   ├── DevOps Agent
    │   └── Performance Agent
    │
    ├── Agentes de Documentação
    │   └── Documentation Agent
    │
    └── Git Agent
```

---

## Agentes

### Planner Agent

**Responsabilidade:** Planejamento e divisão de tarefas.

**Não faz:** Escrever código.

**Funções:**
- Receber solicitações do usuário
- Analisar escopo e complexidade
- Dividir em tarefas menores e gerenciáveis
- Definir dependências entre tarefas
- Criar plano de execução

**Exemplo de saída:**
```
Epic: Autenticação

Tasks:
1. Criar entidade User
2. Criar Repository
3. Criar JWT
4. Criar Refresh Token
5. Criar Middleware
6. Criar Rotas
7. Criar Testes
8. Atualizar Documentação
```

---

### Architect Agent

**Responsabilidade:** Arquitetura e decisões técnicas.

**Funções:**
- Definir arquitetura do projeto
- Tomar decisões técnicas
- Estabelecer padrões
- Organizar estrutura de pastas
- Garantir consistência arquitetural

---

### Backend Agent

**Responsabilidade:** Lógica de negócio e implementação backend.

**Funções:**
- Implementar regras de negócio
- Criar casos de uso
- Criar controllers
- Criar services
- Seguir princípios DDD

**Permissões:**
- ✅ `src/`
- ❌ `docker/`
- ❌ `.github/`

---

### Database Agent

**Responsabilidade:** Persistência e modelagem de dados.

**Funções:**
- Criar schemas (Prisma, TypeORM, Drizzle)
- Criar migrations
- Criar índices
- Criar seeds
- Otimizar consultas

---

### Frontend Agent

**Responsabilidade:** Interface do usuário.

**Funções:**
- Criar componentes
- Implementar layouts
- Integrar com APIs
- Seguir padrões de design

---

### Documentation Agent

**Responsabilidade:** Documentação do projeto.

**Funções:**
- Atualizar README
- Criar/atualizar Swagger/OpenAPI
- Configurar Scalar
- Criar exemplos de uso
- Atualizar changelog
- Gerar documentação de API

---

### QA Agent

**Responsabilidade:** Garantia de qualidade.

**Funções:**
- Criar testes unitários
- Criar testes de integração
- Criar testes e2e
- Validar cobertura de código
- Identificar casos extremos

---

### Reviewer Agent

**Responsabilidade:** Revisão de código.

**Não faz:** Implementar código.

**Funções:**
- Verificar princípios SOLID
- Verificar Clean Architecture
- Verificar padrões DDD
- Verificar code style
- Identificar bugs
- Identificar duplicações
- Sugerir melhorias

---

### DevOps Agent

**Responsabilidade:** Infraestrutura e deploy.

**Funções:**
- Criar/atualizar Dockerfile
- Configurar CI/CD
- Criar GitHub Actions
- Gerenciar containers
- Configurar ambientes

**Permissões:**
- ✅ `docker/`
- ✅ `.github/`
- ❌ `src/domain/`

---

### Security Agent

**Responsabilidade:** Segurança do sistema.

**Funções:**
- Analisar vulnerabilidades
- Detectar secrets expostos
- Verificar autenticação
- Verificar autorização
- Sugerir correções de segurança

---

### Performance Agent

**Responsabilidade:** Otimização de desempenho.

**Funções:**
- Identificar consultas lentas
- Configurar cache
- Otimizar Redis
- Gerenciar filas
- Identificar gargalos
- Sugerir melhorias de performance

---

### Git Agent

**Responsabilidade:** Controle de versão.

**Funções:**
- Criar commits padronizados
- Gerar changelog
- Criar Pull Requests
- Gerar release notes
- Gerenciar branches

---

## Comunicação entre Agentes

**Regra fundamental:** Agentes nunca conversam diretamente.

```
Backend Agent
      │
      ▼
  Orchestrator
      │
      ▼
Database Agent
```

Toda comunicação passa pelo Orchestrator para evitar inconsistências.

---

## Execução Paralela

Quando possível, agentes independentes executam em paralelo:

```
Planner
   │
   ▼
Spawn
┌──┴──┐
│     │
Backend Database Documentation
│     │     │
└──┬──┘─────┘
   ▼
Wait
   │
   ▼
Reviewer
```

---

## Sistema de Permissões

Cada agente possui permissões específicas:

| Agente | Escopo Permitido | Escopo Bloqueado |
|--------|------------------|------------------|
| Backend | `src/` | `docker/`, `.github/` |
| Database | `src/infrastructure/database/` | `src/domain/` |
| Frontend | `src/presentation/` | `src/infrastructure/` |
| DevOps | `docker/`, `.github/` | `src/domain/` |
| Documentation | `docs/`, `README.md` | `src/` |

---

## Resolução de Conflitos

Quando dois agentes alteram o mesmo arquivo:

1. **Merge automático** - quando possível
2. **Reexecução** - quando conflito de lógica
3. **Intervenção do Reviewer** - quando necessário

---

## Estados de Tarefa

Cada tarefa passa por estados:

```
Pending → Planning → Running → Waiting → Review → Testing → Completed
                      │                                        │
                      └── Failed ──────────────────────────────┘
                      │
                      └── Cancelled
```

---

## Seleção de Modelo

Cada agente pode utilizar um modelo diferente:

| Agente | Modelo Recomendado |
|--------|-------------------|
| Planner | GPT-5.5 |
| Backend | Claude |
| Database | Claude |
| Frontend | Claude |
| QA | GPT-5.5 |
| Documentation | Gemini |
| Reviewer | GPT-5.5 |
| DevOps | Claude |
| Security | Claude |
| Performance | Claude |
| Git | Claude |

---

## Plugins

Agentes podem ser estendidos via plugins:

```
plugins/
├── fastify/
├── nestjs/
├── express/
├── nextjs/
├── react/
├── expo/
├── prisma/
├── typeorm/
├── drizzle/
├── docker/
└── terraform/
```

Cada plugin adiciona:
- Prompts específicos
- Ferramentas especializadas
- Templates prontos
- Detectores de padrões
- Comandos adicionais
