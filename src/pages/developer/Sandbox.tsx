
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Code, TestTube, Zap, Terminal, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const Sandbox = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore developer sandbox.');
  };

  const runTest = () => {
    setIsRunning(true);
    toast.info('Running sandbox test...');
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Sandbox test completed successfully!');
    }, 2000);
  };

  const testEnvironments = [
    { name: 'AI Call Testing', status: 'ready', description: 'Test AI voice calls without real phone numbers' },
    { name: 'Email Automation', status: 'active', description: 'Test email workflows with mock data' },
    { name: 'CRM Integration', status: 'ready', description: 'Test CRM connections in isolated environment' },
    { name: 'Lead Processing', status: 'ready', description: 'Test lead ingestion and processing logic' }
  ];

  const recentTests = [
    { name: 'AI Voice Response', status: 'passed', duration: '2.3s', timestamp: '10:45 AM' },
    { name: 'Email Template Rendering', status: 'passed', duration: '0.8s', timestamp: '10:42 AM' },
    { name: 'Lead Scoring Algorithm', status: 'failed', duration: '1.2s', timestamp: '10:38 AM' },
    { name: 'CRM Data Sync', status: 'passed', duration: '3.1s', timestamp: '10:35 AM' }
  ];

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Developer Sandbox" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Developer Sandbox & Testing Environment" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Sandbox</h1>
          <p className="text-muted-foreground mt-2">
            Safe testing environment for development and debugging
          </p>
        </div>
        <Button onClick={runTest} disabled={isRunning}>
          {isRunning ? (
            <>
              <Terminal className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Test
            </>
          )}
        </Button>
      </div>

      {/* Quick Test Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Quick Test Console
          </CardTitle>
          <CardDescription>Execute quick tests and API calls in sandbox environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter test command or API endpoint..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={runTest} disabled={isRunning || !testInput.trim()}>
                <Play className="h-4 w-4 mr-2" />
                Execute
              </Button>
            </div>
            
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[120px]">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-400">sandbox@salesos:~$</span>
                <span>{testInput || 'Waiting for command...'}</span>
              </div>
              {isRunning && (
                <div className="animate-pulse">
                  <div>Initializing sandbox environment...</div>
                  <div>Loading test modules...</div>
                  <div>Executing test sequence...</div>
                </div>
              )}
              {!isRunning && testInput && (
                <div className="text-green-400">
                  <div>✓ Sandbox environment ready</div>
                  <div>✓ Test environment isolated</div>
                  <div>Ready to execute: {testInput}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Environments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Environments
            </CardTitle>
            <CardDescription>Available sandbox testing environments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testEnvironments.map((env, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{env.name}</p>
                      <Badge 
                        variant={env.status === 'active' ? 'default' : 'secondary'}
                        className={env.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {env.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{env.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Play className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Test Results
            </CardTitle>
            <CardDescription>Latest sandbox test executions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{test.name}</p>
                    <p className="text-sm text-muted-foreground">Duration: {test.duration}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge 
                      variant={test.status === 'passed' ? 'default' : 'destructive'}
                      className={test.status === 'passed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {test.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{test.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sandbox Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Sandbox Tools</CardTitle>
          <CardDescription>Development and debugging utilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Code className="h-6 w-6" />
              <span>Mock API Server</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Zap className="h-6 w-6" />
              <span>AI Testing Tools</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <TestTube className="h-6 w-6" />
              <span>Load Testing</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Test Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sandbox Environment Status</CardTitle>
          <CardDescription>Current sandbox configuration and resource usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">Isolated</p>
              <p className="text-sm text-muted-foreground">Environment Status</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-blue-600">2.4GB</p>
              <p className="text-sm text-muted-foreground">Memory Allocated</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-purple-600">847</p>
              <p className="text-sm text-muted-foreground">Tests Executed Today</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sandbox;
