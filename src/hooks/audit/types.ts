
export interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resource: string;
  details: any;
  outcome: 'success' | 'failure' | 'unauthorized';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditFilters {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  action?: string;
  resource?: string;
  outcome?: 'success' | 'failure' | 'unauthorized';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuditPayload {
  auditEntry: {
    timestamp: string;
    userId: string;
    userRole: string;
    action: string;
    resource: string;
    details: string; // encrypted JSON string
    outcome: 'success' | 'failure' | 'unauthorized';
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    ipAddress?: string;
    userAgent?: string;
  };
  riskLevel: string;
  outcome: string;
}
