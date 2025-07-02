
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

// Chat model routing logic
export const getOptimalModel = (taskType: string): 'openai' | 'claude' => {
  const shortFormTasks = ['summary', 'email', 'template', 'follow_up', 'quick_response'];
  const longFormTasks = ['analysis', 'digest', 'strategy', 'coaching', 'review'];
  
  if (shortFormTasks.includes(taskType)) {
    return 'openai'; // ChatGPT for quick responses
  } else if (longFormTasks.includes(taskType)) {
    return 'claude'; // Claude for deep thinking
  }
  
  // Default to ChatGPT for unknown tasks
  return 'openai';
};

// Validate API keys are available
export const validateAIConfig = (): { isValid: boolean; missingKeys: string[] } => {
  const missingKeys: string[] = [];
  
  if (!aiConfig.openai.apiKey) missingKeys.push('VITE_OPENAI_API_KEY');
  if (!aiConfig.claude.apiKey) missingKeys.push('VITE_ANTHROPIC_API_KEY');
  if (!aiConfig.relevance.apiKey) missingKeys.push('VITE_RELEVANCE_API_KEY');
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys
  };
};
