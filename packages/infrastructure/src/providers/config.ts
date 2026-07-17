import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

interface ProviderConfigData {
  currentProvider: string;
  providers: Record<string, {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  }>;
}

const CONFIG_DIR = path.join(os.homedir(), '.orion');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: ProviderConfigData = {
  currentProvider: 'ollama',
  providers: {
    ollama: {
      baseUrl: 'http://127.0.0.1:11434',
      model: 'llama3',
    },
  },
};

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadProviderConfig(): ProviderConfigData {
  try {
    ensureConfigDir();
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(data) as ProviderConfigData;
    }
  } catch {
    // Fall through to default
  }
  return { ...DEFAULT_CONFIG };
}

export function saveProviderConfig(config: ProviderConfigData): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export function getCurrentProvider(): string {
  const config = loadProviderConfig();
  return config.currentProvider;
}

export function setCurrentProvider(name: string): void {
  const config = loadProviderConfig();
  config.currentProvider = name;
  saveProviderConfig(config);
}

export function getProviderApiKey(name: string): string | undefined {
  const config = loadProviderConfig();
  return config.providers[name]?.apiKey;
}

export function setProviderApiKey(name: string, apiKey: string): void {
  const config = loadProviderConfig();
  if (!config.providers[name]) {
    config.providers[name] = {};
  }
  config.providers[name].apiKey = apiKey;
  saveProviderConfig(config);
}

export function getProviderConfig(name: string): { apiKey?: string; baseUrl?: string; model?: string } | undefined {
  const config = loadProviderConfig();
  return config.providers[name];
}

export function setProviderConfig(name: string, data: { apiKey?: string; baseUrl?: string; model?: string }): void {
  const config = loadProviderConfig();
  if (!config.providers[name]) {
    config.providers[name] = {};
  }
  if (data.apiKey !== undefined) config.providers[name].apiKey = data.apiKey;
  if (data.baseUrl !== undefined) config.providers[name].baseUrl = data.baseUrl;
  if (data.model !== undefined) config.providers[name].model = data.model;
  saveProviderConfig(config);
}
