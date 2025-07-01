
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Route, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { smartLeadReassignmentService } from '@/automations/manager/smartLeadReassign';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface PendingReassignment {
  leadId: string;
  leadName: string;
  currentRep?: string;
  suggestedRep: string;
  reason: string;
  confidence: number;
  urgency: 'low' | 'medium' | 'high';
}

interface RepWorkload {
  repId: string;
  repName: string;
  currentLeads: number;
  capacity: number;
  utilization: number;
  status: 'available' | 'busy' | 'overloaded';
}

const SmartLeadRouter: React.FC = () => {
  const { profile } = useAuth();
  const [pendingReassignments, setPendingReassignments] = useState<PendingReassignment[]>([]);
  const [repWorkloads, setRepWorkloads] = useState<RepWorkload[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile?.company_id) {
      loadRouterData();
      // Refresh every 2 minutes
      const interval = setInterval(loadRouterData, 120000);
      return () => clearInterval(interval);
    }
  }, [profile?.company_id]);

  const loadRouterData = async () => {
    if (!profile?.company_id) return;

    try {
      setIsLoading(true);
      await Promise.all([
        loadPendingReassignments(),
        loadRepWorkloads()
      ]);
    } catch (error) {
      logger.error('Failed to load router data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingReassignments = async () => {
    if (!profile?.company_id) return;

    try {
      // Get leads that might need reassignment
      const { data: leads } = await supabase
        .from('leads')
        .select(`
          id,
          name,
          status,
          assigned_rep,
          last_contact,
          created_at,
          profiles!leads_assigned_rep_fkey(full_name)
        `)
        .eq('company_id', profile.company_id)
        .in('status', ['new', 'contacted', 'qualified'])
        .order('created_at', { ascending: false });

      if (!leads) return;

      const pending: PendingReassignment[] = [];

      for (const lead of leads) {
        // Check if lead needs reassignment
        const needsReassignment = await checkIfNeedsReassignment(lead);
        
        if (needsReassignment) {
          // Get suggested reassignment
          const suggestion = await smartLeadReassignmentService.evaluateReassignment(
            lead.id,
            profile.company_id,
            needsReassignment.trigger
          );

          if (suggestion) {
            // Get suggested rep name
            const { data: suggestedRep } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', suggestion.toRepId)
              .single();

            pending.push({
              leadId: lead.id,
              leadName: lead.name || 'Unnamed Lead',
              currentRep: (lead.profiles as any)?.full_name,
              suggestedRep: suggestedRep?.full_name || 'Unknown Rep',
              reason: suggestion.reason,
              confidence: suggestion.confidence,
              urgency: needsReassignment.urgency
            });
          }
        }
      }

      setPendingReassignments(pending);

    } catch (error) {
      logger.error('Failed to load pending reassignments:', error);
    }
  };

  const checkIfNeedsReassignment = async (lead: any): Promise<{ trigger: string; urgency: 'low' | 'medium' | 'high' } | null> => {
    const now = new Date();
    const createdAt = new Date(lead.created_at);
    const lastContact = lead.last_contact ? new Date(lead.last_contact) : null;

    // Check for stale leads (no contact in 7 days)
    if (lastContact && (now.getTime() - lastContact.getTime()) > 7 * 24 * 60 * 60 * 1000) {
      return { trigger: 'stale', urgency: 'high' };
    }

    // Check for uncontacted leads (new for > 2 hours)
    if (lead.status === 'new' && (now.getTime() - createdAt.getTime()) > 2 * 60 * 60 * 1000) {
      return { trigger: 'unresponsive', urgency: 'medium' };
    }

    // Check if assigned rep is overloaded
    if (lead.assigned_rep) {
      const { count: repLeadCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .eq('assigned_rep', lead.assigned_rep)
        .in('status', ['new', 'contacted', 'qualified']);

      if (repLeadCount && repLeadCount > 50) {
        return { trigger: 'incorrect_assignment', urgency: 'low' };
      }
    }

    return null;
  };

  const loadRepWorkloads = async () => {
    if (!profile?.company_id) return;

    try {
      // Get all sales reps
      const { data: reps } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('company_id', profile.company_id)
        .eq('role', 'sales_rep');

      if (!reps) return;

      const workloads: RepWorkload[] = [];

      for (const rep of reps) {
        // Count current assigned leads
        const { count: currentLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact' })
          .eq('assigned_rep', rep.id)
          .in('status', ['new', 'contacted', 'qualified']);

        const capacity = 50; // Standard capacity
        const utilization = currentLeads ? (currentLeads / capacity) * 100 : 0;
        
        let status: 'available' | 'busy' | 'overloaded' = 'available';
        if (utilization > 100) status = 'overloaded';
        else if (utilization > 70) status = 'busy';

        workloads.push({
          repId: rep.id,
          repName: rep.full_name || 'Unknown Rep',
          currentLeads: currentLeads || 0,
          capacity,
          utilization: Math.round(utilization),
          status
        });
      }

      setRepWorkloads(workloads.sort((a, b) => b.utilization - a.utilization));

    } catch (error) {
      logger.error('Failed to load rep workloads:', error);
    }
  };

  const executeReassignment = async (leadId: string) => {
    if (!profile?.company_id) return;

    try {
      setIsProcessing(true);

      const result = await smartLeadReassignmentService.evaluateReassignment(
        leadId,
        profile.company_id,
        'manual_trigger'
      );

      if (result) {
        toast.success('Lead reassigned successfully');
        // Remove from pending list
        setPendingReassignments(prev => prev.filter(p => p.leadId !== leadId));
        // Refresh workloads
        await loadRepWorkloads();
      } else {
        toast.error('Unable to find better assignment for this lead');
      }

    } catch (error) {
      logger.error('Failed to execute reassignment:', error);
      toast.error('Failed to reassign lead');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAllReassignments = async () => {
    if (!profile?.company_id) return;

    try {
      setIsProcessing(true);
      let successCount = 0;

      for (const reassignment of pendingReassignments) {
        try {
          const result = await smartLeadReassignmentService.evaluateReassignment(
            reassignment.leadId,
            profile.company_id,
            'bulk_reassignment'
          );

          if (result) {
            successCount++;
          }
        } catch (error) {
          logger.error(`Failed to reassign lead ${reassignment.leadId}:`, error);
        }
      }

      toast.success(`Successfully reassigned ${successCount} leads`);
      await loadRouterData();

    } catch (error) {
      logger.error('Failed to execute bulk reassignment:', error);
      toast.error('Failed to complete bulk reassignment');
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case 'busy': return <Badge variant="secondary">Busy</Badge>;
      default: return <Badge variant="destructive">Overloaded</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Smart Lead Router
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Lead Router</h2>
          <p className="text-gray-600">Optimize lead assignments for maximum conversion</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={loadRouterData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {pendingReassignments.length > 0 && (
            <Button 
              onClick={executeAllReassignments}
              disabled={isProcessing}
              size="sm"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Execute All ({pendingReassignments.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reassignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Reassignments ({pendingReassignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingReassignments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No reassignments needed at this time
              </div>
            ) : (
              pendingReassignments.map((reassignment) => (
                <div key={reassignment.leadId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{reassignment.leadName}</div>
                    {getUrgencyBadge(reassignment.urgency)}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{reassignment.currentRep || 'Unassigned'}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-medium">{reassignment.suggestedRep}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    {reassignment.reason}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      Confidence: {Math.round(reassignment.confidence * 100)}%
                    </div>
                    <Button 
                      onClick={() => executeReassignment(reassignment.leadId)}
                      disabled={isProcessing}
                      size="sm"
                    >
                      Reassign
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Rep Workloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rep Workloads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {repWorkloads.map((workload) => (
              <div key={workload.repId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{workload.repName}</div>
                  {getStatusBadge(workload.status)}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{workload.currentLeads} / {workload.capacity} leads</span>
                  <span>{workload.utilization}%</span>
                </div>

                <Progress 
                  value={workload.utilization} 
                  className={`h-2 ${
                    workload.utilization > 100 ? 'text-red-500' : 
                    workload.utilization > 70 ? 'text-yellow-500' : 
                    'text-green-500'
                  }`} 
                />
              </div>
            ))}

            {repWorkloads.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No sales reps found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartLeadRouter;
