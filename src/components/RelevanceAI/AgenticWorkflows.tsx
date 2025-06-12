
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Settings } from 'lucide-react';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';

const AgenticWorkflows: React.FC = () => {
  const { workflows, isLoading, loadWorkflows, executeWorkflow } = useRelevanceAI();

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const handleExecuteWorkflow = async (workflowId: string) => {
    try {
      await executeWorkflow(workflowId, { 
        trigger: 'manual',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agentic Workflows</h2>
        <Button onClick={loadWorkflows} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                  {workflow.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {workflow.description}
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleExecuteWorkflow(workflow.id)}
                  disabled={isLoading || workflow.status !== 'active'}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Execute
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </div>
              
              {workflow.lastRun && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last run: {workflow.lastRun.toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {workflows.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          No workflows found. Create your first workflow to get started.
        </div>
      )}
    </div>
  );
};

export default AgenticWorkflows;
