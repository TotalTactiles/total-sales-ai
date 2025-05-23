
import React from 'react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import UsageTracker from '@/components/AIBrain/UsageTracker';
import LeadHeader from './LeadHeader';
import LeadQuickStats from './LeadQuickStats';
import LeadQuickActions from './LeadQuickActions';
import LeadTags from './LeadTags';
import { Lead } from '@/types/lead';

interface LeadSidebarProps {
  lead: Lead;
  isSensitive: boolean;
}

const LeadSidebar: React.FC<LeadSidebarProps> = ({ lead, isSensitive }) => {
  return (
    <div className="w-80 border-r bg-slate-50 p-6 overflow-y-auto">
      <UsageTracker feature="lead_sidebar" context="lead_intelligence_panel">
        <div className="space-y-6">
          <LeadHeader lead={lead} isSensitive={isSensitive} />
          <LeadQuickStats lead={lead} />
          <LeadQuickActions lead={lead} />
          <LeadTags tags={lead.tags} />
        </div>
      </UsageTracker>
    </div>
  );
};

export default LeadSidebar;
