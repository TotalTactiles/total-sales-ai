
export interface SecurityAuditResult {
  passed: boolean;
  issues: SecurityIssue[];
  score: number;
}

export interface SecurityIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_protection' | 'api_security' | 'client_security';
  description: string;
  recommendation: string;
  location?: string;
}

export interface SecurityMetrics {
  auditScore: number;
  lastAuditDate: Date | null;
  issueCount: number;
  criticalIssues: number;
}
