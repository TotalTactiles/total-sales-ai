
export const aiConfig = {
  // All AI integrations disabled
  enabled: false,
  openai: {
    apiKey: '',
    baseUrl: '',
    defaultModel: '',
    fallbackModel: ''
  },
  claude: {
    apiKey: '',
    baseUrl: '',
    defaultModel: ''
  },
  relevance: {
    apiKey: '',
    baseUrl: ''
  },
  agents: {
    salesAgent: {
      name: 'Sales Assistant',
      description: 'Disabled',
      capabilities: []
    },
    managerAgent: {
      name: 'Management Assistant',
      description: 'Disabled',
      capabilities: []
    },
    automationAgent: {
      name: 'Automation Assistant',
      description: 'Disabled',
      capabilities: []
    },
    developerAgent: {
      name: 'System Assistant',
      description: 'Disabled',
      capabilities: []
    }
  },
  fallback: {
    enabled: false,
    responses: {
      generic: "AI features are currently disabled for system stability.",
      sales: "AI features are currently disabled for system stability.",
      manager: "AI features are currently disabled for system stability."
    }
  }
};
