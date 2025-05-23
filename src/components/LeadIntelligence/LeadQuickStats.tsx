
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';

interface LeadQuickStatsProps {
  lead: Lead;
}

const LeadQuickStats: React.FC<LeadQuickStatsProps> = ({ lead }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Lead Score</span>
        <span className="font-semibold">{lead.score}%</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Last Contact</span>
        <span className="font-semibold">{lead.lastContact || 'No contact yet'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Status</span>
        <Badge variant="outline">{lead.status}</Badge>
      </div>
    </div>
  );
};

export default LeadQuickStats;
