import type { Result, AppError } from "@orion/shared";
import type { TaskResponseDTO } from "../dtos/TaskDTO.js";
import type { AgentResponseDTO } from "../dtos/AgentDTO.js";

export interface IOrchestratorPort {
  executePlan(plan: TaskResponseDTO[]): Promise<Result<void, AppError>>;
  assignTask(taskId: string, agentId: string): Promise<Result<void, AppError>>;
  getAvailableAgents(): Promise<AgentResponseDTO[]>;
  getNextTask(): Promise<TaskResponseDTO | null>;
  reportTaskComplete(taskId: string, result: string): Promise<Result<void, AppError>>;
  reportTaskFailed(taskId: string, reason: string): Promise<Result<void, AppError>>;
}
