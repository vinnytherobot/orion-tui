import type { AppError, Result } from '@orion/shared';
import type { AgentResponseDTO } from '../dtos/AgentDTO.js';
import type { TaskResponseDTO } from '../dtos/TaskDTO.js';

export interface IOrchestratorPort {
  executePlan(plan: TaskResponseDTO[]): Promise<Result<void, AppError>>;
  assignTask(taskId: string, agentId: string): Promise<Result<void, AppError>>;
  getAvailableAgents(): Promise<AgentResponseDTO[]>;
  getNextTask(): Promise<TaskResponseDTO | null>;
  reportTaskComplete(taskId: string, result: string): Promise<Result<void, AppError>>;
  reportTaskFailed(taskId: string, reason: string): Promise<Result<void, AppError>>;
}
