import type { AgentExecutor } from '@orion/infrastructure';
import {
  PROVIDER_CATALOG,
  createProvider,
  getProviderInfo,
  setCurrentProvider,
  setProviderApiKey,
  getProviderApiKey,
} from '@orion/infrastructure';
import type { ProviderInfo, LLMProviderConfig } from '@orion/infrastructure';
import type { Result } from '@orion/shared';
import { AppError } from '@orion/shared';

export function makeProviderService(deps: { agentExecutor: AgentExecutor }) {
  return {
    getAvailableProviders(): ProviderInfo[] {
      return PROVIDER_CATALOG;
    },
    
    getCurrentProvider(): { name: string; model: string } {
      const provider = deps.agentExecutor.getProvider();
      return {
        name: provider.name,
        model: provider.defaultModel,
      };
    },
    
    async switchProvider(name: string, apiKey?: string): Promise<Result<{ name: string; model: string }, AppError>> {
      const info = getProviderInfo(name);
      if (!info) {
        return { isOk: () => false, error: AppError.notFound(`Provider '${name}' not found`) } as Result<{ name: string; model: string }, AppError>;
      }
      
      if (info.requiresApiKey && !apiKey) {
        const existingKey = getProviderApiKey(name);
        if (!existingKey) {
          return { isOk: () => false, error: AppError.conflict(`Provider '${name}' requires an API key`) } as Result<{ name: string; model: string }, AppError>;
        }
      }
      
      const config: LLMProviderConfig = {
        apiKey: apiKey || getProviderApiKey(name) || 'ollama',
        baseUrl: info.defaultBaseUrl,
        model: info.defaultModel,
      };
      
      const provider = createProvider(name, config);
      deps.agentExecutor.setProvider(provider);
      
      setCurrentProvider(name);
      if (apiKey) {
        setProviderApiKey(name, apiKey);
      }
      
      return {
        isOk: () => true,
        value: { name: provider.name, model: provider.defaultModel },
      } as Result<{ name: string; model: string }, AppError>;
    },
  };
}

export type ProviderService = ReturnType<typeof makeProviderService>;
