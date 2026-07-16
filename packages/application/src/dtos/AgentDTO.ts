import type { AgentStatusValue } from '@orion/domain';

export interface CreateAgentDTO {
  id: string;
  name: string;
  role: string;
  permissions?: string[];
}

export interface AgentResponseDTO {
  id: string;
  name: string;
  role: string;
  status: AgentStatusValue;
  currentTaskId: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}
