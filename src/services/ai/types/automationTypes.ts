
// Core automation type definitions with strict depth limits
export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: string | number | boolean;
}

// Base action without recursion
export interface BaseAutomationAction {
  id: string;
  type: 'email' | 'sms' | 'task' | 'note' | 'call' | 'calendar';
  content: string;
  delay?: number; // hours
  conditions?: AutomationCondition[];
  metadata?: Record<string, string>;
}

// Level 2 actions (deepest level)
export interface AutomationActionLevel2 extends BaseAutomationAction {
  // No next actions - this is the deepest level
}

// Level 1 actions (can reference level 2)
export interface AutomationActionLevel1 extends BaseAutomationAction {
  nextActions?: AutomationActionLevel2[];
}

// Top level actions (can reference level 1)
export interface AutomationAction extends BaseAutomationAction {
  nextActions?: AutomationActionLevel1[];
}

export interface AutomationTrigger {
  type: 'lead_created' | 'lead_updated' | 'call_completed' | 'email_opened' | 'custom' | 'time_based';
  conditions: AutomationCondition[];
  delay?: number; // hours
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

// Simplified execution types
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

// JSON-compatible types for database storage
export interface JsonAutomationAction {
  id: string;
  type: string;
  content: string;
  delay?: number;
  conditions?: Array<{
    field: string;
    operator: string;
    value: string | number | boolean;
  }>;
  metadata?: Record<string, string>;
  nextActions?: JsonAutomationAction[];
}

export interface JsonAutomationFlow {
  id: string;
  createdBy: string;
  createdAt: string;
  name: string;
  trigger: {
    type: string;
    conditions: Array<{
      field: string;
      operator: string;
      value: string | number | boolean;
    }>;
    delay?: number;
  };
  actions: JsonAutomationAction[];
  isActive: boolean;
  companyId: string;
  industry?: string;
  metadata: Record<string, string>;
}

export interface JsonAutomationExecution {
  id: string;
  flowId: string;
  leadId?: string;
  userId: string;
  companyId: string;
  status: string;
  currentActionIndex: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
  logs: Array<{
    timestamp: string;
    action: string;
    status: string;
    message: string;
    data?: Record<string, any>;
  }>;
}
