
import { accessControlService } from './accessControlService';
import { authenticationAuditor } from './audit/authenticationAuditor';
import { apiSecurityAuditor } from './audit/apiSecurityAuditor';
import { dataAccessAuditor } from './audit/dataAccessAuditor';
import { clientSecurityAuditor } from './audit/clientSecurityAuditor';
import { securityScoreCalculator } from './audit/securityScoreCalculator';
import type { SecurityAuditResult, SecurityIssue, SecurityMetrics } from './audit/types';

// Re-export types for backward compatibility
export type { SecurityAuditResult, SecurityIssue };

export class SecurityAuditService {
  private static instance: SecurityAuditService;

  static getInstance(): SecurityAuditService {
    if (!SecurityAuditService.instance) {
      SecurityAuditService.instance = new SecurityAuditService();
    }
    return SecurityAuditService.instance;
  }

  async runSecurityAudit(): Promise<SecurityAuditResult> {
    const issues: SecurityIssue[] = [];

    // Run all security audits
    await authenticationAuditor.auditAuthentication(issues);
    await apiSecurityAuditor.auditAPIKeySecurity(issues);
    await dataAccessAuditor.auditDataAccess(issues);
    await clientSecurityAuditor.auditClientSecurity(issues);

    const score = securityScoreCalculator.calculateSecurityScore(issues);
    const passed = score >= 80 && !issues.some(i => i.severity === 'critical');

    // Log audit results
    accessControlService.logSecurityEvent('Security audit completed', {
      score,
      passed,
      issuesCount: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length
    }, passed ? 'low' : 'high');

    return { passed, issues, score };
  }

  async getSecurityMetrics(companyId: string): Promise<SecurityMetrics> {
    try {
      // This would typically be stored in a security_audits table
      // For now, we'll return default values
      return {
        auditScore: 85,
        lastAuditDate: new Date(),
        issueCount: 0,
        criticalIssues: 0
      };
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return {
        auditScore: 0,
        lastAuditDate: null,
        issueCount: 0,
        criticalIssues: 0
      };
    }
  }
}

export const securityAuditService = SecurityAuditService.getInstance();
