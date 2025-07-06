
export const aiConfig = {
  // All AI integrations disabled
  enabled: false,
  openai: {
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    fallbackModel: 'gpt-3.5-turbo'
  },
  claude: {
    apiKey: '',
    baseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-3-haiku-20240307'
  },
  elevenlabs: {
    apiKey: '',
    baseUrl: 'https://api.elevenlabs.io',
    defaultVoice: 'Sarah'
  },
  relevance: {
    apiKey: '',
    baseUrl: 'https://api.relevanceai.com'
  },
  agents: {
    salesAgent: {
      name: 'Elite Sales Assistant',
      description: 'AI-powered sales automation and lead optimization (DISABLED)',
      capabilities: [
        'Lead scoring and prioritization',
        'Email drafting and follow-up sequences',
        'Call script generation',
        'Objection handling recommendations',
        'Deal closure strategies'
      ]
    },
    managerAgent: {
      name: 'Strategic Management Assistant',
      description: 'Team performance optimization and strategic insights (DISABLED)',
      capabilities: [
        'Team performance analytics',
        'Pipeline forecasting',
        'Resource allocation optimization',
        'Strategic planning assistance',
        'Report generation'
      ]
    },
    automationAgent: {
      name: 'Workflow Automation Assistant',
      description: 'Process automation and task orchestration (DISABLED)',
      capabilities: [
        'Lead routing automation',
        'Follow-up scheduling',
        'Data synchronization',
        'Workflow triggers',
        'Task automation'
      ]
    },
    voiceAgent: {
      name: 'Voice AI Assistant',
      description: 'Real-time voice interaction and briefings (DISABLED)',
      capabilities: [
        'Daily voice briefings',
        'Call coaching',
        'Real-time transcription',
        'Voice commands',
        'Audio insights'
      ]
    }
  },
  features: {
    contextualBubble: false,
    voiceBriefing: false,
    realTimeCoaching: false,
    smartAutomations: false,
    predictiveAnalytics: false,
    conversationalAI: false
  },
  fallback: {
    enabled: true,
    responses: {
      generic: "AI features are currently disabled.",
      sales: "AI sales assistance is currently disabled.",
      manager: "AI management insights are currently disabled.",
      automation: "Automation features are currently disabled.",
      voice: "Voice AI features are currently disabled."
    }
  }
};

// Mock AI response generator for disabled state
export const generateMockAIResponse = (type: string = 'generic', context?: any) => {
  const responses = aiConfig.fallback.responses;
  return responses[type as keyof typeof responses] || responses.generic;
};

// Mock AI metrics for visual displays - all zeros when disabled
export const getMockAIMetrics = () => ({
  emailsDrafted: 0,
  callsScheduled: 0,
  proposalsGenerated: 0,
  performanceImprovement: 0,
  automationsActive: 0,
  leadsAnalyzed: 0,
  voiceBriefingsPlayed: 0,
  realTimeInsights: 0
});
