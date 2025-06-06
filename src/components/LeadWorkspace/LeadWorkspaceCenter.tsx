
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Brain } from 'lucide-react';
import { DatabaseLead } from '@/hooks/useLeads';
import LeadOverviewTab from './tabs/LeadOverviewTab';
import LeadNotesTab from './tabs/LeadNotesTab';
import LeadEmailTab from './tabs/LeadEmailTab';
import LeadCallTab from './tabs/LeadCallTab';
import LeadSMSTab from './tabs/LeadSMSTab';
import LeadMeetingsTab from './tabs/LeadMeetingsTab';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';

interface LeadWorkspaceCenterProps {
  lead: DatabaseLead;
  activeTab: string;
  onTabChange: (tab: string) => void;
  aiSummaryEnabled: boolean;
  onAiSummaryToggle: () => void;
}

const LeadWorkspaceCenter: React.FC<LeadWorkspaceCenterProps> = ({
  lead,
  activeTab,
  onTabChange,
  aiSummaryEnabled,
  onAiSummaryToggle
}) => {
  // Convert DatabaseLead to Lead for components that expect the old interface
  const convertedLead = convertDatabaseLeadToLead(lead);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{lead.name} Workspace</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">AI Summary</span>
              <Switch 
                checked={aiSummaryEnabled} 
                onCheckedChange={onAiSummaryToggle}
              />
            </div>
          </div>
        </div>

        {/* AI Summary Banner */}
        {aiSummaryEnabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-1">AI Summary - Where we're up to</h3>
                <p className="text-sm text-blue-700 mb-2">
                  {lead.name} from {lead.company || 'their company'} is {lead.score >= 70 ? 'highly engaged' : 'moderately engaged'} ({lead.score}% score) 
                  {lead.last_contact ? ` and was last contacted ${new Date(lead.last_contact).toLocaleDateString()}` : ' but hasn\'t been contacted yet'}.
                </p>
                <p className="text-sm font-medium text-blue-800">
                  <strong>Next step:</strong> {lead.conversion_likelihood >= 70 ? 'Send follow-up with next steps' : 'Send personalized ROI information'}. 
                  Success probability: {lead.conversion_likelihood}% if contacted within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <div className="border-b px-6 bg-white">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">🧠 Overview</TabsTrigger>
            <TabsTrigger value="notes">📋 Notes</TabsTrigger>
            <TabsTrigger value="email">📨 Email</TabsTrigger>
            <TabsTrigger value="call">📞 Call</TabsTrigger>
            <TabsTrigger value="sms">💬 SMS</TabsTrigger>
            <TabsTrigger value="meetings">📆 Meetings</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="overview" className="h-full m-0">
            <LeadOverviewTab lead={convertedLead} />
          </TabsContent>

          <TabsContent value="notes" className="h-full m-0">
            <LeadNotesTab lead={convertedLead} />
          </TabsContent>

          <TabsContent value="email" className="h-full m-0">
            <LeadEmailTab lead={convertedLead} />
          </TabsContent>

          <TabsContent value="call" className="h-full m-0">
            <LeadCallTab lead={convertedLead} />
          </TabsContent>

          <TabsContent value="sms" className="h-full m-0">
            <LeadSMSTab lead={convertedLead} />
          </TabsContent>

          <TabsContent value="meetings" className="h-full m-0">
            <LeadMeetingsTab lead={convertedLead} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LeadWorkspaceCenter;
