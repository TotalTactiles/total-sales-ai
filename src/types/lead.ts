
export interface Lead {
  id: string;
  name: string;
  company: string;
  source: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  lastContact?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  objection?: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  tags: string[];
  isSensitive: boolean;
  conversionLikelihood: number;
  speedToLead?: number; // minutes since lead creation
  leadSource?: 'marketing' | 'referral' | 'cold_outreach' | 'website';
  autopilotEnabled?: boolean;
  lastCallOutcome?: 'connected' | 'voicemail' | 'no_answer' | 'busy' | 'declined';
  timezonePref?: string;
  doNotCall?: boolean;
}

export interface CallWorkflow {
  id: string;
  name: string;
  industry: string;
  steps: WorkflowStep[];
  aiOptimized: boolean;
  successRate: number;
}

export interface WorkflowStep {
  id: string;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'wait';
  timing: string; // e.g., "immediately", "2 hours", "1 day"
  template?: string;
  aiGenerated: boolean;
}
