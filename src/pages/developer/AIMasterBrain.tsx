
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, Database, Zap, Settings, Eye, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const AIMasterBrain = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore AI Master Brain capabilities.');
  };

  const aiMetrics = {
    totalModels: 8,
    activeModels: 6,
    processingRate: 1247,
    accuracyScore: 94.2,
    learningRate: 89,
    dataPoints: 2847000
  };

  const aiModules = [
    { name: 'Sales AI Assistant', status: 'active', accuracy: 96, load: 'medium' },
    { name: 'Manager AI Insights', status: 'active', accuracy: 94, load: 'low' },
    { name: 'Lead Intelligence', status: 'active', accuracy: 92, load: 'high' },
    { name: 'Voice Processing', status: 'active', accuracy: 89, load: 'medium' },
    { name: 'Document Analysis', status: 'training', accuracy: 87, load: 'low' },
    { name: 'Predictive Analytics', status: 'active', accuracy: 95, load: 'high' }
  ];

  const learningInsights = [
    { category: 'Sales Patterns', insight: 'Tuesday 2-4 PM shows highest conversion rates', confidence: 92 },
    { category: 'Lead Scoring', insight: 'Enterprise leads 40% more likely to convert', confidence: 88 },
    { category: 'Communication', insight: 'Personalized emails increase response by 35%', confidence: 94 },
    { category: 'Timing', insight: 'Follow-up within 5 minutes improves close rate', confidence: 91 }
  ];

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="AI Master Brain" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="AI Master Brain & Neural Network Control" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Master Brain</h1>
          <p className="text-muted-foreground mt-2">
            Central AI intelligence hub, model management, and learning orchestration
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          AI Configuration
        </Button>
      </div>

      {/* AI System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.activeModels}/{aiMetrics.totalModels}</div>
            <p className="text-xs text-green-600">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Rate</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.processingRate}/min</div>
            <p className="text-xs text-muted-foreground">Requests processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Score</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.accuracyScore}%</div>
            <p className="text-xs text-green-600">+2.1% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Database className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(aiMetrics.dataPoints / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Training dataset</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Modules Status */}
        <Card>
          <CardHeader>
            <CardTitle>AI Modules Status</CardTitle>
            <CardDescription>Individual AI model performance and health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiModules.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{module.name}</p>
                      <Badge 
                        variant={module.status === 'active' ? 'default' : 'secondary'}
                        className={module.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {module.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Accuracy: {module.accuracy}%</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={module.load === 'high' ? 'destructive' : module.load === 'medium' ? 'default' : 'secondary'}
                    >
                      {module.load} load
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Learning Insights</CardTitle>
            <CardDescription>Recent discoveries and pattern recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningInsights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{insight.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">{insight.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm">{insight.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle>AI Control Panel</CardTitle>
          <CardDescription>Model management and configuration tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Brain className="h-6 w-6" />
              <span>Model Training</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Eye className="h-6 w-6" />
              <span>Monitor Performance</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Database className="h-6 w-6" />
              <span>Data Pipeline</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Settings className="h-6 w-6" />
              <span>Neural Config</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Learning Status */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Learning Status</CardTitle>
          <CardDescription>Continuous learning and adaptation metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Learning Rate</span>
                <span className="text-sm">{aiMetrics.learningRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${aiMetrics.learningRate}%` }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">847</p>
                <p className="text-sm text-muted-foreground">New patterns learned today</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">99.2%</p>
                <p className="text-sm text-muted-foreground">Model prediction accuracy</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-purple-600">156</p>
                <p className="text-sm text-muted-foreground">Optimization cycles completed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMasterBrain;
