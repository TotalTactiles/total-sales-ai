
// Core automation type definitions with strict limits
export interface AutomationAction {
  id: string;
  type: 'email' | 'sms' | 'task' | 'note' | 'call' | 'calendar';
  content: string;
  delay?: number; // hours
  conditions?: AutomationCondition[];
  metadata?: Record<string, string>;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: string | number | boolean;
}

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[]; // Max 10 actions
  isActive: boolean;
  companyId: string;
  createdBy: string;
  industry?: string;
  metadata?: Record<string, string>;
}

export interface AutomationTrigger {
  type: 'lead_created' | 'lead_updated' | 'call_completed' | 'email_opened' | 'custom' | 'time_based';
  conditions: AutomationCondition[];
  delay?: number; // hours
}

export interface AutomationExecution {
  id: string;
  flowId: string;
  leadId?: string;
  userId: string;
  companyId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  currentActionIndex: number;
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  logs: AutomationLog[];
}

export interface AutomationLog {
  timestamp: Date;
  action: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  data?: Record<string, any>;
}

export interface AutomationLimits {
  maxFlowsPerUser: number;
  maxActionsPerFlow: number;
  maxExecutionsPerHour: number;
  maxChainDepth: number;
}

export const DEFAULT_AUTOMATION_LIMITS: AutomationLimits = {
  maxFlowsPerUser: 10,
  maxActionsPerFlow: 10,
  maxExecutionsPerHour: 100,
  maxChainDepth: 3
};

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  industry?: string;
  companyId: string;
}

export interface AutomationResult {
  success: boolean;
  message: string;
  data?: any;
  warnings?: string[];
}
