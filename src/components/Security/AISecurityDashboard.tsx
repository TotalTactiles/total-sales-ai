
import React, { useState } from 'react';
import { useAISecurityPosture } from '@/hooks/useAISecurityPosture';
import { useAuth } from '@/contexts/AuthContext';
import SecurityMetricsCard from './SecurityMetricsCard';
import SecurityEventsCard from './SecurityEventsCard';
import DataProtectionCard from './DataProtectionCard';

const AISecurityDashboard: React.FC = () => {
  const { profile } = useAuth();
  const {
    securityEvents,
    workflowLimits,
    getSecurityStatus,
    resolveSecurityEvent
  } = useAISecurityPosture();

  const [securityMetrics] = useState({
    dataEncryption: 100,
    accessControl: 98,
    aiAuditing: 95,
    threatDetection: 92
  });

  const securityStatus = getSecurityStatus();

  // Only show to managers and admins
  if (profile?.role !== 'manager' && profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <SecurityMetricsCard
        metrics={securityMetrics}
        workflowLimits={workflowLimits}
        securityStatus={securityStatus}
      />

      <SecurityEventsCard
        securityEvents={securityEvents}
        onResolveEvent={resolveSecurityEvent}
      />

      <DataProtectionCard />
    </div>
  );
};

export default AISecurityDashboard;
