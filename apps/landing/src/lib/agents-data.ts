import {
  BookOpen,
  Brain,
  Building2,
  Cog,
  Container,
  Database,
  Gauge,
  GitBranch,
  type LucideIcon,
  Monitor,
  Server,
  ShieldCheck,
  TestTube2,
} from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  responsibility: string;
  description: string;
  icon: LucideIcon;
}

export const AGENTS: Agent[] = [
  {
    id: 'planner',
    name: 'Planner',
    responsibility: 'Task decomposition',
    description:
      'Breaks a high-level request into a DAG of small, dependency-aware tasks. No code — just structure.',
    icon: Brain,
  },
  {
    id: 'architect',
    name: 'Architect',
    responsibility: 'Technical decisions',
    description:
      'Owns the project architecture, sets conventions, and keeps the codebase consistent across agents.',
    icon: Building2,
  },
  {
    id: 'backend',
    name: 'Backend',
    responsibility: 'Business logic',
    description:
      'Implements use cases, services, and controllers following DDD. Stays out of docker/ and .github/.',
    icon: Server,
  },
  {
    id: 'database',
    name: 'Database',
    responsibility: 'Schema & migrations',
    description:
      'Owns Prisma/Drizzle schemas, migrations, indexes, and seeds. Optimizes slow queries.',
    icon: Database,
  },
  {
    id: 'frontend',
    name: 'Frontend',
    responsibility: 'UI implementation',
    description:
      'Builds components, layouts, and integrates with the API. Follows the design system.',
    icon: Monitor,
  },
  {
    id: 'qa',
    name: 'QA',
    responsibility: 'Test coverage',
    description: 'Writes unit, integration, and e2e tests. Tracks coverage and edge cases.',
    icon: TestTube2,
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    responsibility: 'Code review',
    description:
      'Reads diffs, enforces SOLID and DDD, flags bugs and duplications. Never writes code.',
    icon: GitBranch,
  },
  {
    id: 'security',
    name: 'Security',
    responsibility: 'Vulnerability analysis',
    description: 'Scans for exposed secrets, broken auth, and unsafe dependencies. Suggests fixes.',
    icon: ShieldCheck,
  },
  {
    id: 'performance',
    name: 'Performance',
    responsibility: 'Optimization',
    description: 'Detects bottlenecks, tunes Redis, manages queues, and trims p95 latency.',
    icon: Gauge,
  },
  {
    id: 'devops',
    name: 'DevOps',
    responsibility: 'CI/CD & infra',
    description: 'Writes Dockerfiles, GitHub Actions, and Terraform. Stays out of src/domain/.',
    icon: Container,
  },
  {
    id: 'documentation',
    name: 'Documentation',
    responsibility: 'Docs & changelogs',
    description: 'Keeps README, OpenAPI, examples, and CHANGELOG in sync with the codebase.',
    icon: BookOpen,
  },
  {
    id: 'git',
    name: 'Git',
    responsibility: 'Commits & PRs',
    description:
      'Writes conventional commits, generates changelogs, and opens complete Pull Requests.',
    icon: Cog,
  },
];
