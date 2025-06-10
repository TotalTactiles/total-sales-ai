
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Zap,
  Target,
  MessageSquare,
  Users,
  BarChart3
} from 'lucide-react';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';
import { AgentWorkflow } from '@/services/relevance/RelevanceAIService';

const AgenticWorkflows: React.FC = () => {
  const { workflows, executions, loading, usageStats, executeWorkflow } = useRelevanceAI();
  const [selectedWorkflow, setSelectedWorkflow] = useState<AgentWorkflow | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'draft': return <Clock className="h-4 w-4 text-gray-600" />;
      default: return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'lead_followup': return 'bg-blue-100 text-blue-800';
      case 'objection_handling': return 'bg-purple-100 text-purple-800';
      case 'pipeline_automation': return 'bg-green-100 text-green-800';
      case 'analysis': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExecuteWorkflow = async (workflow: AgentWorkflow) => {
    const input = {
      timestamp: new Date().toISOString(),
      context: 'manual_execution'
    };
    
    await executeWorkflow(workflow.id, input);
  };

  return (
    <div className="space-y-6">
      {/* Usage Stats Header */}
      {usageStats && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Relevance AI Usage</span>
                <Badge className={`${usageStats.currentTier === 'Basic' ? 'bg-gray-100 text-gray-800' : 
                  usageStats.currentTier === 'Pro' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                  {usageStats.currentTier}
                </Badge>
              </div>
              <div className="text-sm text-blue-700">
                {usageStats.requestsUsed} / {usageStats.requestsLimit} requests
              </div>
            </div>
            <Progress value={usageStats.percentageUsed} className="h-2" />
            {usageStats.percentageUsed >= 90 && usageStats.canUpgrade && (
              <div className="mt-2 text-xs text-orange-600">
                ⚠️ Approaching usage limit. Consider upgrading your plan.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">
            <Bot className="h-4 w-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="executions">
            <Zap className="h-4 w-4 mr-2" />
            Executions
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Workflows</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedWorkflow(workflow)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{workflow.name}</CardTitle>
                    {getStatusIcon(workflow.status)}
                  </div>
                  <Badge className={getCategoryColor(workflow.category)} variant="secondary">
                    {workflow.category.replace('_', ' ')}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3">{workflow.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Success Rate</span>
                      <span className="font-medium text-green-600">{workflow.successRate}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Last Run</span>
                      <span className="text-gray-700">
                        {new Date(workflow.lastRun).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExecuteWorkflow(workflow);
                      }}
                      disabled={loading}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Executions</h3>
          
          <div className="space-y-2">
            {executions.map((execution) => (
              <Card key={execution.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        execution.status === 'completed' ? 'bg-green-500' :
                        execution.status === 'failed' ? 'bg-red-500' :
                        execution.status === 'running' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{execution.workflowId}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(execution.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={execution.status === 'completed' ? 'default' : 
                                  execution.status === 'failed' ? 'destructive' : 'secondary'}>
                      {execution.status}
                    </Badge>
                  </div>
                  
                  {execution.error && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                      {execution.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Workflow Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{executions.length}</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((executions.filter(e => e.status === 'completed').length / executions.length) * 100) || 0}%
                </div>
                <p className="text-xs text-gray-500">Overall performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {workflows.filter(w => w.status === 'active').length}
                </div>
                <p className="text-xs text-gray-500">Currently running</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgenticWorkflows;
