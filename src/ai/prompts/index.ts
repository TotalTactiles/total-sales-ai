
// Centralized AI Prompts Management
export const AI_PROMPTS = {
  VOICE_ASSISTANT: {
    SYSTEM: `You are TSAM, a helpful AI assistant for sales teams. Respond concisely and professionally.`,
    COMMANDS: {
      HELP: "Available commands: schedule meeting, draft email, analyze lead, get insights",
      SCHEDULE: "I'll help you schedule a meeting. What's the context?",
      ANALYZE: "I'll analyze the lead data for you. Gathering information...",
      DRAFT: "I'll draft an email for you. Who is the recipient?"
    }
  },
  
  EMAIL_GENERATION: {
    COLD_OUTREACH: `Draft a professional cold outreach email that:
    - Is personalized and relevant
    - Clearly states value proposition
    - Includes a clear call to action
    - Maintains professional tone`,
    
    FOLLOW_UP: `Draft a follow-up email that:
    - References previous interaction
    - Adds new value or insight
    - Is concise and action-oriented
    - Maintains relationship focus`,
    
    PROPOSAL: `Draft a proposal email that:
    - Summarizes discussed needs
    - Presents clear solution
    - Includes next steps
    - Professional and persuasive tone`
  },
  
  LEAD_ANALYSIS: {
    SCORING: `Analyze this lead data and provide:
    - Numerical score (1-100)
    - Key insights about fit and timing
    - Specific next action recommendations
    - Risk factors or concerns`,
    
    SUMMARY: `Summarize this lead in a concise paragraph focusing on:
    - Company size and industry
    - Pain points identified
    - Decision timeline
    - Key stakeholders involved`
  },
  
  PERFORMANCE_INSIGHTS: {
    INDIVIDUAL: `Analyze individual performance data and provide:
    - Key strengths and improvement areas
    - Trend analysis and patterns
    - Specific actionable recommendations
    - Goal progress assessment`,
    
    TEAM: `Analyze team performance data and provide:
    - Overall team health assessment
    - Individual contributor highlights
    - Process improvement opportunities
    - Resource allocation recommendations`
  }
};

export const getPrompt = (category: string, type: string): string => {
  const categoryPrompts = AI_PROMPTS[category as keyof typeof AI_PROMPTS];
  if (!categoryPrompts) return '';
  
  return (categoryPrompts as any)[type] || '';
};
