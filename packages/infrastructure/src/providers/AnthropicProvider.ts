import type { Result } from '@orion/shared';
import { AppError, fail, ok } from '@orion/shared';
import type { ILLMProvider, LLMMessage, LLMProviderConfig, LLMResponse } from './BaseProvider.js';

export class AnthropicProvider implements ILLMProvider {
  readonly name = 'anthropic';
  readonly defaultModel: string;

  private config: LLMProviderConfig;

  constructor(config: LLMProviderConfig) {
    this.config = config;
    this.defaultModel = config.model ?? 'claude-sonnet-4-20250514';
  }

  async chat(
    messages: LLMMessage[],
    overrides?: Partial<LLMProviderConfig>,
  ): Promise<Result<LLMResponse, AppError>> {
    const model = overrides?.model ?? this.defaultModel;
    const maxTokens = overrides?.maxTokens ?? this.config.maxTokens ?? 4096;
    const baseUrl = overrides?.baseUrl ?? this.config.baseUrl ?? 'https://api.anthropic.com';

    const systemMessages = messages.filter((m) => m.role === 'system');
    const nonSystemMessages = messages.filter((m) => m.role !== 'system');

    const systemPrompt =
      systemMessages.length > 0 ? systemMessages.map((m) => m.content).join('\n') : undefined;

    try {
      const response = await fetch(`${baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          ...(systemPrompt ? { system: systemPrompt } : {}),
          messages: nonSystemMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const body = await response.text();
        return fail(AppError.internal(`Anthropic API error (${response.status}): ${body}`));
      }

      const data = (await response.json()) as {
        content: Array<{ type: string; text: string }>;
        model: string;
        usage: { input_tokens: number; output_tokens: number };
        stop_reason: string;
      };

      const textBlock = data.content.find((b) => b.type === 'text');
      if (!textBlock) {
        return fail(AppError.internal('Anthropic returned no text content'));
      }

      return ok({
        content: textBlock.text,
        model: data.model,
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens,
        },
        finishReason:
          data.stop_reason === 'end_turn'
            ? 'stop'
            : data.stop_reason === 'max_tokens'
              ? 'length'
              : 'error',
      });
    } catch (error) {
      return fail(
        AppError.internal(
          `Anthropic request failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const baseUrl = this.config.baseUrl ?? 'https://api.anthropic.com';
      const response = await fetch(`${baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.defaultModel,
          max_tokens: 1,
          messages: [{ role: 'user', content: 'ping' }],
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
