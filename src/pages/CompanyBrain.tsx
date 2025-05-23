
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIBrainIngest from '@/components/AIBrain/AIBrainIngest';
import AIBrainQuery from '@/components/AIBrain/AIBrainQuery';
import ProtectedRoute from '@/components/ProtectedRoute';

const CompanyBrain = () => {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Company Brain</h1>
        
        <Tabs defaultValue="ingest" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="ingest">Ingest Knowledge</TabsTrigger>
            <TabsTrigger value="query">Query Knowledge</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingest">
            <AIBrainIngest />
          </TabsContent>
          
          <TabsContent value="query">
            <AIBrainQuery />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default CompanyBrain;
