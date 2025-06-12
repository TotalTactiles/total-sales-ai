
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RelevanceAPISettings from '@/components/Settings/RelevanceAPISettings';
import MobileResponsivenessTest from '@/components/Testing/MobileResponsivenessTest';
import CustomAgentTraining from '@/components/AI/CustomAgentTraining';
import AdvancedWorkflowBuilder from '@/components/Automation/AdvancedWorkflowBuilder';

const AdvancedFeatures: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Advanced Features</h1>
        <p className="text-gray-600 mt-2">
          Configure advanced AI settings, test responsiveness, train custom agents, and build automation workflows
        </p>
      </div>

      <Tabs defaultValue="api-integration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-integration">API Integration</TabsTrigger>
          <TabsTrigger value="mobile-testing">Mobile Testing</TabsTrigger>
          <TabsTrigger value="agent-training">Agent Training</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="api-integration" className="mt-6">
          <RelevanceAPISettings />
        </TabsContent>

        <TabsContent value="mobile-testing" className="mt-6">
          <MobileResponsivenessTest />
        </TabsContent>

        <TabsContent value="agent-training" className="mt-6">
          <CustomAgentTraining />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <AdvancedWorkflowBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedFeatures;
