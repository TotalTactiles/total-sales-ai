
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Megaphone } from 'lucide-react';
import AdPlatformIntegration from '@/components/LeadManagement/AdPlatformIntegration';
import RestoredLeadManagement from './RestoredLeadManagement';

const ManagerLeads = () => {
  return (
    <div className="min-h-screen">
      <Tabs defaultValue="overview" className="w-full">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ad-platforms" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Ad Platforms
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0">
          <RestoredLeadManagement />
        </TabsContent>

        <TabsContent value="ad-platforms" className="mt-0">
          <div className="p-6">
            <AdPlatformIntegration />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerLeads;
