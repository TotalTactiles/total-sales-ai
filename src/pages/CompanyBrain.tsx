
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KnowledgeTab from '@/components/CompanyBrain/KnowledgeTab';
import SocialMediaIntegration from '@/components/CompanyBrain/SocialMediaIntegration';
import CRMIntegrationTab from '@/components/CompanyBrain/CRMIntegrationTab';
import AutomationTab from '@/components/CompanyBrain/AutomationTab';
import BusinessGoalsTab from '@/components/CompanyBrain/BusinessGoalsTab';
import { useAuth } from '@/contexts/AuthContext';

const CompanyBrain = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('knowledge');
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Company Brain</h1>
          <p className="text-gray-600">Central intelligence hub for your business</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="crm">CRM Integration</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="goals">Business Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="space-y-6">
            <KnowledgeTab />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SocialMediaIntegration />
          </TabsContent>

          <TabsContent value="crm" className="space-y-6">
            <CRMIntegrationTab />
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <AutomationTab />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <BusinessGoalsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyBrain;
