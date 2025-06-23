
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, User, Shield } from 'lucide-react';
import { logger } from '@/utils/logger';

interface DebugInfo {
  auth: {
    hasUser: boolean;
    hasSession: boolean;
    userId?: string;
    userEmail?: string;
    sessionValid: boolean;
    sessionExpiry?: string;
  };
  profile: {
    hasProfile: boolean;
    profileId?: string;
    role?: string;
    fullName?: string;
  };
  database: {
    canQueryProfiles: boolean;
    canQueryAIBrainLogs: boolean;
    rlsStatus: string;
  };
  system: {
    supabaseUrl: string;
    hasAnonKey: boolean;
    timestamp: string;
  };
}

const DebugSupabaseStatus: React.FC = () => {
  const { user, profile, session } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      logger.info('Running Supabase diagnostics...', {}, 'debug');
      
      // Test database queries
      let canQueryProfiles = false;
      let canQueryAIBrainLogs = false;
      let rlsStatus = 'unknown';
      
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        canQueryProfiles = !profileError;
        if (profileError) {
          logger.error('Profile query error:', profileError, 'debug');
          if (profileError.message.includes('infinite recursion')) {
            rlsStatus = 'infinite_recursion_detected';
          } else {
            rlsStatus = 'rls_error';
          }
        } else {
          rlsStatus = 'working';
        }
      } catch (err) {
        logger.error('Profile query exception:', err, 'debug');
        rlsStatus = 'query_failed';
      }
      
      try {
        const { error: aiError } = await supabase
          .from('ai_brain_logs')
          .select('count')
          .limit(1);
        
        canQueryAIBrainLogs = !aiError;
        if (aiError) {
          logger.error('AI Brain logs query error:', aiError, 'debug');
        }
      } catch (err) {
        logger.error('AI Brain logs query exception:', err, 'debug');
      }

      const info: DebugInfo = {
        auth: {
          hasUser: !!user,
          hasSession: !!session,
          userId: user?.id,
          userEmail: user?.email,
          sessionValid: !!session && new Date(session.expires_at * 1000) > new Date(),
          sessionExpiry: session ? new Date(session.expires_at * 1000).toISOString() : undefined
        },
        profile: {
          hasProfile: !!profile,
          profileId: profile?.id,
          role: profile?.role,
          fullName: profile?.full_name || undefined
        },
        database: {
          canQueryProfiles,
          canQueryAIBrainLogs,
          rlsStatus
        },
        system: {
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'fallback-url',
          hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
          timestamp: new Date().toISOString()
        }
      };

      setDebugInfo(info);
      logger.info('Diagnostics completed:', info, 'debug');
      
    } catch (err: any) {
      logger.error('Diagnostics failed:', err, 'debug');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, [user, profile, session]);

  const getStatusBadge = (status: boolean | string, trueLabel = 'OK', falseLabel = 'ERROR') => {
    if (typeof status === 'boolean') {
      return (
        <Badge variant={status ? 'default' : 'destructive'}>
          {status ? trueLabel : falseLabel}
        </Badge>
      );
    }
    
    const variant = status === 'working' ? 'default' : 'destructive';
    return <Badge variant={variant}>{status}</Badge>;
  };

  if (!debugInfo && !loading) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <Button onClick={runDiagnostics}>
            <Database className="mr-2 h-4 w-4" />
            Run Supabase Diagnostics
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Debug Status
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runDiagnostics}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-4">
            Error: {error}
          </div>
        )}

        {debugInfo && (
          <div className="space-y-6">
            {/* Authentication Status */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Authentication
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Has User:</span>
                  {getStatusBadge(debugInfo.auth.hasUser, 'Yes', 'No')}
                </div>
                <div className="flex justify-between">
                  <span>Has Session:</span>
                  {getStatusBadge(debugInfo.auth.hasSession, 'Yes', 'No')}
                </div>
                <div className="flex justify-between">
                  <span>Session Valid:</span>
                  {getStatusBadge(debugInfo.auth.sessionValid, 'Valid', 'Expired')}
                </div>
                <div className="flex justify-between">
                  <span>Has Profile:</span>
                  {getStatusBadge(debugInfo.profile.hasProfile, 'Yes', 'No')}
                </div>
              </div>
              
              {debugInfo.auth.userId && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <div><strong>User ID:</strong> {debugInfo.auth.userId}</div>
                  <div><strong>Email:</strong> {debugInfo.auth.userEmail}</div>
                  {debugInfo.profile.role && <div><strong>Role:</strong> {debugInfo.profile.role}</div>}
                  {debugInfo.auth.sessionExpiry && (
                    <div><strong>Session Expires:</strong> {new Date(debugInfo.auth.sessionExpiry).toLocaleString()}</div>
                  )}
                </div>
              )}
            </div>

            {/* Database Status */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                Database & RLS
              </h4>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>RLS Status:</span>
                  {getStatusBadge(debugInfo.database.rlsStatus)}
                </div>
                <div className="flex justify-between">
                  <span>Can Query Profiles:</span>
                  {getStatusBadge(debugInfo.database.canQueryProfiles, 'Yes', 'No')}
                </div>
                <div className="flex justify-between">
                  <span>Can Query AI Brain Logs:</span>
                  {getStatusBadge(debugInfo.database.canQueryAIBrainLogs, 'Yes', 'No')}
                </div>
              </div>
            </div>

            {/* System Info */}
            <div>
              <h4 className="font-medium mb-2">System Configuration</h4>
              <div className="text-xs text-gray-500">
                <div><strong>Supabase URL:</strong> {debugInfo.system.supabaseUrl}</div>
                <div><strong>Has Anon Key:</strong> {debugInfo.system.hasAnonKey ? 'Yes' : 'No'}</div>
                <div><strong>Last Check:</strong> {new Date(debugInfo.system.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DebugSupabaseStatus;
