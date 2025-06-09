
import React from 'react';
import { useSystemHealth } from '@/hooks/useSystemHealth';

const HealthCheck: React.FC = () => {
  const { metrics, isChecking } = useSystemHealth();
  const { providerMetrics, lastChecked } = metrics;

  const hasIssues = providerMetrics.some(m => m.statusCode !== 200);
  const showHealthCheck = process.env.NODE_ENV === 'development' || hasIssues;

  if (!showHealthCheck || isChecking) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white border rounded-lg shadow-lg p-3 text-xs">
      <div className="font-semibold mb-2">System Health</div>
      <div className="space-y-1">
        {providerMetrics.map(metric => (
          <div key={metric.endpoint} className={`flex items-center gap-2 ${metric.statusCode === 200 ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${metric.statusCode === 200 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {metric.endpoint}: {Math.round(metric.latencyMs)}ms ({metric.statusCode})
          </div>
        ))}
      </div>
      <div className="text-gray-500 mt-2">
        {lastChecked.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default HealthCheck;
