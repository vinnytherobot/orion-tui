export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AgentModelConfig {
  planner?: string;
  architect?: string;
  backend?: string;
  database?: string;
  frontend?: string;
  qa?: string;
  reviewer?: string;
  devops?: string;
  security?: string;
  performance?: string;
  documentation?: string;
  git?: string;
}

export interface OrionConfig {
  version: string;
  defaultProvider: string;
  providers: Record<string, ProviderConfig>;
  agentModels: AgentModelConfig;
  logLevel?: "debug" | "info" | "warn" | "error";
  maxConcurrentAgents?: number;
}
