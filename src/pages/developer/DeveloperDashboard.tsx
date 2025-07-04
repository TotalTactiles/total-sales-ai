
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  Code, 
  Database, 
  GitCommit, 
  Monitor,
  TrendingUp,
  Zap,
  Shield,
  Users,
  Brain,
  CheckCircle,
  Clock,
  Server,
  Wifi
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DemoBanner from '@/components/DemoBanner';
import { useTSAM } from '@/hooks/useTSAM';
import { useDemoMode } from '@/hooks/useDemoMode';

const DeveloperDashboard: React.FC = () => {
  const { isDeveloper, logs, brainData, featureFlags, loading } = useTSAM();
  const { isDemo, getDemoData } = useDemoMode();
  const [systemStats, setSystemStats] = useState({
    errorCount: 0,
    activeUsers: 0,
    uptime: '99.9%',
    responseTime: '145ms',
    deploymentStatus: 'stable'
  });

  useEffect(() => {
    // Simulate real-time stats update
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 50) + 20,
        responseTime: `${Math.floor(Math.random() * 100) + 100}ms`
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Use demo data if in demo mode
  const displayLogs = isDemo ? getDemoData('tsam_logs') || [] : logs;
  const displayFeatureFlags = isDemo ? getDemoData('feature_flags') || [] : featureFlags;

  if (!isDeveloper && !isDemo) {
    return <div>Access Denied</div>;
  }

  const criticalIssues = displayLogs.filter(log => {
    return 'priority' in log && log.priority === 'critical';
  }).length;
  
  const enabledFlags = displayFeatureFlags.filter(item => {
    return 'enabled' in item && item.enabled;
  }).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'healthy':
      case 'stable':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">✓ Active</Badge>;
      case 'degraded':
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠ Degraded</Badge>;
      case 'down':
      case 'error':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">❌ Offline</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const systemHealthCards = [
    { 
      title: 'AI Brain Status', 
      value: 'Active', 
      icon: <Brain className="h-5 w-5" />,
      description: 'TSAM AI Processing',
      status: 'active',
      lastUpdated: '2 mins ago'
    },
    { 
      title: 'Database Health', 
      value: systemStats.responseTime, 
      icon: <Database className="h-5 w-5" />,
      description: 'Query Performance',
      status: 'active',
      lastUpdated: '1 min ago'
    },
    { 
      title: 'Auth Service', 
      value: systemStats.uptime, 
      icon: <Shield className="h-5 w-5" />,
      description: 'Authentication System',
      status: 'active',
      lastUpdated: '30 sec ago'
    },
    { 
      title: 'Active Sessions', 
      value: systemStats.activeUsers.toString(), 
      icon: <Users className="h-5 w-5" />,
      description: 'Current User Sessions',
      status: 'active',
      lastUpdated: 'Live'
    }
  ];

  const quickActions = [
    { 
      title: 'System Logs', 
      description: 'Real-time monitoring',
      icon: <Monitor className="h-5 w-5" />,
      path: '/developer/api-logs',
      status: 'active',
      count: displayLogs.length
    },
    { 
      title: 'Feature Flags', 
      description: 'Toggle system features',
      icon: <Code className="h-5 w-5" />,
      path: '/developer/feature-flags',
      status: 'stable',
      count: enabledFlags
    },
    { 
      title: 'AI Brain Monitor', 
      description: 'TSAM brain insights',
      icon: <Zap className="h-5 w-5" />,
      path: '/developer/tsam-brain',
      status: 'active',
      count: 8
    },
    { 
      title: 'System Updates', 
      description: 'Deployment history',
      icon: <GitCommit className="h-5 w-5" />,
      path: '/developer/system-updates',
      status: 'stable',
      count: 3
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Developer Control Panel</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">TSAM AI Brain Active • Last updated 2 mins ago</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Brain className="h-3 w-3 mr-1" />
            Developer Mode
          </Badge>
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div>

      {isDemo && <DemoBanner />}
      
      {/* System Health Overview */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">System Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemHealthCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{card.value}</div>
                <p className="text-xs text-muted-foreground mb-2">{card.description}</p>
                <div className="flex items-center justify-between">
                  {getStatusBadge(card.status)}
                  <span className="text-xs text-muted-foreground">{card.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Developer Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{action.count}</Badge>
                      {getStatusBadge(action.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Activity & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent System Activity
              </CardTitle>
              <Badge variant="outline">{displayLogs.length} Events</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayLogs.slice(0, 5).map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">{'type' in log ? log.type : 'System Event'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date('created_at' in log ? log.created_at : Date.now()).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {'priority' in log && (
                    <Badge 
                      variant={log.priority === 'critical' ? 'destructive' : 
                              log.priority === 'high' ? 'outline' : 'secondary'}
                      className="text-xs"
                    >
                      {log.priority}
                    </Badge>
                  )}
                </div>
              ))}
              {displayLogs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <Badge variant="outline">Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm font-bold text-green-600">{systemStats.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">System Uptime</span>
                <span className="text-sm font-bold text-green-600">{systemStats.uptime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Feature Flags Active</span>
                <span className="text-sm font-bold text-blue-600">{enabledFlags}/{displayFeatureFlags.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Critical Issues</span>
                <span className={`text-sm font-bold ${criticalIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {criticalIssues}
                </span>
              </div>
              {brainData && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">AI Processing</span>
                  <span className="text-sm font-bold text-purple-600">Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Integration Status */}
      {brainData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              TSAM AI Brain Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{brainData.logs?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Processing Logs</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{brainData.applied_fixes?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Applied Optimizations</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{brainData.unresolved_bugs?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeveloperDashboard;
