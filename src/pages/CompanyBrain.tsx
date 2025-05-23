
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIBrainIngest from '@/components/AIBrain/AIBrainIngest';
import AIBrainQuery from '@/components/AIBrain/AIBrainQuery';
import AIBrainReindex from '@/components/AIBrain/AIBrainReindex';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Database, Search, RefreshCw } from "lucide-react";
import { useAIBrain } from '@/hooks/useAIBrain';

const CompanyBrain = () => {
  const [activeTab, setActiveTab] = useState<string>('ingest');
  const { isIngesting, isQuerying } = useAIBrain();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Company Brain</CardTitle>
              <div className="flex space-x-2">
                {isIngesting && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Ingest...
                  </div>
                )}
                {isQuerying && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Query...
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Store and retrieve company and industry knowledge using AI-powered vector search.
            </p>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-4 grid grid-cols-3">
                <TabsTrigger value="ingest" className="flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Ingest Knowledge
                </TabsTrigger>
                <TabsTrigger value="query" className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Query Knowledge
                </TabsTrigger>
                <TabsTrigger value="reindex" className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-index Data
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ingest">
                <AIBrainIngest />
              </TabsContent>
              
              <TabsContent value="query">
                <AIBrainQuery />
              </TabsContent>
              
              <TabsContent value="reindex">
                <AIBrainReindex />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default CompanyBrain;
