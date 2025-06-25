
import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { Button } from '@/components/ui/button';
import { useTSAM } from '@/hooks/useTSAM';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Activity, 
  Database,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target
} from 'lucide-react';

const AIBrainMonitorPage: React.FC = () => {
  const { profile } = useAuth();
  const { isDeveloper, brainData, logs, loading, refreshData } = useTSAM();
  const [aiActivity, setAiActivity] = useState({
    totalDecisions: 0,
    successfulActions: 0,
    failedActions: 0,
    learningCycles: 0
  });

  useEffect(() => {
    if (!isDeveloper) return;

    // Simulate AI activity metrics
    setAiActivity({
      totalDecisions: Math.floor(Math.random() * 1000) + 500,
      successfulActions: Math.floor(Math.random() * 800) + 400,
      failedActions: Math.floor(Math.random() * 50) + 10,
      learningCycles: Math.floor(Math.random() * 20) + 5
    });
  }, [isDeveloper]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const aiLogs = logs.filter(log => log.type.includes('ai_') || log.type.includes('tsam_'));
  const recentDecisions = [
    {
      id: '1',
      decision: 'Lead Prioritization Algorithm Update',
      confidence: 94,
      outcome: 'success',
      impact: 'Improved lead conversion by 12%',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '2', 
      decision: 'Email Template Optimization',
      confidence: 87,
      outcome: 'success',
      impact: 'Increased response rate by 8%',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      decision: 'Call Timing Adjustment',
      confidence: 76,
      outcome: 'partial',
      impact: 'Mixed results, requires further analysis',
      timestamp: new Date(Date.now() - 5400000)
    }
  ];

  if (loading) {
    return (
      <TSAMLayout title="AI Brain Monitor">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="TSAM AI Brain Monitor">
      <div className="space-y-6">
        {/* AI Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TSAMCard title="Total Decisions" icon={<Brain className="h-4 w-4" />}>
            <div className="text-2xl font-bold text-white">{aiActivity.totalDecisions}</div>
            <div className="text-xs text-gray-400 mt-1">Last 24 hours</div>
          </TSAMCard>
          
          <TSAMCard title="Success Rate" icon={<CheckCircle className="h-4 w-4" />} priority="low">
            <div className="text-2xl font-bold text-green-400">
              {Math.round((aiActivity.successfulActions / aiActivity.totalDecisions) * 100)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">Actions completed</div>
          </TSAMCard>
          
          <TSAMCard title="Learning Cycles" icon={<TrendingUp className="h-4 w-4" />}>
            <div className="text-2xl font-bold text-blue-400">{aiActivity.learningCycles}</div>
            <div className="text-xs text-gray-400 mt-1">Model updates</div>
          </TSAMCard>
          
          <TSAMCard title="Failed Actions" icon={<AlertTriangle className="h-4 w-4" />} priority="medium">
            <div className="text-2xl font-bold text-orange-400">{aiActivity.failedActions}</div>
            <div className="text-xs text-gray-400 mt-1">Require attention</div>
          </TSAMCard>
        </div>

        {/* Brain Health Status */}
        {brainData && (
          <TSAMCard title="Master AI Brain Status" icon={<Database className="h-5 w-5" />} priority="high">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {brainData.logs?.length || 0}
                </div>
                <div className="text-sm text-gray-300">Active Logs</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {brainData.applied_fixes?.length || 0}
                </div>
                <div className="text-sm text-gray-300">Applied Fixes</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {brainData.unresolved_bugs?.length || 0}
                </div>
                <div className="text-sm text-gray-300">Open Issues</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {brainData.realtime_issues?.length || 0}
                </div>
                <div className="text-sm text-gray-300">Real-time Issues</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button
                onClick={refreshData}
                variant="outline"
                className="border-purple-500 text-purple-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Brain Data
              </Button>
            </div>
          </TSAMCard>
        )}

        {/* Recent AI Decisions */}
        <TSAMCard title="Recent AI Decisions" icon={<Target className="h-5 w-5" />}>
          <div className="space-y-4">
            {recentDecisions.map((decision) => (
              <div key={decision.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">{decision.decision}</h4>
                    <p className="text-sm text-gray-300 mb-2">{decision.impact}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Confidence: {decision.confidence}%
                      </div>
                      <div className="flex items-center gap-1">
                        {decision.outcome === 'success' ? (
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        ) : decision.outcome === 'partial' ? (
                          <AlertTriangle className="h-3 w-3 text-yellow-400" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-red-400" />
                        )}
                        {decision.outcome}
                      </div>
                      <span>{decision.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      decision.confidence >= 90 ? 'text-green-400' :
                      decision.confidence >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {decision.confidence}%
                    </div>
                  </div>
                </div>
                
                {/* Confidence Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      decision.confidence >= 90 ? 'bg-green-400' :
                      decision.confidence >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${decision.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </TSAMCard>

        {/* AI Activity Feed */}
        <TSAMCard title="AI Activity Feed" icon={<Activity className="h-5 w-5" />}>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {aiLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No AI activity logs found.
              </div>
            ) : (
              aiLogs.slice(0, 10).map((log, index) => (
                <div key={log.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Zap className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{log.type}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
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
              ))
            )}
          </div>
        </TSAMCard>
      </div>
    </TSAMLayout>
  );
};

export default AIBrainMonitorPage;
