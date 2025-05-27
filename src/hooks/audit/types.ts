
export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  outcome: 'success' | 'failure' | 'unauthorized';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuditPayload {
  auditEntry: {
    timestamp: string;
    userId: string;
    userRole: string;
    action: string;
    resource: string;
    details: any;
    ipAddress?: string;
    userAgent?: string;
    outcome: 'success' | 'failure' | 'unauthorized';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  outcome: 'success' | 'failure' | 'unauthorized';
}

export interface AuditFilters {
  userId?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  riskLevel?: string;
}
