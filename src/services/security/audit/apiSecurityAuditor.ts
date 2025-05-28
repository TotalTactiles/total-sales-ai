
import { SecurityIssue } from './types';

export class ApiSecurityAuditor {
  async auditAPIKeySecurity(issues: SecurityIssue[]): Promise<void> {
    this.checkLocalStorageForApiKeys(issues);
    this.checkSessionStorageForApiKeys(issues);
  }

  private checkLocalStorageForApiKeys(issues: SecurityIssue[]): void {
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
  }

  private checkSessionStorageForApiKeys(issues: SecurityIssue[]): void {
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
}

export const apiSecurityAuditor = new ApiSecurityAuditor();
