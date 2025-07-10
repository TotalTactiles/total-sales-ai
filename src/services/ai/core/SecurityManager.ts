import { logger } from '@/utils/logger';
import { accessControlService } from '@/services/security/accessControlService';

interface SecurityPolicy {
  companyId: string;
  repId: string;
  allowedActions: string[];
  rateLimit: {
    requests: number;
    timeWindow: number; // in milliseconds
  };
  dataAccessRules: {
    canAccessCompanyData: boolean;
    canAccessOtherRepData: boolean;
    restrictedFields: string[];
  };
}

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  companyId: string;
  repId: string;
  action: string;
  resource: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export class SecurityManager {
  private static instance: SecurityManager;
  private rateLimitMap = new Map<string, RateLimitEntry>();
  private auditLog: AuditEntry[] = [];
  private securityPolicies = new Map<string, SecurityPolicy>();
  private readonly DEFAULT_RATE_LIMIT = { requests: 100, timeWindow: 60000 }; // 100 requests per minute

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Initialize security policy for a company/rep
   */
  initializeSecurityPolicy(companyId: string, repId: string, customPolicy?: Partial<SecurityPolicy>): void {
    const defaultPolicy: SecurityPolicy = {
      companyId,
      repId,
      allowedActions: [
        'lead_read', 'lead_update', 'ai_chat', 'call_log', 
        'analytics_view', 'academy_access', 'voice_services'
      ],
      rateLimit: this.DEFAULT_RATE_LIMIT,
      dataAccessRules: {
        canAccessCompanyData: true,
        canAccessOtherRepData: false,
        restrictedFields: ['ssn', 'creditCard', 'salary', 'personalNotes']
      }
    };

    const policy = { ...defaultPolicy, ...customPolicy };
    const policyKey = `${companyId}:${repId}`;
    
    this.securityPolicies.set(policyKey, policy);
    
    logger.info('Security policy initialized', { companyId, repId });
  }

  /**
   * Validate company data isolation
   */
  validateCompanyIsolation(requestingCompanyId: string, targetCompanyId: string): boolean {
    if (requestingCompanyId !== targetCompanyId) {
      this.logSecurityEvent('company_isolation_violation', {
        requestingCompanyId,
        targetCompanyId
      }, 'high');
      
      return false;
    }
    return true;
  }

  /**
   * Validate rep data access
   */
  validateRepAccess(requestingRepId: string, targetRepId: string, companyId: string, action: string): boolean {
    const policy = this.getSecurityPolicy(companyId, requestingRepId);
    
    if (!policy) {
      this.logSecurityEvent('no_security_policy', { requestingRepId, companyId }, 'high');
      return false;
    }

    // Check if action is allowed
    if (!policy.allowedActions.includes(action)) {
      this.logSecurityEvent('unauthorized_action', { 
        requestingRepId, 
        action, 
        allowedActions: policy.allowedActions 
      }, 'medium');
      return false;
    }

    // Check rep access permissions
    if (requestingRepId !== targetRepId && !policy.dataAccessRules.canAccessOtherRepData) {
      this.logSecurityEvent('rep_access_denied', { 
        requestingRepId, 
        targetRepId, 
        action 
      }, 'medium');
      return false;
    }

    return true;
  }

  /**
   * Validate cross-module communication
   */
  validateModuleCommunication(sourceModule: string, targetModule: string, companyId: string, repId: string): boolean {
    // Define allowed module communication patterns
    const allowedCommunications: Record<string, string[]> = {
      'tsam_orchestrator': ['lead_profile_ai', 'lead_management_ai', 'dialer_ai', 'analytics_ai', 'academy_ai'],
      'lead_profile_ai': ['tsam_orchestrator'],
      'lead_management_ai': ['tsam_orchestrator', 'dialer_ai'],
      'dialer_ai': ['tsam_orchestrator', 'lead_profile_ai'],
      'analytics_ai': ['tsam_orchestrator'],
      'academy_ai': ['tsam_orchestrator']
    };

    const allowedTargets = allowedCommunications[sourceModule] || [];
    
    if (!allowedTargets.includes(targetModule)) {
      this.logSecurityEvent('unauthorized_module_communication', {
        sourceModule,
        targetModule,
        companyId,
        repId
      }, 'high');
      return false;
    }

    return true;
  }

  /**
   * Rate limiting enforcement
   */
  async checkRateLimit(companyId: string, repId: string): Promise<boolean> {
    const key = `${companyId}:${repId}`;
    const policy = this.getSecurityPolicy(companyId, repId);
    const rateLimit = policy?.rateLimit || this.DEFAULT_RATE_LIMIT;
    
    const now = Date.now();
    const entry = this.rateLimitMap.get(key);
    
    if (!entry) {
      // First request
      this.rateLimitMap.set(key, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }

    // Check if time window has expired
    if (now - entry.firstRequest > rateLimit.timeWindow) {
      // Reset the counter
      this.rateLimitMap.set(key, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= rateLimit.requests) {
      this.logSecurityEvent('rate_limit_exceeded', {
        companyId,
        repId,
        currentCount: entry.count,
        limit: rateLimit.requests
      }, 'medium');
      return false;
    }

    // Increment counter
    entry.count++;
    entry.lastRequest = now;
    
    return true;
  }

  /**
   * Token-based authentication validation
   */
  validateToken(token: string, companyId: string, repId: string): boolean {
    try {
      // Implement token validation logic
      // This would typically involve JWT verification or similar
      
      if (!token || token.length < 10) {
        this.logSecurityEvent('invalid_token', { companyId, repId }, 'high');
        return false;
      }

      // Additional token validation logic would go here
      return true;
    } catch (error) {
      logger.error('Token validation failed:', error);
      this.logSecurityEvent('token_validation_error', { companyId, repId, error }, 'high');
      return false;
    }
  }

  /**
   * Sanitize data to prevent data leakage
   */
  sanitizeData(data: any, companyId: string, repId: string): any {
    const policy = this.getSecurityPolicy(companyId, repId);
    
    if (!policy) {
      return data;
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      // Remove restricted fields
      for (const field of policy.dataAccessRules.restrictedFields) {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const auditEntry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      companyId: details.companyId || 'unknown',
      repId: details.repId || 'unknown',
      action: event,
      resource: 'security',
      success: false,
      metadata: details
    };

    this.auditLog.push(auditEntry);
    
    // Log to application logger
    logger.warn(`Security Event [${severity.toUpperCase()}]: ${event}`, details);
    
    // Send to external monitoring if critical
    if (severity === 'critical') {
      this.sendCriticalAlert(event, details);
    }

    // Cleanup old audit entries (keep last 10000)
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }
  }

  /**
   * Get security audit log
   */
  getAuditLog(companyId?: string, repId?: string): AuditEntry[] {
    let filteredLog = this.auditLog;
    
    if (companyId) {
      filteredLog = filteredLog.filter(entry => entry.companyId === companyId);
    }
    
    if (repId) {
      filteredLog = filteredLog.filter(entry => entry.repId === repId);
    }
    
    return filteredLog;
  }

  /**
   * Clean up expired rate limit entries
   */
  cleanupRateLimits(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.rateLimitMap.entries()) {
      if (now - entry.lastRequest > this.DEFAULT_RATE_LIMIT.timeWindow * 2) {
        expiredKeys.push(key);
      }
    }
    
    for (const key of expiredKeys) {
      this.rateLimitMap.delete(key);
    }
  }

  // Private helper methods
  private getSecurityPolicy(companyId: string, repId: string): SecurityPolicy | undefined {
    return this.securityPolicies.get(`${companyId}:${repId}`);
  }

  private sendCriticalAlert(event: string, details: any): void {
    // Implement critical alert mechanism (email, SMS, etc.)
    logger.error(`🚨 CRITICAL SECURITY ALERT: ${event}`, details);
  }

  // Cleanup method
  cleanup(): void {
    this.rateLimitMap.clear();
    this.auditLog.length = 0;
    this.securityPolicies.clear();
    logger.info('Security Manager cleaned up');
  }
}

export const securityManager = SecurityManager.getInstance();
