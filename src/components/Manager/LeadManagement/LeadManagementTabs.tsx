
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LeadDistributionTab from './tabs/LeadDistributionTab';
import SourceAnalysisTab from './tabs/SourceAnalysisTab';
import TerritoryPerformanceTab from './tabs/TerritoryPerformanceTab';
import QualityManagementTab from './tabs/QualityManagementTab';

interface LeadManagementTabsProps {
  mockLeads: any[];
  onBulkAction: (action: string) => void;
}

const LeadManagementTabs = ({ mockLeads, onBulkAction }: LeadManagementTabsProps) => {
  return (
    <Tabs defaultValue="distribution" className="space-y-6">
      <TabsList>
        <TabsTrigger value="distribution">Lead Distribution</TabsTrigger>
        <TabsTrigger value="sources">Source Analysis</TabsTrigger>
        <TabsTrigger value="territories">Territory Performance</TabsTrigger>
        <TabsTrigger value="quality">Quality Management</TabsTrigger>
      </TabsList>

      <TabsContent value="distribution" className="space-y-6">
        <LeadDistributionTab mockLeads={mockLeads} />
      </TabsContent>

      <TabsContent value="sources" className="space-y-6">
        <SourceAnalysisTab />
      </TabsContent>

      <TabsContent value="territories" className="space-y-6">
        <TerritoryPerformanceTab />
      </TabsContent>

      <TabsContent value="quality" className="space-y-6">
        <QualityManagementTab onBulkAction={onBulkAction} />
      </TabsContent>
    </Tabs>
  );
};

export default LeadManagementTabs;
