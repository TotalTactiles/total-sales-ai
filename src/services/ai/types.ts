
export interface AIIngestionEvent {
  id?: string;
  user_id: string;
  company_id: string;
  event_type: 'user_action' | 'crm_sync' | 'email_interaction' | 'call_activity' | 'social_media' | 'website_data' | 'ai_output' | 'external_data';
  source: string;
  data: Record<string, any>;
  context?: Record<string, any>;
  timestamp: Date;
  processed: boolean;
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'recommendation' | 'optimization' | 'alert' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  metadata: Record<string, any>;
  user_id?: string;
  company_id: string;
  timestamp: Date;
}

export interface AIRecommendation {
  id: string;
  type: 'lead_action' | 'timing' | 'content' | 'automation' | 'coaching' | 'strategy';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  suggested_action: string;
  context: Record<string, any>;
  confidence: number;
  expires_at?: Date;
  user_id: string;
  company_id: string;
  accepted?: boolean;
  executed?: boolean;
  timestamp: Date;
}
