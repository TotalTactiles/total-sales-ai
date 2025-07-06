import React, { useState, useEffect, Suspense } from 'react';
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
  Wifi,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DemoBanner from '@/components/DemoBanner';
import LoadingManager from '@/components/layout/LoadingManager';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { useTSAM } from '@/hooks/useTSAM';
import { useDemoMode } from '@/hooks/useDemoMode';

// Loading fallback component
const DashboardLoadingFallback = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center bg-transparent">
    <LoadingManager type="default" message="Loading TSAM Developer Control Panel..." />
  </div>
);

// Error fallback component
const DashboardErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="w-full min-h-[60vh] flex items-center justify-center bg-transparent">
    <div className="text-center max-w-md mx-auto p-6">
      <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-red-400 mb-2">Dashboard Error</h2>
      <p className="text-gray-400 mb-4">{error.message || 'Failed to load dashboard'}</p>
      <Button onClick={retry} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry Loading
      </Button>
    </div>
  </div>
);

const DeveloperDashboard: React.FC = () => {
  const { isDeveloper, logs, brainData, featureFlags, loading, error } = useTSAM();
  const { isDemo, getDemoData } = useDemoMode();
  const { execute, isLoading, progress } = useAsyncOperation();
  
  const [systemStats, setSystemStats] = useState({
    errorCount: 0,
    activeUsers: 0,
    uptime: '99.9%',
    responseTime: '145ms',
    deploymentStatus: 'stable',
    lastUpdated: new Date().toLocaleTimeString()
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [dashboardError, setDashboardError] = useState<Error | null>(null);

  useEffect(() => {
    // Ensure component is properly initialized
    const initializeDashboard = async () => {
      try {
        setDashboardError(null);
        setIsInitialized(false);
        
        // Small delay to ensure proper render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setIsInitialized(true);
        
        // Simulate real-time stats update
        const interval = setInterval(() => {
          setSystemStats(prev => ({
            ...prev,
            activeUsers: Math.floor(Math.random() * 50) + 20,
            responseTime: `${Math.floor(Math.random() * 100) + 100}ms`,
            lastUpdated: new Date().toLocaleTimeString()
          }));
        }, 10000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        setDashboardError(error as Error);
        setIsInitialized(true); // Still set to true to show error state
      }
    };

    const cleanup = initializeDashboard();
    return () => {
      if (cleanup instanceof Promise) {
        cleanup.then(cleanupFn => cleanupFn?.());
      }
    };
  }, []);

  // Use demo data if in demo mode
  const displayLogs = isDemo ? getDemoData('tsam_logs') || [] : logs;
  const displayFeatureFlags = isDemo ? getDemoData('feature_flags') || [] : featureFlags;

  // Handle retry for dashboard errors
  const retryDashboard = () => {
    setDashboardError(null);
    setIsInitialized(false);
    // Re-trigger initialization
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  };

  // Show error state if there's a dashboard error
  if (dashboardError) {
    return <DashboardErrorFallback error={dashboardError} retry={retryDashboard} />;
  }

  // Show loading state until fully initialized
  if (!isInitialized || loading) {
    return <DashboardLoadingFallback />;
  }

  if (!isDeveloper && !isDemo) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-transparent">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-400">Access Denied</h2>
          <p className="text-gray-400">Developer access required</p>
        </div>
      </div>
    );
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
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'degraded':
      case 'warning':
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Degraded
          </Badge>
        );
      case 'down':
      case 'error':
        return (
          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const systemHealthCards = [
    { 
      title: 'TSAM AI Brain', 
      value: 'Active', 
      icon: <Brain className="h-5 w-5" />,
      description: 'AI Processing Engine',
      status: 'active',
      lastUpdated: '2 mins ago'
    },
    { 
      title: 'Database Performance', 
      value: systemStats.responseTime, 
      icon: <Database className="h-5 w-5" />,
      description: 'Query Response Time',
      status: 'active',
      lastUpdated: '1 min ago'
    },
    { 
      title: 'Authentication System', 
      value: systemStats.uptime, 
      icon: <Shield className="h-5 w-5" />,
      description: 'Auth Service Uptime',
      status: 'active',
      lastUpdated: '30 sec ago'
    },
    { 
      title: 'Active Sessions', 
      value: systemStats.activeUsers.toString(), 
      icon: <Users className="h-5 w-5" />,
      description: 'Current User Count',
      status: 'active',
      lastUpdated: 'Live'
    }
  ];

  const quickActions = [
    { 
      title: 'System Monitor', 
      description: 'Real-time performance tracking',
      icon: <Monitor className="h-5 w-5 text-blue-400" />,
      path: '/developer/system-monitor',
      status: 'active',
      count: displayLogs.length
    },
    { 
      title: 'Feature Flags', 
      description: 'Toggle system features',
      icon: <Code className="h-5 w-5 text-purple-400" />,
      path: '/developer/feature-flags',
      status: 'stable',
      count: enabledFlags
    },
    { 
      title: 'TSAM Brain Monitor', 
      description: 'AI brain insights & health',
      icon: <Brain className="h-5 w-5 text-green-400" />,
      path: '/developer/tsam-brain',
      status: 'active',
      count: 8
    },
    { 
      title: 'System Updates', 
      description: 'Deployment & version history',
      icon: <GitCommit className="h-5 w-5 text-orange-400" />,
      path: '/developer/system-updates',
      status: 'stable',
      count: 3
    }
  ];

  const handleRefreshStats = async () => {
    await execute(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSystemStats(prev => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 'sync');
  };

  return (
    <div className="w-full space-y-8 bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Developer Control Panel</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">
              TSAM AI Brain Active • Last updated {systemStats.lastUpdated}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
            <Brain className="h-3 w-3 mr-1" />
            Developer Mode
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshStats}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </div>

      {isDemo && <DemoBanner />}
      
      {/* System Health Overview */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">System Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemHealthCards.map((card, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{card.title}</CardTitle>
                <div className="text-gray-400">{card.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1 text-white">{card.value}</div>
                <p className="text-xs text-gray-400 mb-2">{card.description}</p>
                <div className="flex items-center justify-between">
                  {getStatusBadge(card.status)}
                  <span className="text-xs text-gray-500">{card.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Developer Tools */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Developer Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{action.title}</h3>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {action.count}
                      </Badge>
                      {getStatusBadge(action.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* System Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5" />
                Recent System Activity
              </CardTitle>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {displayLogs.length} Events
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayLogs.slice(0, 5).map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {'type' in log ? log.type : 'System Event'}
                      </p>
                      <p className="text-xs text-gray-400">
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
                <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <Badge variant="outline" className="border-gray-600 text-gray-300">Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">API Response Time</span>
                <span className="text-sm font-bold text-green-400">{systemStats.responseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">System Uptime</span>
                <span className="text-sm font-bold text-green-400">{systemStats.uptime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">Feature Flags Active</span>
                <span className="text-sm font-bold text-blue-400">{enabledFlags}/{displayFeatureFlags.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">Critical Issues</span>
                <span className={`text-sm font-bold ${criticalIssues > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {criticalIssues}
                </span>
              </div>
              {brainData && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">AI Processing</span>
                  <span className="text-sm font-bold text-purple-400">Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Integration Status */}
      {brainData && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-purple-400" />
              TSAM AI Brain Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-2xl font-bold text-blue-400">{brainData.logs?.length || 0}</p>
                <p className="text-sm text-gray-400">Processing Logs</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-2xl font-bold text-green-400">{brainData.applied_fixes?.length || 0}</p>
                <p className="text-sm text-gray-400">Applied Optimizations</p>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <p className="text-2xl font-bold text-orange-400">{brainData.unresolved_bugs?.length || 0}</p>
                <p className="text-sm text-gray-400">Pending Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Wrap the component with Suspense
const DeveloperDashboardWithSuspense: React.FC = () => (
  <Suspense fallback={<DashboardLoadingFallback />}>
    <DeveloperDashboard />
  </Suspense>
);

export default DeveloperDashboardWithSuspense;
