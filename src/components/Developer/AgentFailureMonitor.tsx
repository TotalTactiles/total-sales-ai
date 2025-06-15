
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Clock, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AgentFailure {
  id: string;
  task_id: string;
  agent_type: string;
  error_summary: string;
  retry_attempts: number;
  escalated: boolean;
  created_at: string;
  resolved_at?: string;
}

const AgentFailureMonitor: React.FC = () => {
  const { profile } = useAuth();
  const [failures, setFailures] = useState<AgentFailure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.company_id) {
      fetchFailures();
    }
  }, [profile?.company_id]);

  const fetchFailures = async () => {
    if (!profile?.company_id) return;

    try {
      const { data, error } = await supabase
        .from('agent_failures')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setFailures(data || []);
    } catch (error) {
      console.error('Error fetching agent failures:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveFailure = async (failureId: string) => {
    try {
      const { error } = await supabase
        .from('agent_failures')
        .update({ resolved_at: new Date().toISOString() })
        .eq('id', failureId);

      if (error) throw error;
      fetchFailures();
    } catch (error) {
      console.error('Error resolving failure:', error);
    }
  };

  const getAgentColor = (agentType: string) => {
    switch (agentType) {
      case 'salesAgent_v1':
        return 'bg-blue-100 text-blue-800';
      case 'managerAgent_v1':
        return 'bg-green-100 text-green-800';
      case 'automationAgent_v1':
        return 'bg-purple-100 text-purple-800';
      case 'developerAgent_v1':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Failure Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Agent Failure Monitor
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchFailures}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {failures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <div>No agent failures recorded</div>
            <div className="text-sm">All systems operating normally</div>
          </div>
        ) : (
          <div className="space-y-3">
            {failures.map((failure) => (
              <div key={failure.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getAgentColor(failure.agent_type)}>
                      {failure.agent_type}
                    </Badge>
                    {failure.escalated && (
                      <Badge variant="destructive">Escalated</Badge>
                    )}
                    {failure.resolved_at && (
                      <Badge variant="outline" className="text-green-600">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(failure.created_at).toLocaleString()}
                    </span>
                    {!failure.resolved_at && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resolveFailure(failure.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-1">
                  Task ID: {failure.task_id}
                </div>
                
                <div className="text-sm">{failure.error_summary}</div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Retry attempts: {failure.retry_attempts}</span>
                  {failure.resolved_at && (
                    <span>Resolved: {new Date(failure.resolved_at).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentFailureMonitor;
