
import React from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import AIInsightBox from '@/components/Developer/AIInsightBox';
import { useTSAM } from '@/hooks/useTSAM';
import { Activity, Brain, Bug, Clock, Database, Zap } from 'lucide-react';

const DeveloperDashboard: React.FC = () => {
  const { logs, brainData, loading, isDeveloper } = useTSAM();

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const criticalIssues = logs.filter(log => log.priority === 'critical' && !log.resolved);
  const recentLogs = logs.slice(0, 5);

  const mockInsights = [
    {
      id: '1',
      type: 'suggestion' as const,
      title: 'Performance Optimization Detected',
      description: 'Database query in lead management can be optimized for 40% faster response time.',
      priority: 'high' as const,
      action: {
        label: 'Apply Fix',
        handler: () => console.log('Applying performance fix...')
      }
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'Memory Usage Alert',
      description: 'AI agent memory consumption is above normal thresholds.',
      priority: 'medium' as const
    }
  ];

  if (loading) {
    return (
      <TSAMLayout title="TSAM Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="TSAM Developer Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <TSAMCard 
          title="System Health" 
          icon={<Activity className="h-5 w-5" />}
          priority="high"
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Uptime</span>
              <span className="text-green-400">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span className="text-blue-400">1,247</span>
            </div>
            <div className="flex justify-between">
              <span>Response Time</span>
              <span className="text-yellow-400">120ms</span>
            </div>
          </div>
        </TSAMCard>

        <TSAMCard 
          title="AI Brain Status" 
          icon={<Brain className="h-5 w-5" />}
          priority="medium"
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Active Agents</span>
              <span className="text-green-400">12</span>
            </div>
            <div className="flex justify-between">
              <span>Processed Events</span>
              <span className="text-blue-400">{logs.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-fixes Applied</span>
              <span className="text-purple-400">7</span>
            </div>
          </div>
        </TSAMCard>

        <TSAMCard 
          title="Critical Issues" 
          icon={<Bug className="h-5 w-5" />}
          priority={criticalIssues.length > 0 ? 'critical' : 'low'}
        >
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {criticalIssues.length}
            </div>
            <p className="text-sm text-gray-400">
              {criticalIssues.length > 0 ? 'Requires immediate attention' : 'All systems operational'}
            </p>
          </div>
        </TSAMCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TSAMCard title="AI Insights" icon={<Zap className="h-5 w-5" />}>
          <div className="space-y-4">
            {mockInsights.map(insight => (
              <AIInsightBox 
                key={insight.id} 
                insight={insight}
                onDismiss={(id) => console.log('Dismissed:', id)}
                onApply={(id) => console.log('Applied:', id)}
              />
            ))}
          </div>
        </TSAMCard>

        <TSAMCard title="Recent Activity" icon={<Clock className="h-5 w-5" />}>
          <div className="space-y-3">
            {recentLogs.map(log => (
              <div key={log.id} className="border-l-2 border-blue-400 pl-3 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{log.type}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                    log.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    log.priority === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {log.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TSAMCard>
      </div>
    </TSAMLayout>
  );
};

export default DeveloperDashboard;
