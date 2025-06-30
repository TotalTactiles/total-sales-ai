
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AIAgentDashboard from '@/components/AIAgent/AIAgentDashboard';
import AIAgentCallQueue from '@/components/AIAgent/AIAgentCallQueue';
import AIAgentHistory from '@/components/AIAgent/AIAgentHistory';
import AIAgentVoiceConfig from '@/components/AIAgent/AIAgentVoiceConfig';
import AIAgentFeedback from '@/components/AIAgent/AIAgentFeedback';
import AIAgentLearningEngine from '@/components/AIAgent/AIAgentLearningEngine';
import AIAgentAutomation from '@/components/AIAgent/AIAgentAutomation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  ClipboardList, 
  Clock, 
  Settings, 
  Headphones, 
  Brain, 
  Zap,
  CheckCircle
} from 'lucide-react';

const AIAgent: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Calling Agent</h1>
              <p className="text-gray-600 mt-1">Autonomous AI agent for lead outreach, qualification & conversion</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              AI Agent Active
            </Badge>
          </div>
          
          {/* Tab Navigation */}
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <TabsList className="grid grid-cols-7 w-full bg-transparent gap-1">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="automation" 
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
                >
                  <Zap className="h-4 w-4" />
                  Automation
                </TabsTrigger>
                <TabsTrigger 
                  value="queue" 
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
                >
                  <ClipboardList className="h-4 w-4" />
                  Queue
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
                >
                  <Clock className="h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger 
                  value="voice" 
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
                >
                  <Headphones className="h-4 w-4" />
                  Voice
                </TabsTrigger>
                <TabsTrigger 
                  value="learning" 
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
                >
                  <Brain className="h-4 w-4" />
                  Learning
                </TabsTrigger>
                <TabsTrigger 
                  value="training" 
                  className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                  Training
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-6">
              <TabsContent value="dashboard" className="m-0">
                <AIAgentDashboard />
              </TabsContent>
              
              <TabsContent value="automation" className="m-0">
                <AIAgentAutomation />
              </TabsContent>
              
              <TabsContent value="queue" className="m-0">
                <AIAgentCallQueue />
              </TabsContent>
              
              <TabsContent value="history" className="m-0">
                <AIAgentHistory />
              </TabsContent>
              
              <TabsContent value="voice" className="m-0">
                <AIAgentVoiceConfig />
              </TabsContent>
              
              <TabsContent value="learning" className="m-0">
                <AIAgentLearningEngine />
              </TabsContent>
              
              <TabsContent value="training" className="m-0">
                <AIAgentFeedback />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
