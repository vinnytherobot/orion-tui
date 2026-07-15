import { type Result, ok, fail, AppError } from "@orion/shared";
import type { ITaskRepository, IAgentRepository, Task, Agent } from "@orion/domain";
import type { IAgentExecutorPort } from "../ports/IAgentExecutorPort.js";
import type { TaskResponseDTO } from "../dtos/TaskDTO.js";

function toTaskResponse(task: Task): TaskResponseDTO {
  const props = task.toJSON();
  return {
    id: props.id.toString(),
    title: props.title,
    description: props.description,
    status: props.status.value,
    assignedAgentId: props.assignedAgentId,
    parentTaskId: props.parentTaskId,
    dependencies: [...props.dependencies],
    result: props.result,
    createdAt: props.createdAt.toISOString(),
    updatedAt: props.updatedAt.toISOString(),
  };
}

function toAgentResponse(agent: Agent) {
  const props = agent.toJSON();
  return {
    id: props.id,
    name: props.name,
    role: props.role,
    status: props.status.value,
    currentTaskId: props.currentTaskId,
    permissions: [...props.permissions],
    createdAt: props.createdAt.toISOString(),
    updatedAt: props.updatedAt.toISOString(),
  };
}

export class ImplementUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly agentExecutor: IAgentExecutorPort,
  ) {}

  async execute(input: { taskId: string }): Promise<Result<TaskResponseDTO, AppError>> {
    const task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      return fail(AppError.notFound("Task"));
    }

    const startResult = task.start();
    if (startResult.isFail()) {
      return fail(startResult.error);
    }

    const agents = await this.agentRepository.findAll();
    const idleAgent = agents.find((a) => a.status.isIdle());
    if (!idleAgent) {
      return fail(AppError.conflict("No idle agents available"));
    }

    const assignResult = task.assignTo(idleAgent.id);
    if (assignResult.isFail()) {
      return fail(assignResult.error);
    }

    const agentAssignResult = idleAgent.assignTask(task.id.toString());
    if (agentAssignResult.isFail()) {
      return fail(agentAssignResult.error);
    }

    await this.taskRepository.save(task);
    await this.agentRepository.save(idleAgent);

    const execResult = await this.agentExecutor.execute(
      toAgentResponse(idleAgent),
      toTaskResponse(task),
    );

    if (execResult.isFail()) {
      task.fail(execResult.error.message);
      idleAgent.reset();
      await this.taskRepository.save(task);
      await this.agentRepository.save(idleAgent);
      return fail(execResult.error);
    }

    const execution = execResult.value;
    if (execution.success) {
      task.complete(execution.output);
    } else {
      task.fail(execution.output);
    }

    idleAgent.completeTask();
    await this.taskRepository.save(task);
    await this.agentRepository.save(idleAgent);

    return ok(toTaskResponse(task));
  }
}
