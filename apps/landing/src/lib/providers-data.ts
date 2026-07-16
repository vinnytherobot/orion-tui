export interface Provider {
  id: string;
  name: string;
  description: string;
}

export const PROVIDERS: Provider[] = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-5.5, GPT-4o' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude Opus, Sonnet' },
  { id: 'ollama', name: 'Ollama', description: 'Local models' },
  { id: 'gemini', name: 'Google Gemini', description: 'Gemini Pro' },
  { id: 'openrouter', name: 'OpenRouter', description: 'Any model, one API' },
  { id: 'azure', name: 'Azure OpenAI', description: 'Enterprise-grade' },
];
