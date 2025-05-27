
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, User, Settings, TestTube, Database, Zap } from 'lucide-react';

const TestingSandbox: React.FC = () => {
  const [simulationMode, setSimulationMode] = useState<'manager' | 'sales_rep' | 'off'>('off');
  const [testDataLoaded, setTestDataLoaded] = useState(false);

  const startSimulation = (role: 'manager' | 'sales_rep') => {
    setSimulationMode(role);
    console.log(`Starting ${role} simulation mode`);
  };

  const stopSimulation = () => {
    setSimulationMode('off');
    console.log('Stopping simulation mode');
  };

  const loadTestData = () => {
    setTestDataLoaded(true);
    console.log('Loading test data...');
  };

  const clearTestData = () => {
    setTestDataLoaded(false);
    console.log('Clearing test data...');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Testing Sandbox</h1>
          <p className="text-slate-400">Simulate Sales/Manager views with sandbox user, test AI, flows, and features</p>
        </div>
        {simulationMode !== 'off' && (
          <Badge className="bg-orange-500 text-white animate-pulse text-lg px-4 py-2">
            SANDBOX MODE: {simulationMode.toUpperCase().replace('_', ' ')}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Role Simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => simulationMode === 'manager' ? stopSimulation() : startSimulation('manager')}
                variant={simulationMode === 'manager' ? "destructive" : "default"}
                className="w-full justify-start"
              >
                <Eye className="h-4 w-4 mr-2" />
                {simulationMode === 'manager' ? 'Exit Manager View' : 'Simulate Manager View'}
              </Button>
              
              <Button
                onClick={() => simulationMode === 'sales_rep' ? stopSimulation() : startSimulation('sales_rep')}
                variant={simulationMode === 'sales_rep' ? "destructive" : "default"}
                className="w-full justify-start"
              >
                <Eye className="h-4 w-4 mr-2" />
                {simulationMode === 'sales_rep' ? 'Exit Sales Rep View' : 'Simulate Sales Rep View'}
              </Button>
              
              {simulationMode !== 'off' && (
                <Button
                  onClick={stopSimulation}
                  variant="outline"
                  className="w-full border-slate-600 text-white"
                >
                  Return to Developer View
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-green-400" />
              Test Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={testDataLoaded ? clearTestData : loadTestData}
                variant={testDataLoaded ? "destructive" : "default"}
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                {testDataLoaded ? 'Clear Test Data' : 'Load Test Data'}
              </Button>
              
              <div className="text-sm text-slate-400">
                {testDataLoaded ? (
                  <div className="space-y-1">
                    <p>✓ 50 Mock leads loaded</p>
                    <p>✓ 3 Mock users created</p>
                    <p>✓ Sample AI conversations</p>
                  </div>
                ) : (
                  <p>No test data loaded</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              Sandbox Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Select defaultValue="normal">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Network Speed" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="normal">Normal Speed</SelectItem>
                  <SelectItem value="slow">Slow 3G</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="enabled">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="AI Services" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="enabled">AI Enabled</SelectItem>
                  <SelectItem value="disabled">AI Disabled</SelectItem>
                  <SelectItem value="mock">Mock Responses</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="production">
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Environment" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="production">Production-like</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="features" className="data-[state=active]:bg-blue-600">Features</TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600">AI Testing</TabsTrigger>
          <TabsTrigger value="flows" className="data-[state=active]:bg-green-600">Automation Flows</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-yellow-600">Sandbox Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Feature Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <TestTube className="h-6 w-6 mb-2" />
                  Test Login Flow
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <TestTube className="h-6 w-6 mb-2" />
                  Test Navigation
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <TestTube className="h-6 w-6 mb-2" />
                  Test Lead Management
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center">
                  <TestTube className="h-6 w-6 mb-2" />
                  Test Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">AI System Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-white">AI Response Testing</h4>
                  <Button className="w-full justify-start">
                    Test OpenAI Integration
                  </Button>
                  <Button className="w-full justify-start">
                    Test Claude Integration
                  </Button>
                  <Button className="w-full justify-start">
                    Test Hybrid AI Response
                  </Button>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Voice AI Testing</h4>
                  <Button className="w-full justify-start">
                    Test Voice Recognition
                  </Button>
                  <Button className="w-full justify-start">
                    Test Text-to-Speech
                  </Button>
                  <Button className="w-full justify-start">
                    Test Voice Commands
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Automation Flow Testing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Button className="h-16 flex flex-col items-center justify-center">
                    <Zap className="h-5 w-5 mb-1" />
                    Email Automation
                  </Button>
                  <Button className="h-16 flex flex-col items-center justify-center">
                    <Zap className="h-5 w-5 mb-1" />
                    Lead Scoring
                  </Button>
                  <Button className="h-16 flex flex-col items-center justify-center">
                    <Zap className="h-5 w-5 mb-1" />
                    Follow-up Tasks
                  </Button>
                </div>
                <div className="text-sm text-slate-400">
                  <p>🔄 Sandbox automations run in isolation and don't affect production data</p>
                  <p>⏱️ Time-based flows are accelerated for testing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Sandbox Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="text-sm text-slate-300 p-2 bg-slate-700 rounded">
                  <span className="text-blue-400">[15:32:45]</span> Simulation mode activated: Manager
                </div>
                <div className="text-sm text-slate-300 p-2 bg-slate-700 rounded">
                  <span className="text-blue-400">[15:32:40]</span> Test data loaded successfully
                </div>
                <div className="text-sm text-slate-300 p-2 bg-slate-700 rounded">
                  <span className="text-blue-400">[15:32:35]</span> Sandbox environment initialized
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingSandbox;
