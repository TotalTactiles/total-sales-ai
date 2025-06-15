
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Bug, 
  Zap, 
  TestTube,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

const AgentTester: React.FC = () => {
  const { executeAgentTask, isExecuting } = useAgentIntegration();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [customPayload, setCustomPayload] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('salesAgent_v1');
  const [selectedTask, setSelectedTask] = useState('lead_analysis');

  const agents = [
    { id: 'salesAgent_v1', name: 'Sales Agent', color: 'blue' },
    { id: 'managerAgent_v1', name: 'Manager Agent', color: 'purple' },
    { id: 'automationAgent_v1', name: 'Automation Agent', color: 'green' },
    { id: 'developerAgent_v1', name: 'Developer Agent', color: 'orange' }
  ];

  const tasksByAgent = {
    salesAgent_v1: ['lead_analysis', 'follow_up_generation', 'objection_handling', 'email_draft'],
    managerAgent_v1: ['team_summary', 'performance_analysis', 'risk_prediction', 'lead_routing'],
    automationAgent_v1: ['workflow_trigger', 'email_sequence', 'lead_assignment', 'status_update'],
    developerAgent_v1: ['debug_analysis', 'performance_audit', 'test_case_generation']
  };

  const runTestCase = async (testType: 'mock' | 'custom') => {
    const startTime = Date.now();
    
    try {
      let payload;
      if (testType === 'mock') {
        payload = generateMockPayload(selectedAgent, selectedTask);
      } else {
        payload = JSON.parse(customPayload);
      }

      const result = await executeAgentTask(
        selectedAgent as any,
        selectedTask,
        payload
      );

      const endTime = Date.now();
      const testResult = {
        id: Date.now(),
        agent: selectedAgent,
        task: selectedTask,
        success: result?.status === 'completed',
        executionTime: endTime - startTime,
        input: payload,
        output: result?.output_payload,
        error: result?.error_message,
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]);

    } catch (error) {
      const endTime = Date.now();
      const testResult = {
        id: Date.now(),
        agent: selectedAgent,
        task: selectedTask,
        success: false,
        executionTime: endTime - startTime,
        input: testType === 'custom' ? JSON.parse(customPayload) : null,
        output: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]);
    }
  };

  const generateMockPayload = (agent: string, task: string) => {
    const mockPayloads = {
      salesAgent_v1: {
        lead_analysis: {
          lead: {
            id: 'test-lead-123',
            name: 'John Smith',
            company: 'TechCorp Inc',
            email: 'john@techcorp.com',
            phone: '+1-555-0123',
            source: 'website',
            industry: 'technology',
            priority: 'high'
          },
          workspace: 'lead_management'
        },
        follow_up_generation: {
          lead: { name: 'Jane Doe', lastContact: '2024-01-15', status: 'qualified' },
          context: 'demo_completed'
        }
      },
      managerAgent_v1: {
        team_summary: {
          teamData: [
            { name: 'Alice', calls: 45, wins: 8, winRate: 0.18 },
            { name: 'Bob', calls: 52, wins: 12, winRate: 0.23 }
          ],
          timeframe: 'last_30_days'
        }
      }
    };

    return mockPayloads[agent as keyof typeof mockPayloads]?.[task] || { test: true };
  };

  const runFullSystemTest = async () => {
    const testCases = [
      { agent: 'salesAgent_v1', task: 'lead_analysis' },
      { agent: 'managerAgent_v1', task: 'team_summary' },
      { agent: 'automationAgent_v1', task: 'workflow_trigger' },
      { agent: 'developerAgent_v1', task: 'debug_analysis' }
    ];

    for (const testCase of testCases) {
      setSelectedAgent(testCase.agent);
      setSelectedTask(testCase.task);
      await runTestCase('mock');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay between tests
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-blue-600" />
            Agent Execution Tester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quick-test">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quick-test">Quick Test</TabsTrigger>
              <TabsTrigger value="custom-test">Custom Test</TabsTrigger>
              <TabsTrigger value="system-test">Full System</TabsTrigger>
            </TabsList>

            <TabsContent value="quick-test" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Agent:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {agents.map((agent) => (
                      <Button
                        key={agent.id}
                        variant={selectedAgent === agent.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAgent(agent.id)}
                      >
                        {agent.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Task:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {tasksByAgent[selectedAgent as keyof typeof tasksByAgent]?.map((task) => (
                      <Button
                        key={task}
                        variant={selectedTask === task ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTask(task)}
                      >
                        {task.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => runTestCase('mock')} 
                disabled={isExecuting}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Test with Mock Data
              </Button>
            </TabsContent>

            <TabsContent value="custom-test" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Payload (JSON):</label>
                <Textarea
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  placeholder='{"lead": {"name": "Test Lead", "company": "Test Corp"}, "context": "custom_test"}'
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Button 
                onClick={() => runTestCase('custom')} 
                disabled={isExecuting || !customPayload.trim()}
                className="w-full"
              >
                <Bug className="h-4 w-4 mr-2" />
                Run Custom Test
              </Button>
            </TabsContent>

            <TabsContent value="system-test" className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Run comprehensive tests across all agents and core tasks
                </p>
                <Button 
                  onClick={runFullSystemTest} 
                  disabled={isExecuting}
                  size="lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Run Full System Test
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testResults.map((result) => (
              <div key={result.id} className={`border rounded-lg p-3 ${
                result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{result.agent}</span>
                    <Badge variant="outline">{result.task}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {result.executionTime}ms
                    <span>{result.timestamp}</span>
                  </div>
                </div>

                {result.error && (
                  <div className="text-sm text-red-700 bg-red-100 p-2 rounded">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}

                {result.output && (
                  <div className="text-sm bg-white p-2 rounded border">
                    <strong>Output:</strong> {JSON.stringify(result.output, null, 2)}
                  </div>
                )}
              </div>
            ))}

            {testResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No test results yet. Run a test to see results here.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentTester;
