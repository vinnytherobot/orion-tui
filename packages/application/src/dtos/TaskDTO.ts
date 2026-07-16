import type { TaskStatusValue } from '@orion/domain';

export interface CreateTaskDTO {
  title: string;
  description: string;
  parentTaskId?: string;
  dependencies?: string[];
}

export interface TaskResponseDTO {
  id: string;
  title: string;
  description: string;
  status: TaskStatusValue;
  assignedAgentId: string | null;
  parentTaskId: string | null;
  dependencies: string[];
  result: string | null;
  createdAt: string;
  updatedAt: string;
}
