
export interface SecurityEvent {
  id: string;
  type: 'threat_detection' | 'access_violation' | 'data_breach' | 'authentication_failure' | 'rate_limit' | 'unusual_pattern';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  resolved: boolean;
  source?: string;
  affectedResource?: string;
}

export interface SecurityIssue {
  type: 'access_control' | 'encryption' | 'data_integrity' | 'authentication' | 'network_security';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  description: string;
  recommendation: string;
}

export interface SecurityPosture {
  score: number;
  level: 'critical' | 'warning' | 'secure';
  issues: SecurityIssue[];
  lastScan: Date | null;
  isScanning: boolean;
}

export interface WorkflowLimits {
  maxWorkflows: number;
  currentWorkflows: number;
  maxExecutionTime: number;
  maxMemoryUsage: number;
}

export interface ThreatIntelligence {
  id: string;
  source: string;
  threatType: string;
  confidence: number;
  description: string;
  mitigationSteps: string[];
  timestamp: Date;
}
