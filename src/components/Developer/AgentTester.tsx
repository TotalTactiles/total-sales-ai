
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, TestTube } from 'lucide-react';
import { useAgentIntegration } from '@/hooks/useAgentIntegration';

const AgentTester: React.FC = () => {
  const { executeAgentTask, isExecuting } = useAgentIntegration('testing');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [customInput, setCustomInput] = useState('');

  const runAgentTest = async (agentType: any, taskType: string, testData?: any) => {
    try {
      const result = await executeAgentTask(agentType, taskType, testData);
      setTestResults(prev => [
        { agentType, taskType, result, timestamp: new Date().toISOString() },
        ...prev.slice(0, 9)
      ]);
    } catch (error) {
      setTestResults(prev => [
        { agentType, taskType, error: error.message, timestamp: new Date().toISOString() },
        ...prev.slice(0, 9)
      ]);
    }
  };

  const testSuites = [
    {
      name: 'Sales Agent Tests',
      tests: [
        { agent: 'salesAgent_v1', task: 'follow_up', data: { leadName: 'Test Lead' } },
        { agent: 'salesAgent_v1', task: 'objection_handling', data: { objection: 'Too expensive' } },
        { agent: 'salesAgent_v1', task: 'call_summary', data: { duration: 300 } }
      ]
    },
    {
      name: 'Manager Agent Tests',
      tests: [
        { agent: 'managerAgent_v1', task: 'team_summary', data: {} },
        { agent: 'managerAgent_v1', task: 'agent_analysis', data: {} }
      ]
    },
    {
      name: 'Automation Tests',
      tests: [
        { agent: 'automationAgent_v1', task: 'status_update', data: {} },
        { agent: 'automationAgent_v1', task: 'trigger_test', data: {} }
      ]
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Agent Test Suites
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testSuites.map((suite) => (
                <div key={suite.name} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">{suite.name}</h3>
                  <div className="space-y-2">
                    {suite.tests.map((test, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => runAgentTest(test.agent, test.task, test.data)}
                        disabled={isExecuting}
                        className="w-full justify-start"
                      >
                        <PlayCircle className="h-4 w-4 mr-2" />
                        {test.task}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom test parameters (JSON)"
                className="min-h-[100px]"
              />
              <Button
                onClick={() => runAgentTest('salesAgent_v1', 'custom_test', { input: customInput })}
                disabled={isExecuting || !customInput.trim()}
                className="w-full"
              >
                Run Custom Test
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No test results yet. Run a test to see results here.
                </div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{result.agentType}</Badge>
                        <span className="text-sm font-medium">{result.taskType}</span>
                      </div>
                      <Badge variant={result.error ? 'destructive' : 'default'}>
                        {result.error ? 'Failed' : 'Success'}
                      </Badge>
                    </div>
                    {result.error ? (
                      <div className="text-sm text-red-600">{result.error}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Test completed successfully
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentTester;
