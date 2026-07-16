import type { AppError, Result } from '@orion/shared';
import type { AgentResponseDTO } from '../dtos/AgentDTO.js';
import type { TaskResponseDTO } from '../dtos/TaskDTO.js';

export interface AgentExecutionResult {
  success: boolean;
  output: string;
  artifacts?: string[];
}

export interface IAgentExecutorPort {
  execute(
    agent: AgentResponseDTO,
    task: TaskResponseDTO,
  ): Promise<Result<AgentExecutionResult, AppError>>;
  cancel(taskId: string): Promise<Result<void, AppError>>;
}
