
import { SecurityIssue } from './types';

export class ClientSecurityAuditor {
  async auditClientSecurity(issues: SecurityIssue[]): Promise<void> {
    this.checkForSensitiveLogging(issues);
    this.checkHttpsUsage(issues);
    this.checkContentSecurityPolicy(issues);
  }

  private checkForSensitiveLogging(issues: SecurityIssue[]): void {
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
  }

  private checkHttpsUsage(issues: SecurityIssue[]): void {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      issues.push({
        severity: 'critical',
        category: 'client_security',
        description: 'Application not served over HTTPS',
        recommendation: 'Enable HTTPS for all production traffic',
        location: 'Protocol'
      });
    }
  }

  private checkContentSecurityPolicy(issues: SecurityIssue[]): void {
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
}

export const clientSecurityAuditor = new ClientSecurityAuditor();
