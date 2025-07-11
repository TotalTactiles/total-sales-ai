
export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'threat_detection' | 'access_violation' | 'data_breach' | 'authentication_failure' | 'rate_limit' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  metadata?: any;
}

export interface SecurityIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  timestamp: Date;
  category: string;
}

export interface SecurityPosture {
  overallScore: number;
  lastAssessment: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: number;
  complianceScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface WorkflowLimits {
  maxConcurrentTasks: number;
  maxApiCallsPerMinute: number;
  maxDataProcessingSize: number;
  maxUserSessions: number;
  currentTaskCount: number;
  currentApiCalls: number;
  currentDataSize: number;
  currentSessions: number;
}

export interface SecurityStatus {
  status: string;
  lastCheck: string;
  threatsDetected: number;
  systemHealth: string;
}
