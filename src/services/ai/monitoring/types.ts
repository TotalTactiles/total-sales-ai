
export interface AIInsight {
  id?: string;
  type: 'performance_optimization' | 'lead_scoring' | 'conversation_analysis' | 'workflow_suggestion';
  suggestion_text: string;
  context: Record<string, any>;
  triggered_by: string;
  user_id?: string;
  company_id?: string;
  accepted?: boolean;
}

export interface AILog {
  id?: string;
  event_summary: string;
  type: 'query' | 'training' | 'insight_generation' | 'optimization';
  payload: Record<string, any>;
  company_id?: string;
  visibility: 'admin_only' | 'manager_visible' | 'public';
}

export interface UsageEvent {
  feature: string;
  action: string;
  context: string;
  metadata?: Record<string, any>;
  outcome?: string;
}
