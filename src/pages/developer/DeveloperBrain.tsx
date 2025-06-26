
import React, { useState, useEffect } from 'react';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const DeveloperBrain = () => {
  const [systemHealth, setSystemHealth] = useState(98);
  const [jarvisStatus, setJarvisStatus] = useState('online');

  // Mock JARVIS insights
  const jarvisInsights = [
    { type: 'optimization', priority: 'medium', message: 'Database query optimization reduced response time by 23%', timestamp: '5 minutes ago' },
    { type: 'prediction', priority: 'low', message: 'Peak usage expected at 3 PM EST based on historical patterns', timestamp: '12 minutes ago' },
    { type: 'alert', priority: 'high', message: 'Memory usage trending upward - auto-scaling recommended', timestamp: '18 minutes ago' },
    { type: 'success', priority: 'low', message: 'All critical systems operating within normal parameters', timestamp: '25 minutes ago' }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="h-4 w-4 text-blue-400" />;
      case 'prediction': return <Brain className="h-4 w-4 text-purple-400" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900 text-red-300 border-red-700';
      case 'medium': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      case 'low': return 'bg-green-900 text-green-300 border-green-700';
      default: return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DeveloperNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-400 animate-pulse" />
              TSAM Brain (JARVIS)
            </h1>
            <p className="text-gray-400">AI-powered system intelligence and monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-900 text-green-300 border-green-700">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              JARVIS Online
            </Badge>
            <Badge variant="outline" className="bg-purple-900 text-purple-300 border-purple-700">
              Intelligence Level: Advanced
            </Badge>
          </div>
        </div>

        {/* JARVIS Status Dashboard */}
        <Card className="mb-6 bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 animate-pulse" />
              JARVIS AI Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{systemHealth}%</div>
                <p className="text-sm text-gray-300">System Health</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${systemHealth}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
                <p className="text-sm text-gray-300">Active Monitoring</p>
                <div className="flex justify-center mt-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">AI</div>
                <p className="text-sm text-gray-300">Self-Healing</p>
                <div className="flex justify-center mt-2">
                  <Zap className="h-4 w-4 text-purple-400 animate-pulse" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live AI Insights */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Live AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jarvisInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-200 mb-1">{insight.message}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="capitalize">{insight.type}</span>
                          <span>•</span>
                          <span>{insight.timestamp}</span>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className={`ml-4 ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* JARVIS Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Active Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Real-time System Monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Predictive Performance Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Automated Error Detection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Self-Healing Recommendations</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-400" />
                Future Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Automated Rollback Operations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Code Quality Optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Predictive Scaling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Natural Language Operations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeveloperBrain;
