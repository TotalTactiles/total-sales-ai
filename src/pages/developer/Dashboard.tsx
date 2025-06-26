import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { useTSAM } from '@/hooks/useTSAM';
import { useDemoMode } from '@/hooks/useDemoMode';
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
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DemoBanner from '@/components/DemoBanner';

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

  const criticalIssues = displayLogs.filter(log => log.priority === 'critical').length;
  
  // Fix the TypeScript error by properly filtering feature flags
  const enabledFlags = displayFeatureFlags.filter(item => {
    // Check if item has 'enabled' property (it's a feature flag)
    return 'enabled' in item && item.enabled;
  }).length;

  const quickActions = [
    { 
      title: 'System Logs', 
      description: 'Real-time log monitoring',
      icon: <Monitor className="h-5 w-5" />,
      path: '/developer/logs',
      status: 'active'
    },
    { 
      title: 'Feature Flags', 
      description: 'Toggle system features',
      icon: <Code className="h-5 w-5" />,
      path: '/developer/feature-flags',
      status: 'stable'
    },
    { 
      title: 'AI Suggestions', 
      description: 'TSAM optimization insights',
      icon: <Zap className="h-5 w-5" />,
      path: '/developer/ai-suggestions',
      status: 'active'
    },
    { 
      title: 'System Updates', 
      description: 'Deployment history',
      icon: <GitCommit className="h-5 w-5" />,
      path: '/developer/updates',
      status: 'stable'
    }
  ];

  const systemMetrics = [
    { label: 'Active Users', value: systemStats.activeUsers, icon: <Users className="h-4 w-4" /> },
    { label: 'System Uptime', value: systemStats.uptime, icon: <Shield className="h-4 w-4" /> },
    { label: 'Avg Response', value: systemStats.responseTime, icon: <Activity className="h-4 w-4" /> },
    { label: 'Critical Issues', value: criticalIssues, icon: <AlertTriangle className="h-4 w-4" /> }
  ];

  if (loading) {
    return (
      <TSAMLayout title="Developer Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="Developer Control Panel">
      <div className="space-y-6">
        {isDemo && <DemoBanner />}
        
        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemMetrics.map((metric, index) => (
            <TSAMCard key={index} title={metric.label} icon={metric.icon} priority="medium">
              <div className="text-2xl font-bold text-white">{metric.value}</div>
            </TSAMCard>
          ))}
        </div>

        {/* Quick Actions */}
        <TSAMCard title="Developer Tools" icon={<Code className="h-5 w-5" />} priority="high">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-gray-600">
                  <div className="flex items-center gap-3 mb-2">
                    {action.icon}
                    <h3 className="font-semibold text-white">{action.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      action.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {action.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </TSAMCard>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TSAMCard title="Recent Activity" icon={<Activity className="h-5 w-5" />}>
            <div className="space-y-3">
              {displayLogs.slice(0, 5).map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm text-white">{log.type}</p>
                    <p className="text-xs text-gray-400">{new Date(log.created_at).toLocaleTimeString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    log.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    log.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    log.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {log.priority}
                  </span>
                </div>
              ))}
            </div>
          </TSAMCard>

          <TSAMCard title="Feature Flags Status" icon={<Database className="h-5 w-5" />}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Flags</span>
                <span className="text-white font-semibold">{displayFeatureFlags.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Enabled</span>
                <span className="text-green-400 font-semibold">{enabledFlags}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Disabled</span>
                <span className="text-orange-400 font-semibold">{displayFeatureFlags.length - enabledFlags}</span>
              </div>
              <Link to="/developer/feature-flags">
                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                  Manage Flags
                </Button>
              </Link>
            </div>
          </TSAMCard>
        </div>

        {/* AI Brain Status */}
        {brainData && (
          <TSAMCard title="TSAM AI Brain Status" icon={<TrendingUp className="h-5 w-5" />} priority="critical">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{brainData.logs?.length || 0}</p>
                <p className="text-sm text-gray-300">Active Logs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{brainData.applied_fixes?.length || 0}</p>
                <p className="text-sm text-gray-300">Applied Fixes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">{brainData.unresolved_bugs?.length || 0}</p>
                <p className="text-sm text-gray-300">Open Issues</p>
              </div>
            </div>
          </TSAMCard>
        )}
      </div>
    </TSAMLayout>
  );
};

export default DeveloperDashboard;
