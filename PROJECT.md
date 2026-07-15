# Multi-Agent CLI (Orion-cli)
## Arquitetura para uma CLI Orquestradora de Agentes de IA

> **Objetivo:** Desenvolver uma CLI capaz de atuar como um orquestrador inteligente de múltiplos agentes especializados, permitindo que eles colaborem em um mesmo projeto de software de forma paralela, organizada e escalável. A interface deve ser amigável e fácil de usar, com comandos claros e objetivos. O sistema deve ser capaz de se adaptar a diferentes tecnologias e frameworks, permitindo a adição de novos agentes e ferramentas de forma simples e modular. Além disso, a CLI deve ter interface parecida com o Mimo Code, Claude Code, Openclaude, opencode, agy, etc.

---

# Visão Geral

A proposta é criar uma CLI que funcione como um **Tech Lead virtual**, responsável por:

- compreender a solicitação do usuário;
- analisar o projeto existente;
- planejar a implementação;
- dividir o trabalho em tarefas menores;
- distribuir essas tarefas para agentes especializados;
- coordenar a execução paralela;
- revisar as alterações;
- integrar todas as mudanças;
- gerar documentação;
- executar testes;
- criar commits e Pull Requests.

O usuário interage apenas com a CLI.

Exemplo:

```bash
orion implement "Adicionar autenticação JWT"
```

Toda a complexidade acontece internamente.

---

# Objetivos

A CLI deverá ser capaz de:

- analisar qualquer projeto existente;
- entender automaticamente sua arquitetura;
- criar um plano de implementação;
- executar diversos agentes simultaneamente;
- compartilhar contexto entre agentes;
- impedir conflitos de escrita;
- revisar o código produzido;
- executar testes;
- gerar documentação automaticamente;
- criar commits padronizados;
- abrir Pull Requests completos.

---

# Filosofia

A CLI não será um agente.

Ela será um **orquestrador**.

Cada agente será especialista em apenas uma responsabilidade.

Isso aproxima o fluxo de trabalho de uma equipe real de engenharia.

---

# Arquitetura Geral

```
                Usuário
                    │
                    ▼
            Multi-Agent CLI
                    │
                    ▼
              Orchestrator
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   Planner     Project Analyzer  Memory
       │
       ▼
 Scheduler (DAG)
       │
 ┌─────┼───────────────────────────────┐
 ▼     ▼       ▼        ▼       ▼
Backend Database Frontend DevOps Documentation
 │
 ▼
Reviewer
 │
 ▼
Integration
 │
 ▼
Git Agent
 │
 ▼
Pull Request
```

---

# Componentes

## CLI

É responsável apenas por receber comandos.

Exemplo:

```bash
orion init

orion implement

orion review

orion release

orion docs

orion test
```

---

## Orchestrator

É o cérebro do sistema.

Responsabilidades:

- controlar fluxo
- iniciar agentes
- aguardar resultados
- resolver conflitos
- atualizar memória
- finalizar execução

---

## Project Analyzer

Antes de iniciar qualquer implementação, o projeto será analisado.

Ele deverá identificar automaticamente:

- linguagem
- framework
- arquitetura
- banco de dados
- ORM
- filas
- cache
- testes
- CI/CD
- docker
- estrutura de pastas

Exemplo:

```json
{
  "language":"typescript",
  "framework":"fastify",
  "architecture":"DDD",
  "orm":"prisma",
  "database":"postgres",
  "queue":"bullmq",
  "cache":"redis"
}
```

---

## Planner

Recebe uma solicitação.

Exemplo:

> Implementar autenticação JWT.

Ele transforma isso em tarefas.

Exemplo:

```
Epic

Autenticação

Tasks

Criar entidade User

Criar Repository

Criar JWT

Criar Refresh Token

Criar Middleware

Criar Rotas

Criar Testes

Atualizar Documentação
```

---

## Scheduler

Não executa tarefas.

Ele apenas monta o fluxo de dependências.

Exemplo:

```
Criar User

↓

Repository

↓

Use Cases

↓

Controller

↓

Testes
```

Ou em paralelo:

```
            Planner

        ┌────┴─────┐

Backend         Database

        └────┬─────┘

          Reviewer
```

---

# DAG

Toda execução será baseada em um grafo acíclico.

Exemplo:

```
Task A

↓

Task B

↓

Task C
```

ou

```
       A

   ┌───┴────┐

   B        C

   │        │

   └───┬────┘

       D
```

Assim somente tarefas independentes serão executadas em paralelo.

---

# Agentes

Cada agente possuirá apenas uma responsabilidade.

---

## Planner Agent

Especialista em planejamento.

Não escreve código.

Apenas divide tarefas.

---

## Architect Agent

Responsável por:

- arquitetura
- decisões técnicas
- padrões
- organização

---

## Backend Agent

Responsável por:

- regras de negócio
- casos de uso
- controllers
- services
- DDD

---

## Database Agent

Responsável por:

- Prisma
- migrations
- schemas
- índices
- seeds

---

## Frontend Agent

Responsável apenas pela interface.

---

## Documentation Agent

Atualiza:

- README
- Swagger/OpenAPI
- Scalar
- exemplos
- changelog

---

## QA Agent

Cria:

- testes unitários
- integração
- e2e

---

## DevOps Agent

Responsável por:

- Docker
- CI
- CD
- GitHub Actions

---

## Security Agent

Analisa:

- vulnerabilidades
- secrets
- autenticação
- autorização

