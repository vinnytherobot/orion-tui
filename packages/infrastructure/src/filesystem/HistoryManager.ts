import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

export interface HistoryEntry {
  id: string;
  taskId: string;
  agentId: string;
  action: string;
  input: string;
  output: string;
  startedAt: string;
  completedAt: string;
  duration: number;
  success: boolean;
}

export class HistoryManager {
  private basePath: string;

  constructor(projectRoot: string) {
    this.basePath = join(projectRoot, ".orion", "history");
  }

  private getHistoryFile(taskId: string): string {
    return join(this.basePath, `${taskId}.json`);
  }

  private async ensureDir(): Promise<void> {
    if (!existsSync(this.basePath)) {
      await mkdir(this.basePath, { recursive: true });
    }
  }

  async append(entry: HistoryEntry): Promise<void> {
    await this.ensureDir();
    const filePath = this.getHistoryFile(entry.taskId);

    let entries: HistoryEntry[] = [];
    try {
      const content = await readFile(filePath, "utf-8");
      entries = JSON.parse(content) as HistoryEntry[];
    } catch {
      entries = [];
    }

    entries.push(entry);
    await writeFile(filePath, JSON.stringify(entries, null, 2), "utf-8");
  }

  async getByTaskId(taskId: string): Promise<HistoryEntry[]> {
    const filePath = this.getHistoryFile(taskId);
    try {
      const content = await readFile(filePath, "utf-8");
      return JSON.parse(content) as HistoryEntry[];
    } catch {
      return [];
    }
  }

  async getByAgentId(agentId: string): Promise<HistoryEntry[]> {
    const { readdir } = await import("node:fs/promises");
    const entries: HistoryEntry[] = [];

    try {
      const files = await readdir(this.basePath);
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const content = await readFile(join(this.basePath, file), "utf-8");
        const taskEntries = JSON.parse(content) as HistoryEntry[];
        entries.push(...taskEntries.filter((e) => e.agentId === agentId));
      }
    } catch {
      // directory may not exist yet
    }

    return entries.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  }

  async getAll(): Promise<HistoryEntry[]> {
    const { readdir } = await import("node:fs/promises");
    const entries: HistoryEntry[] = [];

    try {
      const files = await readdir(this.basePath);
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        const content = await readFile(join(this.basePath, file), "utf-8");
        entries.push(...(JSON.parse(content) as HistoryEntry[]));
      }
    } catch {
      // directory may not exist yet
    }

    return entries.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  }
}
