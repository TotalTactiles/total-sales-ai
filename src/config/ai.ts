export const aiConfig = {
  claude: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    model: import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    baseUrl: 'https://api.anthropic.com'
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
    baseUrl: 'https://api.openai.com'
  },
  relevance: {
    apiKey: import.meta.env.VITE_RELEVANCE_API_KEY,
    baseUrl: import.meta.env.VITE_RELEVANCE_BASE_URL || 'https://api-bcbe36.stack.tryrelevance.com/latest'
  }
} as const;

export type AIProvider = keyof typeof aiConfig;
