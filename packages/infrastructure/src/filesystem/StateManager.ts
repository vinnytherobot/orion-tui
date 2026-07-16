import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export class StateManager {
  private basePath: string;

  constructor(projectRoot: string) {
    this.basePath = join(projectRoot, '.orion');
  }

  async ensureDir(): Promise<void> {
    if (!existsSync(this.basePath)) {
      await mkdir(this.basePath, { recursive: true });
    }
  }

  async read<T>(filename: string): Promise<T | null> {
    const filePath = join(this.basePath, filename);
    try {
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch {
      return null;
    }
  }

  async write<T>(filename: string, data: T): Promise<void> {
    await this.ensureDir();
    const filePath = join(this.basePath, filename);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async delete(filename: string): Promise<boolean> {
    const filePath = join(this.basePath, filename);
    try {
      const { unlink } = await import('node:fs/promises');
      await unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getPath(filename: string): string {
    return join(this.basePath, filename);
  }
}
