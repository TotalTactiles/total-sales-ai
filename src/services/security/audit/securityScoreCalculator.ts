
import { SecurityIssue } from './types';

export class SecurityScoreCalculator {
  calculateSecurityScore(issues: SecurityIssue[]): number {
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
}

export const securityScoreCalculator = new SecurityScoreCalculator();
