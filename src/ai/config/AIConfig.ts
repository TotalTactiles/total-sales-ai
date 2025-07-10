
// Central AI Configuration and Feature Flags
export const AI_CONFIG = {
  // Global AI Enable/Disable Flag
  ENABLED: false, // TEMPORARILY DISABLED
  
  // Feature-specific flags
  FEATURES: {
    VOICE_ASSISTANT: false,
    AGENT_SUMMARIES: false,
    SUGGESTION_BOXES: false,
    EMAIL_DRAFTING: false,
    PROPOSAL_GENERATION: false,
    LEAD_SCORING: false,
    CALL_ANALYSIS: false,
    PERFORMANCE_INSIGHTS: false,
    CONTEXTUAL_RECOMMENDATIONS: false,
    SMART_AUTOMATION: false
  },

  // API Configuration
  APIS: {
    OPENAI: {
      enabled: false,
      model: 'gpt-4o-mini',
      maxTokens: 1000
    },
    CLAUDE: {
      enabled: false,
      model: 'claude-3-haiku-20240307',
      maxTokens: 1000
    },
    RELEVANCE: {
      enabled: false
    },
    ELEVENLABS: {
      enabled: false,
      voice: 'Sarah'
    }
  },

  // Workspace Context Mapping
  WORKSPACE_CONTEXTS: {
    SALES_OS: 'sales_rep',
    MANAGER_OS: 'manager',
    DEVELOPER_MODE: 'developer'
  },

  // Fallback Messages
  DISABLED_MESSAGES: {
    VOICE_ASSISTANT: 'AI Voice Assistant temporarily paused',
    AGENT_SUMMARY: 'AI insights temporarily unavailable',
    SUGGESTIONS: 'AI suggestions temporarily paused',
    GENERATION: 'AI generation temporarily disabled'
  }
};

export const isAIEnabled = (feature?: keyof typeof AI_CONFIG.FEATURES): boolean => {
  if (!AI_CONFIG.ENABLED) return false;
  if (!feature) return AI_CONFIG.ENABLED;
  return AI_CONFIG.FEATURES[feature];
};
