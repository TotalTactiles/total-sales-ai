
// 🌐 AIInsight unified model

export interface AIInsight {
  id: string;
  type: string;
  suggestion_text: string;
  context: any;
  triggered_by: string;
  accepted: boolean;
  timestamp: string;
}

export interface AIBrainContext {
  insights: AIInsight[];
  isLoading: boolean;
  isAnalyzing: boolean;
  fetchInsights: () => Promise<void>;
  acceptInsight: (insightId: string) => Promise<void>;
  generateInsight: (context: any) => Promise<AIInsight | null>;
  dismissInsight: (insightId: string) => Promise<void>;
  logGhostIntent: (intent: string, details?: string) => void;
  logInteraction: (data: any) => void;
}
