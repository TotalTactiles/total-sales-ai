
// Core AI system types
export interface AIIngestionEvent {
  id: string;
  timestamp: Date;
  processed: boolean;
  user_id: string;
  company_id: string;
  event_type: 'user_action' | 'ai_output' | 'crm_sync' | 'email_interaction' | 'call_activity' | 'social_media' | 'website_data' | 'external_data';
  source: string;
  data: any;
  context?: Record<string, any>;
}

export interface AIRecommendation {
  id: string;
  type: 'optimization' | 'feature_request' | 'bug_report' | 'performance' | 'security';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  impact: string;
  implementation: string;
  userId: string;
  companyId: string;
  timestamp: Date;
  resolved: boolean;
}

export interface AIInsight {
  id: string;
  type: 'recommendation' | 'trend' | 'alert' | 'optimization' | 'performance';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  metadata?: Record<string, any>;
  company_id: string;
  user_id: string;
  timestamp: Date;
}

export interface AIResponse {
  response: string;
  model: string;
  provider: string;
  confidence?: number;
  usage?: {
    tokens: number;
    cost?: number;
  };
}
