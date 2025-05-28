
import { supabase } from '@/integrations/supabase/client';
import { SecurityIssue } from './types';

export class AuthenticationAuditor {
  async auditAuthentication(issues: SecurityIssue[]): Promise<void> {
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
}

export const authenticationAuditor = new AuthenticationAuditor();
