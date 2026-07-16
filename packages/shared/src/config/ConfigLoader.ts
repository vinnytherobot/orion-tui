import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { AppError } from '../errors/AppError.js';
import { ValidationError } from '../errors/ValidationError.js';
import { type Result, fail, ok } from '../types/Result.js';
import type { OrionConfig } from './OrionConfig.js';

const CONFIG_FILE_NAMES = ['orion.config.json', 'orion.config.js'] as const;

export async function loadConfig(cwd: string = process.cwd()): Promise<Result<OrionConfig>> {
  for (const fileName of CONFIG_FILE_NAMES) {
    const filePath = resolve(cwd, fileName);
    try {
      const content = await readFile(filePath, 'utf-8');
      const parsed = JSON.parse(content) as unknown;
      const validation = validateConfig(parsed);
      if (validation.isFail()) {
        return fail(validation.error);
      }
      return ok(validation.value);
    } catch (error: unknown) {
      if (
        error !== null &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: string }).code !== 'ENOENT'
      ) {
        return fail(AppError.internal(`Failed to read config: ${filePath}`));
      }
    }
  }

  return fail(AppError.notFound('Config file (orion.config.json)'));
}

export function validateConfig(data: unknown): Result<OrionConfig> {
  if (typeof data !== 'object' || data === null) {
    return fail(ValidationError.fromField('config', 'Config must be an object'));
  }

  const config = data as Record<string, unknown>;
  const errors: { field: string; message: string }[] = [];

  if (typeof config.version !== 'string') {
    errors.push({ field: 'version', message: 'version is required and must be a string' });
  }

  if (typeof config.defaultProvider !== 'string') {
    errors.push({
      field: 'defaultProvider',
      message: 'defaultProvider is required and must be a string',
    });
  }

  if (typeof config.providers !== 'object' || config.providers === null) {
    errors.push({ field: 'providers', message: 'providers is required and must be an object' });
  }

  if (typeof config.agentModels !== 'object' || config.agentModels === null) {
    errors.push({ field: 'agentModels', message: 'agentModels is required and must be an object' });
  }

  if (errors.length > 0) {
    return fail(ValidationError.fromFields(errors));
  }

  return ok(config as unknown as OrionConfig);
}
