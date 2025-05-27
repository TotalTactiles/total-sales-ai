
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Play, RotateCcw } from 'lucide-react';

interface QAItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  automated: boolean;
  lastRun?: string;
  error?: string;
}

const QAChecklist: React.FC = () => {
  const [qaItems, setQaItems] = useState<QAItem[]>([]);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    initializeQAItems();
  }, []);

  const initializeQAItems = () => {
    const items: QAItem[] = [
      {
        id: '1',
        category: 'Authentication',
        title: 'Login Flow',
        description: 'Test user login with valid credentials',
        status: 'passed',
        automated: true,
        lastRun: new Date().toISOString()
      },
      {
        id: '2',
        category: 'Authentication',
        title: 'Logout Flow',
        description: 'Test user logout and session cleanup',
        status: 'passed',
        automated: true,
        lastRun: new Date().toISOString()
      },
      {
        id: '3',
        category: 'Navigation',
        title: 'Developer OS Routes',
        description: 'All developer routes accessible and functional',
        status: 'pending',
        automated: true
      },
      {
        id: '4',
        category: 'Navigation',
        title: 'Manager OS Routes',
        description: 'All manager routes accessible and functional',
        status: 'pending',
        automated: true
      },
      {
        id: '5',
        category: 'Navigation',
        title: 'Sales Rep OS Routes',
        description: 'All sales rep routes accessible and functional',
        status: 'pending',
        automated: true
      },
      {
        id: '6',
        category: 'AI Integration',
        title: 'AI Response Generation',
        description: 'Test AI response generation and fallbacks',
        status: 'passed',
        automated: true,
        lastRun: new Date().toISOString()
      },
      {
        id: '7',
        category: 'AI Integration',
        title: 'Voice Recognition',
        description: 'Test voice input and speech-to-text conversion',
        status: 'failed',
        automated: true,
        lastRun: new Date().toISOString(),
        error: 'Microphone permission needed'
      },
      {
        id: '8',
        category: 'Database',
        title: 'Database Connectivity',
        description: 'Test database connection and basic operations',
        status: 'failed',
        automated: true,
        lastRun: new Date().toISOString(),
        error: 'infinite recursion detected in policy for relation "profiles"'
      },
      {
        id: '9',
        category: 'APIs',
        title: 'Email Service',
        description: 'Test email sending functionality',
        status: 'pending',
        automated: true
      },
      {
        id: '10',
        category: 'APIs',
        title: 'SMS Service',
        description: 'Test SMS sending via Twilio',
        status: 'pending',
        automated: true
      },
      {
        id: '11',
        category: 'Security',
        title: 'Role-Based Access',
        description: 'Verify role-based access restrictions',
        status: 'pending',
        automated: false
      },
      {
        id: '12',
        category: 'Security',
        title: 'Data Encryption',
        description: 'Verify sensitive data is encrypted',
        status: 'pending',
        automated: false
      }
    ];
    setQaItems(items);
  };

  const runTest = async (item: QAItem) => {
    setRunningTests(prev => new Set(prev).add(item.id));
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    
    setQaItems(prev => prev.map(qaItem => {
      if (qaItem.id === item.id) {
        const success = Math.random() > 0.3; // 70% success rate for demo
        return {
          ...qaItem,
          status: success ? 'passed' : 'failed',
          lastRun: new Date().toISOString(),
          error: success ? undefined : 'Simulated test failure'
        };
      }
      return qaItem;
    }));
    
    setRunningTests(prev => {
      const next = new Set(prev);
      next.delete(item.id);
      return next;
    });
  };

  const runAllTests = async () => {
    const automatedItems = qaItems.filter(item => item.automated);
    for (const item of automatedItems) {
      if (!runningTests.has(item.id)) {
        runTest(item);
        // Stagger test execution
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const categories = ['all', ...new Set(qaItems.map(item => item.category))];
  const filteredItems = selectedCategory === 'all' 
    ? qaItems 
    : qaItems.filter(item => item.category === selectedCategory);

  const totalItems = qaItems.length;
  const passedItems = qaItems.filter(item => item.status === 'passed').length;
  const failedItems = qaItems.filter(item => item.status === 'failed').length;
  const progressPercentage = totalItems > 0 ? (passedItems / totalItems) * 100 : 0;

  return (
    <div className="p-6 space-y-6 bg-slate-900 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QA Checklist</h1>
          <p className="text-slate-400">Dynamic, checkable items for system-wide QA testing</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runAllTests}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Run All Tests
          </Button>
          <Button
            onClick={initializeQAItems}
            variant="outline"
            className="border-slate-600 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{totalItems}</p>
              <p className="text-sm text-slate-400">Total Tests</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{passedItems}</p>
              <p className="text-sm text-slate-400">Passed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{failedItems}</p>
              <p className="text-sm text-slate-400">Failed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{progressPercentage.toFixed(0)}%</p>
              <p className="text-sm text-slate-400">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Test Progress</CardTitle>
          <Progress value={progressPercentage} className="w-full" />
        </CardHeader>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Test Categories</CardTitle>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "" : "border-slate-600 text-white"}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isRunning = runningTests.has(item.id);
              const currentStatus = isRunning ? 'running' : item.status;
              
              return (
                <div
                  key={item.id}
                  className="p-4 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={item.status === 'passed'}
                        disabled={!item.automated || isRunning}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white">{item.title}</h4>
                          <Badge className={getStatusColor(currentStatus)}>
                            {isRunning ? 'Running...' : currentStatus}
                          </Badge>
                          {item.automated && (
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                              Auto
                            </Badge>
                          )}
                          {getStatusIcon(currentStatus)}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{item.description}</p>
                        {item.lastRun && (
                          <p className="text-xs text-slate-500">
                            Last run: {new Date(item.lastRun).toLocaleString()}
                          </p>
                        )}
                        {item.error && (
                          <p className="text-xs text-red-400 mt-1">
                            Error: {item.error}
                          </p>
                        )}
                      </div>
                    </div>
                    {item.automated && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runTest(item)}
                        disabled={isRunning}
                        className="border-slate-600 text-white"
                      >
                        {isRunning ? (
                          <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-white rounded-full" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QAChecklist;
