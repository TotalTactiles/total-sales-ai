
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar
} from 'lucide-react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import UsageTracker from '@/components/AIBrain/UsageTracker';
import { Lead } from '@/types/lead';

interface LeadQuickActionsProps {
  lead: Lead;
  onCallInitiate?: (lead: Lead) => void;
}

const LeadQuickActions: React.FC<LeadQuickActionsProps> = ({ lead, onCallInitiate }) => {
  const handleCallClick = () => {
    if (onCallInitiate) {
      onCallInitiate(lead);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-slate-700">Quick Actions</h4>
      <div className="grid grid-cols-2 gap-2">
        <UsageTracker feature="quick_call" context="lead_sidebar">
          <Button size="sm" variant="outline" className="w-full" onClick={handleCallClick}>
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
        </UsageTracker>
        <UsageTracker feature="quick_email" context="lead_sidebar">
          <Button size="sm" variant="outline" className="w-full">
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>
        </UsageTracker>
        <UsageTracker feature="quick_sms" context="lead_sidebar">
          <Button size="sm" variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4 mr-1" />
            SMS
          </Button>
        </UsageTracker>
        <UsageTracker feature="quick_schedule" context="lead_sidebar">
          <Button size="sm" variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </UsageTracker>
      </div>
    </div>
  );
};

export default LeadQuickActions;
