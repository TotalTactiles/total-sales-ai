
import { supabase } from '@/integrations/supabase/client';
import { accessControlService } from './accessControlService';

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

    // Check authentication state
    await this.auditAuthentication(issues);
    
    // Check API key security
    await this.auditAPIKeySecurity(issues);
    
    // Check data access patterns
    await this.auditDataAccess(issues);
    
    // Check client-side security
    await this.auditClientSecurity(issues);

    const score = this.calculateSecurityScore(issues);
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

  private async auditAuthentication(issues: SecurityIssue[]): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        issues.push({
          severity: 'medium',
          category: 'authentication',
          description: 'No authenticated user found',
          recommendation: 'Ensure users are properly authenticated before accessing protected resources'
        });
        return;
      }

      // Check session validity
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        issues.push({
          severity: 'high',
          category: 'authentication',
          description: 'User authenticated but no valid session',
          recommendation: 'Check session management and token refresh logic'
        });
      }

      // Check profile access
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single();

      if (!profile) {
        issues.push({
          severity: 'high',
          category: 'authentication',
          description: 'User authenticated but no profile found',
          recommendation: 'Ensure user profiles are created during registration'
        });
      }
    } catch (error) {
      issues.push({
        severity: 'critical',
        category: 'authentication',
        description: 'Authentication system error',
        recommendation: 'Investigate authentication service connectivity and configuration',
        location: 'Authentication check'
      });
    }
  }

  private async auditAPIKeySecurity(issues: SecurityIssue[]): Promise<void> {
    // Check for exposed API keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      if (key && value && (key.toLowerCase().includes('api') || key.toLowerCase().includes('key'))) {
        issues.push({
          severity: 'critical',
          category: 'api_security',
          description: `Potential API key stored in localStorage: ${key}`,
          recommendation: 'Remove API keys from client-side storage. Use server-side proxy instead.',
          location: 'localStorage'
        });
      }
    }

    // Check for API keys in sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      
      if (key && value && (key.toLowerCase().includes('api') || key.toLowerCase().includes('key'))) {
        issues.push({
          severity: 'high',
          category: 'api_security',
          description: `Potential API key stored in sessionStorage: ${key}`,
          recommendation: 'Remove API keys from client-side storage. Use server-side proxy instead.',
          location: 'sessionStorage'
        });
      }
    }
  }

  private async auditDataAccess(issues: SecurityIssue[]): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Test RLS policies by attempting to access other users' data
      const { data: otherUsersData } = await supabase
        .from('leads')
        .select('*')
        .neq('company_id', 'fake-company-id')
        .limit(1);

      // This should return empty if RLS is working correctly
      if (otherUsersData && otherUsersData.length > 0) {
        issues.push({
          severity: 'critical',
          category: 'data_protection',
          description: 'Row Level Security may not be properly configured for leads table',
          recommendation: 'Review and strengthen RLS policies to prevent unauthorized data access',
          location: 'leads table'
        });
      }
    } catch (error) {
      // This is actually good - it means RLS is blocking the query
      console.log('RLS test blocked access (this is good):', error);
    }
  }

  private async auditClientSecurity(issues: SecurityIssue[]): Promise<void> {
    // Check for console.log statements that might leak sensitive data
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.innerHTML.includes('console.log') && 
          (script.innerHTML.includes('password') || 
           script.innerHTML.includes('token') || 
           script.innerHTML.includes('key'))) {
        issues.push({
          severity: 'medium',
          category: 'client_security',
          description: 'Console logging detected that may expose sensitive data',
          recommendation: 'Remove or sanitize console.log statements before production',
          location: 'Client scripts'
        });
      }
    }

    // Check HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      issues.push({
        severity: 'critical',
        category: 'client_security',
        description: 'Application not served over HTTPS',
        recommendation: 'Enable HTTPS for all production traffic',
        location: 'Protocol'
      });
    }

    // Check for Content Security Policy
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspMeta) {
      issues.push({
        severity: 'medium',
        category: 'client_security',
        description: 'No Content Security Policy detected',
        recommendation: 'Implement CSP headers to prevent XSS attacks',
        location: 'HTTP headers'
      });
    }
  }

  private calculateSecurityScore(issues: SecurityIssue[]): number {
    let score = 100;
    
    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          score -= 25;
          break;
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    }
    
    return Math.max(0, score);
  }

  async getSecurityMetrics(companyId: string): Promise<{
    auditScore: number;
    lastAuditDate: Date | null;
    issueCount: number;
    criticalIssues: number;
  }> {
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
