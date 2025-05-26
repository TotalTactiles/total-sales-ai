
// Simplified automation flow types to prevent deep recursion
export interface SimpleAutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: string | number | boolean;
}

export interface SimpleAutomationTrigger {
  type: string;
  conditions: SimpleAutomationCondition[];
  delay?: number;
}

export interface SimpleAutomationAction {
  id: string;
  type: string;
  content: string;
  delay?: number;
  conditions?: SimpleAutomationCondition[];
  metadata?: Record<string, string>;
}

export interface SimpleAutomationFlow {
  id: string;
  name: string;
  trigger: SimpleAutomationTrigger;
  actions: SimpleAutomationAction[];
  isActive: boolean;
  companyId: string;
  createdBy: string;
}

export interface FlowExecutionContext {
  leadId?: string;
  email?: string;
  phone?: string;
  name?: string;
  userId: string;
  companyId: string;
  timestamp: string;
}
