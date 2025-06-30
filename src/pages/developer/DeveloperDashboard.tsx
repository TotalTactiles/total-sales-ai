
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TopNavigation from '@/components/Navigation/TopNavigation';
import StatsCard from '@/components/Dashboard/StatsCard';
import { 
  Monitor, 
  Code, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Brain,
  Server,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DeveloperDashboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 300);
  }, []);

  const systemStats = [
    {
      title: "System Health",
      value: "99.8%",
      change: "All systems operational",
      changeType: "positive" as const,
      icon: Monitor,
      iconColor: "text-green-600"
    },
    {
      title: "API Response Time",
      value: "127ms",
      change: "-15ms from average",
      changeType: "positive" as const,
      icon: Activity,
      iconColor: "text-blue-600"
    },
    {
      title: "Error Rate",
      value: "0.02%",
      change: "Below threshold",
      changeType: "positive" as const,
      icon: AlertTriangle,
      iconColor: "text-yellow-600"
    },
    {
      title: "Database Queries",
      value: "1.2M",
      change: "+8% from yesterday",
      changeType: "neutral" as const,
      icon: Database,
      iconColor: "text-purple-600"
    }
  ];

  const systemLogs = [
    { time: "14:32", level: "INFO", message: "Sales OS data preload completed in 89ms", component: "Sales" },
    { time: "14:28", level: "WARN", message: "Rate limit approached for AI agent", component: "AI Brain" },
    { time: "14:25", level: "INFO", message: "New user session created", component: "Auth" },
    { time: "14:20", level: "ERROR", message: "Failed to sync CRM data - retrying", component: "Integration" },
    { time: "14:15", level: "INFO", message: "Database backup completed successfully", component: "Database" },
  ];

  const jarvisInsights = [
    {
      type: "performance",
      title: "Performance Optimization",
      message: "Sales OS loading improved by 40% with new caching strategy",
      priority: "medium"
    },
    {
      type: "security",
      title: "Security Alert",
      message: "No security issues detected in the last 24 hours",
      priority: "low"
    },
    {
      type: "error",
      title: "Error Pattern",
      message: "CRM sync failures reduced by 60% after timeout adjustments",
      priority: "high"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
            <p className="text-gray-600 mt-1">System monitoring and development tools</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              All Systems Online
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Logs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Recent System Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded">
                    <span className="text-gray-500 min-w-[50px]">{log.time}</span>
                    <Badge 
                      variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'secondary' : 'default'}
                      className="min-w-[60px] justify-center"
                    >
                      {log.level}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{log.component}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* JARVIS AI Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                JARVIS AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jarvisInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    insight.priority === 'high' ? 'bg-red-50 border-red-200' :
                    insight.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        insight.priority === 'high' ? 'bg-red-500' :
                        insight.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Server className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Server Status</h3>
              <p className="text-sm text-gray-600">Monitor infrastructure</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
              <p className="text-sm text-gray-600">Query performance</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Error Tracking</h3>
              <p className="text-sm text-gray-600">Debug issues</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">System metrics</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Message */}
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-green-600">✅ Developer OS Active</h2>
          <p className="text-gray-600 mt-2">All development tools and monitoring systems operational</p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
