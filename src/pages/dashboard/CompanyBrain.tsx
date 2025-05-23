
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import BrainStats from '@/components/AIBrain/BrainStats';
import KnowledgeUpload from '@/components/AIBrain/KnowledgeUpload';
import KnowledgeLibrary from '@/components/AIBrain/KnowledgeLibrary';
import KnowledgeChat from '@/components/AIBrain/KnowledgeChat';
import CaseStudiesPanel from '@/components/AIBrain/CaseStudiesPanel';
import ObjectionMapperPanel from '@/components/AIBrain/ObjectionMapperPanel';
import BrandVoicePanel from '@/components/AIBrain/BrandVoicePanel';
import Navigation from '@/components/Navigation';

const CompanyBrain = () => {
  const [activeTab, setActiveTab] = useState<string>('knowledge-base');
  const { user } = useAuth();
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Company Brain
            </h1>
            <p className="text-sm text-muted-foreground">
              Access and manage your company's collective sales intelligence
            </p>
          </div>
          
          {/* Brain Stats Cards */}
          <BrainStats />
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-6">
            <TabsList className="mb-4 grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              <TabsTrigger value="objection-mapper">Objection Mapper</TabsTrigger>
              <TabsTrigger value="brand-voice">Brand Voice</TabsTrigger>
            </TabsList>
            
            {/* Knowledge Base Tab */}
            <TabsContent value="knowledge-base">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload & Ingest Panel */}
                <KnowledgeUpload />
                
                {/* Knowledge Library Panel */}
                <KnowledgeLibrary isManager={isManager} />
                
                {/* Query & Chat Panel */}
                <KnowledgeChat />
              </div>
            </TabsContent>
            
            {/* Case Studies Tab */}
            <TabsContent value="case-studies">
              <CaseStudiesPanel isManager={isManager} />
            </TabsContent>
            
            {/* Objection Mapper Tab */}
            <TabsContent value="objection-mapper">
              <ObjectionMapperPanel />
            </TabsContent>
            
            {/* Brand Voice Tab */}
            <TabsContent value="brand-voice">
              <BrandVoicePanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CompanyBrain;
