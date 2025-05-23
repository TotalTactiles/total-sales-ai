
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Brain, Search } from 'lucide-react';
import { Lead } from '@/types/lead';
import LeadOverviewTab from './tabs/LeadOverviewTab';
import LeadNotesTab from './tabs/LeadNotesTab';
import LeadEmailTab from './tabs/LeadEmailTab';
import LeadCallTab from './tabs/LeadCallTab';
import LeadSMSTab from './tabs/LeadSMSTab';
import LeadMeetingsTab from './tabs/LeadMeetingsTab';

interface LeadWorkspaceCenterProps {
  lead: Lead;
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
                  {lead.name} from {lead.company} is highly engaged ({lead.score}% score) 
                  but hasn't responded to the last follow-up. They downloaded pricing info 3x this week.
                </p>
                <p className="text-sm font-medium text-blue-800">
                  <strong>Next step:</strong> Send ROI calculator with personalized savings estimate. 
                  Call probability: {lead.conversionLikelihood}% if contacted within 24 hours.
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
            <LeadOverviewTab lead={lead} />
          </TabsContent>

          <TabsContent value="notes" className="h-full m-0">
            <LeadNotesTab lead={lead} />
          </TabsContent>

          <TabsContent value="email" className="h-full m-0">
            <LeadEmailTab lead={lead} />
          </TabsContent>

          <TabsContent value="call" className="h-full m-0">
            <LeadCallTab lead={lead} />
          </TabsContent>

          <TabsContent value="sms" className="h-full m-0">
            <LeadSMSTab lead={lead} />
          </TabsContent>

          <TabsContent value="meetings" className="h-full m-0">
            <LeadMeetingsTab lead={lead} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LeadWorkspaceCenter;
