
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high';
  source: string;
  score: number;
  conversionLikelihood: number;
  lastContact: string;
  speedToLead: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  companyId: string;
  isSensitive: boolean;
  sentiment?: string;
  objection?: string;
  doNotCall?: boolean;
  notes?: string;
  value?: number;
  
  // New required properties for Pipeline Pulse
  lastActivity: string;
  aiPriority: 'Low' | 'Medium' | 'High';
  nextAction: string;
  lastAIInsight: string;
}

export interface LeadFilters {
  status?: Lead['status'][];
  priority?: Lead['priority'][];
  source?: string[];
  tags?: string[];
  scoreRange?: [number, number];
  dateRange?: [string, string];
}

export interface LeadSortOptions {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}

export interface WorkflowStep {
  id: string;
  order: number;
  type: 'call' | 'email' | 'wait' | 'condition' | 'sms' | 'meeting';
  action: string;
  timing: string;
  template?: string;
  aiGenerated?: boolean;
}

export interface CallWorkflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  industry?: string;
  aiOptimized?: boolean;
  successRate?: number;
  action: string;
  type: 'call' | 'email' | 'wait' | 'condition' | 'sms' | 'meeting';
  timing: string;
  template?: string;
  aiGenerated?: boolean;
  order?: number;
}

export interface MockLead extends Lead {
  // Mock lead type for compatibility
}

export interface DatabaseLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  priority?: string;
  source?: string;
  score?: number;
  conversion_likelihood?: number;
  last_contact?: string;
  speed_to_lead?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  company_id?: string;
  is_sensitive?: boolean;
  notes?: string;
  value?: number;
}
