
// Enhanced lead type that includes all necessary fields with consistent camelCase naming
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  status: 'qualified' | 'contacted' | 'new' | 'closed' | 'proposal' | 'negotiation';
  score: number;
  priority: 'high' | 'medium' | 'low';
  source: string;
  tags: string[];
  notes: string;
  lastContact: string;
  last_contact?: string; // Alternative naming for database compatibility
  nextFollowUp?: string;
  value: number;
  conversionLikelihood: number;
  conversion_likelihood?: number; // Alternative naming for database compatibility
  industry?: string;
  employeeCount?: number;
  location?: string;
  timezone?: string;
  speedToLead?: number;
  speed_to_lead?: number; // Alternative naming for database compatibility
  isSensitive?: boolean;
  is_sensitive?: boolean; // Alternative naming for database compatibility
  doNotCall?: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'very_positive';
  objection?: string;
  created_at?: string;
  updated_at?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
  };
  customFields?: {
    currentSolution?: string;
    painPoints?: string[];
    decisionCriteria?: string[];
    budget?: string;
    timeline?: string;
  };
}

// Database lead type for Supabase integration
export interface DatabaseLead extends Lead {
  last_contact: string;
  speed_to_lead: number;
  is_sensitive: boolean;
  created_at: string;
  updated_at: string;
}

// Mock lead type for development
export interface MockLead extends Lead {
  lastContact: string;
}

// Workflow types for AutoDialer
export interface CallWorkflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowStep {
  id: string;
  type: 'call' | 'email' | 'sms' | 'wait' | 'condition';
  action: string;
  delay?: number;
  condition?: string;
}
