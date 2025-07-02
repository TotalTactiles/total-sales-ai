
export const aiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    fallbackModel: 'gpt-3.5-turbo'
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    baseUrl: 'https://api.anthropic.com/v1',
    defaultModel: 'claude-3-haiku-20240307'
  },
  relevance: {
    apiKey: process.env.RELEVANCE_API_KEY || '',
    baseUrl: 'https://api.relevanceai.com/v1'
  },
  agents: {
    salesAgent: {
      name: 'Sales Assistant',
      description: 'Personal AI assistant for sales representatives',
      capabilities: ['lead_analysis', 'call_assistance', 'email_drafting', 'objection_handling']
    },
    managerAgent: {
      name: 'Management Assistant',
      description: 'AI assistant for sales managers and team leads',
      capabilities: ['team_analysis', 'performance_insights', 'strategy_recommendations', 'coaching_suggestions']
    },
    automationAgent: {
      name: 'Automation Assistant',
      description: 'AI assistant for workflow automation and optimization',
      capabilities: ['workflow_creation', 'process_optimization', 'trigger_management', 'performance_monitoring']
    },
    developerAgent: {
      name: 'System Assistant',
      description: 'AI assistant for system health and error resolution',
      capabilities: ['error_diagnosis', 'system_monitoring', 'performance_optimization', 'health_reporting']
    }
  },
  fallback: {
    enabled: true,
    responses: {
      generic: "I'm here to help! Could you please provide more details about what you need assistance with?",
      sales: "I'm your sales assistant! I can help with lead analysis, call preparation, email drafting, and objection handling. What would you like to work on?",
      manager: "I'm your management assistant! I can provide team insights, performance analysis, and strategic recommendations. How can I help you today?"
    }
  }
};
