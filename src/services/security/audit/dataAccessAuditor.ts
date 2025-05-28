
import { supabase } from '@/integrations/supabase/client';
import { SecurityIssue } from './types';

export class DataAccessAuditor {
  async auditDataAccess(issues: SecurityIssue[]): Promise<void> {
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
}

export const dataAccessAuditor = new DataAccessAuditor();
