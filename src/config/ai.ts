
export const aiConfig = {
  // All AI integrations disabled for demo stability
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
      description: 'AI-powered sales automation and lead optimization',
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
      description: 'Team performance optimization and strategic insights',
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
      description: 'Process automation and task orchestration',
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
      description: 'Real-time voice interaction and briefings',
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
    contextualBubble: false, // Disabled
    voiceBriefing: false, // Disabled
    realTimeCoaching: false, // Disabled
    smartAutomations: false, // Disabled
    predictiveAnalytics: false, // Disabled
    conversationalAI: false // Disabled
  },
  fallback: {
    enabled: true,
    responses: {
      generic: "AI analysis complete. All systems performing optimally.",
      sales: "AI recommendations generated based on current pipeline data.",
      manager: "Strategic insights compiled from team performance metrics.",
      automation: "Workflow optimization suggestions are ready for review.",
      voice: "Voice briefing ready. Click play to hear your daily summary."
    }
  }
};

// Mock AI response generator for disabled state
export const generateMockAIResponse = (type: string = 'generic', context?: any) => {
  const responses = aiConfig.fallback.responses;
  const baseResponse = responses[type as keyof typeof responses] || responses.generic;
  
  // Add contextual elements to make responses feel more realistic
  const contextualElements = [
    "Based on recent activity patterns",
    "Analyzing current market conditions", 
    "Reviewing performance metrics",
    "Processing lead engagement data",
    "Evaluating conversation trends",
    "Assessing pipeline velocity"
  ];
  
  const randomElement = contextualElements[Math.floor(Math.random() * contextualElements.length)];
  return `${randomElement}, ${baseResponse.toLowerCase()}`;
};

// Mock AI metrics for visual displays
export const getMockAIMetrics = () => ({
  emailsDrafted: Math.floor(Math.random() * 15) + 5,
  callsScheduled: Math.floor(Math.random() * 10) + 3,
  proposalsGenerated: Math.floor(Math.random() * 8) + 2,
  performanceImprovement: Math.floor(Math.random() * 25) + 15,
  automationsActive: Math.floor(Math.random() * 12) + 8,
  leadsAnalyzed: Math.floor(Math.random() * 50) + 25,
  voiceBriefingsPlayed: Math.floor(Math.random() * 7) + 1,
  realTimeInsights: Math.floor(Math.random() * 20) + 10
});
