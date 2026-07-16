export interface Stat {
  label: string;
  value: number;
  suffix: string;
  display: string;
}

export const STATS: Stat[] = [
  { label: 'Specialized agents', value: 12, suffix: '', display: '12' },
  { label: 'LLM providers', value: 6, suffix: '', display: '6' },
  { label: 'DDD layers', value: 4, suffix: '', display: '4' },
  { label: 'Parallel tasks', value: 1, suffix: '', display: '∞' },
];
