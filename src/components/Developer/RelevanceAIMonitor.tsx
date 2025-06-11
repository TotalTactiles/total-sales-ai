
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Bot, CheckCircle, AlertTriangle, Clock, RefreshCw, Check, X, Brain, Zap, PlayCircle, LineChart, CircleAlert, FileCog, HelpCircle, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { relevanceAIAgent, AgentTask, AgentHealthStatus } from '@/services/relevance/RelevanceAIAgentService';
import { USAGE_TIERS } from '@/services/relevance/RelevanceAIService';

const RelevanceAIMonitor: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('health');
  const [agentStatuses, setAgentStatuses] = useState<AgentHealthStatus[]>([]);
  const [recentTasks, setRecentTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningTest, setRunningTest] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('salesAgent_v1');
  const [selectedTask, setSelectedTask] = useState('lead_analysis');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [pingResult, setPingResult] = useState<{success: boolean; responseTime: number; error?: string} | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id && profile?.company_id) {
      fetchAgentData();
    }
  }, [user?.id, profile?.company_id, activeTab]);

  const fetchAgentData = async () => {
    setLoading(true);
    try {
      // Fetch agent statuses
      const statuses = await relevanceAIAgent.getAllAgentStatuses();
      setAgentStatuses(statuses);
      
      // Fetch recent tasks if on the logs tab
      if (activeTab === 'logs' && profile?.company_id) {
        const tasks = await relevanceAIAgent.getAgentTasks(profile.company_id, 50);
        setRecentTasks(tasks);
      }
    } catch (error) {
      toast.error('Failed to fetch agent data');
      console.error('Error fetching agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAgentData();
    setRefreshing(false);
    toast.success('Agent data refreshed');
  };

  const handlePingTest = async () => {
    try {
      const result = await relevanceAIAgent.pingTest();
      setPingResult(result);
      
      if (result.success) {
        toast.success(`Connection successful: ${result.responseTime}ms`);
      } else {
        toast.error(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Ping test failed');
      setPingResult({
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleRunTest = async () => {
    if (!user?.id || !profile?.company_id) {
      toast.error('User authentication required');
      return;
    }

    setRunningTest(true);
    setTestResult(null);
    
    try {
      let testContext;
      try {
        testContext = testInput ? JSON.parse(testInput) : {};
      } catch (e) {
        testContext = { input: testInput };
      }

      const task = await relevanceAIAgent.executeAgentTask(
        selectedAgent,
        selectedTask,
        testContext,
        user.id,
        profile.company_id
      );

      setTestResult(task);
      
      if (task.status === 'completed') {
        toast.success('Test completed successfully');
      } else {
        toast.error(`Test failed: ${task.error_message}`);
      }
    } catch (error) {
      toast.error('Test execution failed');
      console.error('Test execution error:', error);
    } finally {
      setRunningTest(false);
    }
  };

  const getTaskTypeOptions = (agentType: string) => {
    switch (agentType) {
      case 'salesAgent_v1':
        return [
          { value: 'lead_analysis', label: 'Lead Analysis' },
          { value: 'follow_up_generation', label: 'Follow-up Generation' },
          { value: 'objection_handling', label: 'Objection Handling' },
          { value: 'email_draft', label: 'Email Draft' },
          { value: 'call_summary', label: 'Call Summary' }
        ];
      case 'managerAgent_v1':
        return [
          { value: 'team_analytics', label: 'Team Analytics' },
          { value: 'performance_insights', label: 'Performance Insights' },
          { value: 'workflow_optimization', label: 'Workflow Optimization' }
        ];
      case 'automationAgent_v1':
        return [
          { value: 'email_sequences', label: 'Email Sequences' },
          { value: 'task_automation', label: 'Task Automation' },
          { value: 'pipeline_management', label: 'Pipeline Management' }
        ];
      default:
        return [
          { value: 'generic_task', label: 'Generic Task' }
        ];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'error':
        return 'bg-amber-500';
      case 'maintenance':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
      case 'retrying':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (startDate?: Date, endDate?: Date) => {
    if (!startDate || !endDate) return 'N/A';
    
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const durationMs = end - start;
    
    if (durationMs < 1000) return `${durationMs}ms`;
    return `${(durationMs / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Relevance AI Monitor</h1>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">
            <CheckCircle className="h-4 w-4 mr-2" />
            Health Checks
          </TabsTrigger>
          <TabsTrigger value="test">
            <PlayCircle className="h-4 w-4 mr-2" />
            Agent Tester
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileCog className="h-4 w-4 mr-2" />
            Smart Logs
          </TabsTrigger>
          <TabsTrigger value="usage">
            <LineChart className="h-4 w-4 mr-2" />
            Usage Stats
          </TabsTrigger>
          <TabsTrigger value="docs">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
        </TabsList>

        {/* Health Checks Tab */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agentStatuses.map((agent) => (
              <Card key={agent.agent_name} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    {agent.agent_name}
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)} mr-2`}></span>
                      <Badge variant={agent.status === 'online' ? 'default' : 'outline'}>
                        {agent.status}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {agent.metadata?.description || 'AI Agent'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Health Check:</span>
                      <span>{formatDate(agent.last_health_check)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span>{agent.response_time_ms ? `${agent.response_time_ms}ms` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate:</span>
                      <span>{agent.error_count + agent.success_count > 0 
                        ? `${Math.round((agent.success_count / (agent.error_count + agent.success_count)) * 100)}%` 
                        : 'N/A'}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-muted-foreground font-medium">Capabilities:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {agent.metadata?.capabilities?.map((capability: string) => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    size="sm"
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={() => {
                      setSelectedAgent(agent.agent_name);
                      setActiveTab('test');
                    }}
                  >
                    Test Agent
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Connectivity Test</CardTitle>
              <CardDescription>
                Test connectivity to the Relevance AI API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Button onClick={handlePingTest} variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Ping Test
                </Button>
                
                {pingResult && (
                  <div className="flex items-center">
                    {pingResult.success ? (
                      <div className="flex items-center text-green-500">
                        <Check className="h-5 w-5 mr-2" />
                        <span>Connected ({pingResult.responseTime}ms)</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <X className="h-5 w-5 mr-2" />
                        <span>{pingResult.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Tester Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Execution Tester</CardTitle>
              <CardDescription>
                Test agent workflows with simulated payloads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Select Agent</label>
                  <Select 
                    value={selectedAgent}
                    onValueChange={setSelectedAgent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentStatuses.map((agent) => (
                        <SelectItem key={agent.agent_name} value={agent.agent_name}>
                          {agent.agent_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Select Task Type</label>
                  <Select 
                    value={selectedTask}
                    onValueChange={setSelectedTask}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Task" />
                    </SelectTrigger>
                    <SelectContent>
                      {getTaskTypeOptions(selectedAgent).map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Test Input Payload (JSON or plaintext)</label>
                <Textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder={'{\n  "lead": { "name": "John Doe", "company": "Acme Inc." },\n  "context": "Meeting scheduled for next week"\n}'}
                  className="h-32 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter JSON payload or plaintext input for the agent task
                </p>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleRunTest}
                  disabled={runningTest}
                >
                  {runningTest ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Run Test
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>
                  Task ID: {testResult.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium">Status:</span>
                    <Badge className={`ml-2 ${getTaskStatusColor(testResult.status)}`}>
                      {testResult.status}
                    </Badge>
                  </div>
                  {testResult.error_message && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                      {testResult.error_message}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Started:</span> {formatDate(testResult.started_at)}
                    </div>
                    <div>
                      <span className="font-medium">Completed:</span> {formatDate(testResult.completed_at)}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {formatDuration(testResult.started_at, testResult.completed_at)}
                    </div>
                    <div>
                      <span className="font-medium">Retry Count:</span> {testResult.retry_count}
                    </div>
                  </div>

                  {/* Input Payload */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Input Payload:</h3>
                    <div className="bg-slate-50 p-3 rounded-md overflow-auto max-h-60">
                      <pre className="text-xs font-mono">
                        {JSON.stringify(testResult.input_payload, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Output Payload */}
                  {testResult.output_payload && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Output Payload:</h3>
                      <div className="bg-slate-50 p-3 rounded-md overflow-auto max-h-60">
                        <pre className="text-xs font-mono">
                          {JSON.stringify(testResult.output_payload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRunTest}
                  disabled={runningTest}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Again
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        {/* Task Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Task Execution Logs</CardTitle>
              <CardDescription>
                View and filter recent agent task executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTasks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm font-medium">Task Type</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Agent</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Status</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Started</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Duration</th>
                        <th className="text-left py-2 px-3 text-sm font-medium">Retries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTasks.map((task) => (
                        <tr key={task.id} className="border-b hover:bg-slate-50">
                          <td className="py-2 px-3 text-sm">{task.task_type}</td>
                          <td className="py-2 px-3 text-sm">{task.agent_type}</td>
                          <td className="py-2 px-3">
                            <Badge className={getTaskStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-sm">{formatDate(task.started_at)}</td>
                          <td className="py-2 px-3 text-sm">
                            {task.execution_time_ms ? `${task.execution_time_ms}ms` : formatDuration(task.started_at, task.completed_at)}
                          </td>
                          <td className="py-2 px-3 text-sm">{task.retry_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FileCog className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No task logs found</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Execute some agent tasks to see them logged here
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-xs"
              >
                <RefreshCw className={`h-3 w-3 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Usage Stats Tab */}
        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {USAGE_TIERS.map((tier) => (
              <Card key={tier.name} className={tier.name === 'Basic' ? 'border-blue-200' : ''}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">${tier.price}</span>/month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">{tier.monthlyRequests}</span> requests/month
                    </div>
                    <ul className="space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  {tier.name === 'Basic' ? (
                    <Badge variant="default" className="w-full justify-center py-1">Current Plan</Badge>
                  ) : (
                    <Button variant="outline" className="w-full">Upgrade</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
              <CardDescription>
                Monitor your Relevance AI API usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">API Requests</span>
                    <span className="text-sm">27 / 100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    73 requests remaining this month
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Usage Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 rounded-md">
                      <div className="text-xs text-muted-foreground">Total Tasks</div>
                      <div className="text-lg font-bold">27</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-md">
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                      <div className="text-lg font-bold">93%</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-md">
                      <div className="text-xs text-muted-foreground">Avg. Response Time</div>
                      <div className="text-lg font-bold">853ms</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relevance AI Documentation</CardTitle>
              <CardDescription>
                Learn how to use Relevance AI agents in your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Getting Started</h3>
                <p className="text-sm text-slate-600">
                  Relevance AI provides intelligent agent workflows that can be triggered from various parts of your application. Each agent is specialized for specific tasks and contexts.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Available Agents</h3>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-blue-500" />
                      salesAgent_v1
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Specialized for sales conversations, follow-ups, objection handling, and lead analysis.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Badge variant="outline" className="text-xs justify-center">lead_analysis</Badge>
                      <Badge variant="outline" className="text-xs justify-center">follow_up_generation</Badge>
                      <Badge variant="outline" className="text-xs justify-center">objection_handling</Badge>
                      <Badge variant="outline" className="text-xs justify-center">email_draft</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-purple-500" />
                      managerAgent_v1
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Focused on team analytics, performance insights, and workflow optimization.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Badge variant="outline" className="text-xs justify-center">team_analytics</Badge>
                      <Badge variant="outline" className="text-xs justify-center">performance_insights</Badge>
                      <Badge variant="outline" className="text-xs justify-center">workflow_optimization</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-green-500" />
                      automationAgent_v1
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Handles automated workflows, email sequences, and pipeline management.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Badge variant="outline" className="text-xs justify-center">email_sequences</Badge>
                      <Badge variant="outline" className="text-xs justify-center">task_automation</Badge>
                      <Badge variant="outline" className="text-xs justify-center">pipeline_management</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Integration Points</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Relevance AI agents are integrated throughout the application:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Sales Rep OS: AI Assistant, Dialer, Lead Profile, Smart Actions</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Manager OS: AI Bubble, Team Analytics, Workflow Builder</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                    <span>Automation: Triggers on lead changes, call logs, and status updates</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-lg mb-2">Need Help?</h3>
                <div className="flex items-center gap-4">
                  <Button variant="outline">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelevanceAIMonitor;