---

## Performance Agent

Analisa:

- consultas lentas
- cache
- Redis
- filas
- gargalos

---

## Reviewer Agent

Não implementa.

Apenas revisa.

Verifica:

- SOLID
- Clean Architecture
- DDD
- Code Style
- Bugs
- Duplicações

---

## Git Agent

Responsável por:

- commits
- changelog
- PR
- release notes

---

# Memória Compartilhada

Todos os agentes utilizarão uma memória comum.

Exemplo:

```
.state/

project.json

tasks.json

agents.json

decisions.md

architecture.md
```

Cada agente poderá:

- ler
- atualizar
- registrar decisões

Nunca alterar decisões de outro agente sem autorização do Orchestrator.

---

# Comunicação

Os agentes nunca conversarão diretamente.

Toda comunicação passará pelo Orchestrator.

```
Backend

↓

Orchestrator

↓

Database
```

Isso evita inconsistências.

---

# Execução Paralela

Sempre que possível.

Exemplo:

```
Planner

↓

Spawn

Backend

Database

Documentation

↓

Wait

↓

Reviewer
```

---

# Providers

A CLI não dependerá de um único modelo.

Ela deverá suportar múltiplos provedores.

Exemplo:

- OpenAI
- Anthropic
- Ollama
- Google Gemini
- OpenRouter
- Azure OpenAI

Cada agente poderá utilizar um provider diferente.

---

# Seleção Inteligente de Modelo

Exemplo:

| Agente | Modelo |
|---------|---------|
| Planner | GPT-5.5 |
| Backend | Claude |
| QA | GPT-5.5 |
| Documentation | Gemini |
| Refatoração Local | Ollama |

---

# Sistema de Plugins

A CLI será extensível.

```
plugins/

fastify

nestjs

express

nextjs

react

expo

prisma

typeorm

drizzle

docker

terraform
```

Cada plugin adicionará:

- prompts
- ferramentas
- templates
- detectores
- comandos

---

# Sistema de Ferramentas

Cada agente poderá utilizar ferramentas.

Exemplo:

```
Read File

Write File

Search

Git

Terminal

Docker

Prisma

NPM

PNPM

Bun

SQLite

Postgres

Redis
```

O acesso será controlado pelo Orchestrator.

---

# Sistema de Permissões

Nem todos os agentes terão acesso total.

Exemplo:

Backend

✅ src/

❌ docker/

❌ .github/

---

DevOps

✅ docker/

✅ github/

❌ src/domain/

---

Isso reduz conflitos.

---

# Conflitos

Caso dois agentes alterem o mesmo arquivo:

```
Backend

↓

Orchestrator

↑

Frontend
```

O Orchestrator decidirá:

- merge automático
- reexecução
- intervenção do Reviewer

---

# Estados

Cada tarefa possuirá um estado.

```
Pending

Planning

Running

Waiting

Review

Testing

Completed

Failed

Cancelled
```

---

# Observabilidade

A CLI deverá possuir logs.

Exemplo:

```
Planner

✔ Finished

Backend

Running...

Documentation

Waiting...

Reviewer

Pending
```

---

# Histórico

Toda execução será armazenada.

```
.history/

execution-001

execution-002

execution-003
```

Permitindo:

- replay
- auditoria
- comparação

---

# Git

Fluxo esperado:

```
Criar branch

↓

Executar agentes

↓

Executar testes

↓

Reviewer

↓

Commit

↓

Push

↓

Criar PR
```

---

# Pull Request

A CLI deverá gerar automaticamente:

- resumo
- changelog
- checklist
- impacto
- testes realizados

---

# Configuração

Arquivo:

```
orion.config.ts
```

Exemplo:

```ts
export default {

provider: "anthropic",

reviewer: "gpt-5.5",

parallelAgents: 6,

defaultBranch: "development",

architecture: "ddd"

}
```

---

# Estrutura do Projeto

```
src/

cli/

orchestrator/

scheduler/

planner/

memory/

providers/

agents/

plugins/

git/

tasks/

utils/

config/
```

---

# Roadmap

## Fase 1

- CLI
- comandos básicos
- leitura do projeto
- planner

---

## Fase 2

- Backend Agent
- Database Agent
- Documentation Agent

---

## Fase 3

- execução paralela
- scheduler
- DAG

---

## Fase 4

- Reviewer
- QA
- testes automáticos

---

## Fase 5

- Git Agent
- PR automático
- changelog

---

## Fase 6

- plugins
- novos providers
- memória vetorial
- aprendizado de padrões

---

# Visão de Longo Prazo

A CLI deverá evoluir de um simples executor de prompts para uma plataforma completa de desenvolvimento assistido por IA.

No futuro, ela poderá:

- coordenar dezenas de agentes simultaneamente;
- adaptar automaticamente a estratégia conforme o tipo de projeto;
- reutilizar conhecimento adquirido em projetos anteriores (quando configurado para isso);
- integrar-se a serviços como GitHub, GitLab e Jira;
- sugerir melhorias arquiteturais;
- acompanhar métricas de qualidade, cobertura de testes e desempenho;
- atuar como um "Engineering Manager" virtual, auxiliando no planejamento, execução e revisão do ciclo de desenvolvimento.

O objetivo final é que o desenvolvedor deixe de gerenciar tarefas repetitivas e passe a focar nas decisões de produto e arquitetura, enquanto a CLI coordena a execução técnica de forma previsível, auditável e escalável.