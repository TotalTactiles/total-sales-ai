
import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AgentMetric {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  successRate: number;
  responseTime: number;
  lastActive: Date;
  totalRequests: number;
  errorCount: number;
  type: 'sales' | 'support' | 'analysis' | 'automation';
}

const AgentHealthPage: React.FC = () => {
  const { profile } = useAuth();
  const [agents, setAgents] = useState<AgentMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const isDeveloper = profile?.role === 'developer';

  useEffect(() => {
    if (!isDeveloper) return;

    // Generate mock agent health data
    const mockAgents: AgentMetric[] = [
      {
        id: '1',
        name: 'Sales Assistant',
        status: 'healthy',
        successRate: 94.2,
        responseTime: 1.2,
        lastActive: new Date(Date.now() - 300000), // 5 minutes ago
        totalRequests: 1247,
        errorCount: 3,
        type: 'sales'
      },
      {
        id: '2',
        name: 'Lead Qualifier',
        status: 'warning',
        successRate: 78.5,
        responseTime: 2.1,
        lastActive: new Date(Date.now() - 600000), // 10 minutes ago
        totalRequests: 892,
        errorCount: 15,
        type: 'analysis'
      },
      {
        id: '3',
        name: 'Email Generator',
        status: 'healthy',
        successRate: 96.8,
        responseTime: 0.8,
        lastActive: new Date(Date.now() - 120000), // 2 minutes ago
        totalRequests: 2341,
        errorCount: 1,
        type: 'automation'
      },
      {
        id: '4',
        name: 'Call Scheduler',
        status: 'critical',
        successRate: 45.2,
        responseTime: 5.4,
        lastActive: new Date(Date.now() - 3600000), // 1 hour ago
        totalRequests: 456,
        errorCount: 28,
        type: 'automation'
      },
      {
        id: '5',
        name: 'Data Analyzer',
        status: 'healthy',
        successRate: 91.7,
        responseTime: 1.8,
        lastActive: new Date(Date.now() - 180000), // 3 minutes ago
        totalRequests: 734,
        errorCount: 5,
        type: 'analysis'
      }
    ];

    setAgents(mockAgents);
    setLoading(false);
  }, [isDeveloper]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'offline':
        return <Clock className="h-4 w-4 text-gray-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-500 bg-green-50/10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50/10';
      case 'critical':
        return 'border-red-500 bg-red-50/10';
      case 'offline':
        return 'border-gray-500 bg-gray-50/10';
      default:
        return 'border-gray-500 bg-gray-50/10';
    }
  };

  const getPriorityFromStatus = (status: string) => {
    switch (status) {
      case 'critical':
        return 'critical' as const;
      case 'warning':
        return 'high' as const;
      default:
        return 'medium' as const;
    }
  };

  const healthyCount = agents.filter(a => a.status === 'healthy').length;
  const warningCount = agents.filter(a => a.status === 'warning').length;
  const criticalCount = agents.filter(a => a.status === 'critical').length;

  if (loading) {
    return (
      <TSAMLayout title="Agent Health">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="AI Agent Health Monitor">
      <div className="space-y-6">
        {/* Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TSAMCard title="Total Agents" icon={<Brain className="h-4 w-4" />}>
            <div className="text-2xl font-bold text-white">{agents.length}</div>
          </TSAMCard>
          
          <TSAMCard title="Healthy" icon={<CheckCircle className="h-4 w-4" />} priority="low">
            <div className="text-2xl font-bold text-green-400">{healthyCount}</div>
          </TSAMCard>
          
          <TSAMCard title="Warnings" icon={<AlertTriangle className="h-4 w-4" />} priority="medium">
            <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
          </TSAMCard>
          
          <TSAMCard title="Critical" icon={<AlertTriangle className="h-4 w-4" />} priority="critical">
            <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
          </TSAMCard>
        </div>

        {/* Agent Details */}
        <div className="space-y-4">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className={`p-6 rounded-lg border-l-4 ${getStatusColor(agent.status)} backdrop-blur-sm`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(agent.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="capitalize">{agent.type} Agent</span>
                      <span>Last active: {agent.lastActive.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-white">{agent.successRate}%</p>
                    {agent.successRate >= 90 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Response Time</p>
                  <p className="text-lg font-semibold text-white">{agent.responseTime}s</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Requests</p>
                  <p className="text-lg font-semibold text-white">{agent.totalRequests.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Error Count</p>
                  <p className="text-lg font-semibold text-white">{agent.errorCount}</p>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Performance</span>
                  <span>{agent.successRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      agent.successRate >= 90 ? 'bg-green-400' :
                      agent.successRate >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${agent.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TSAMLayout>
  );
};

export default AgentHealthPage;
