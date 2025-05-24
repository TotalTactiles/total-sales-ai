import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AIAgentDashboard from '@/components/AIAgent/AIAgentDashboard';
import AIAgentCallQueue from '@/components/AIAgent/AIAgentCallQueue';
import AIAgentHistory from '@/components/AIAgent/AIAgentHistory';
import AIAgentVoiceConfig from '@/components/AIAgent/AIAgentVoiceConfig';
import AIAgentFeedback from '@/components/AIAgent/AIAgentFeedback';
import AIAgentLearningEngine from '@/components/AIAgent/AIAgentLearningEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Headphones, ClipboardList, Clock, Settings, LineChart, Brain } from 'lucide-react';
interface AIAgentProps {
  hideNavigation?: boolean;
}
const AIAgent: React.FC<AIAgentProps> = ({
  hideNavigation = false
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return <div className="min-h-screen flex flex-col bg-slate-50">
      {!hideNavigation && <Navigation />}
      
      <div className="flex-1 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* AI Agent Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-salesBlue flex items-center gap-2">
                  <Headphones className="h-6 w-6" />
                  AI Calling Agent
                </h1>
                
              </div>
            </div>
            <p className="text-slate-500">Autonomous voice AI for cold lead outreach and qualification</p>
          </div>
          
          {/* Main Content Area with Tabs */}
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="call-queue" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>Call Queue</span>
              </TabsTrigger>
              <TabsTrigger value="call-history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Call History</span>
              </TabsTrigger>
              <TabsTrigger value="voice-config" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span>Voice Config</span>
              </TabsTrigger>
              <TabsTrigger value="learning-engine" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Learning Engine</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Training & Feedback</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AIAgentDashboard />
            </TabsContent>
            
            <TabsContent value="call-queue">
              <AIAgentCallQueue />
            </TabsContent>
            
            <TabsContent value="call-history">
              <AIAgentHistory />
            </TabsContent>
            
            <TabsContent value="voice-config">
              <AIAgentVoiceConfig />
            </TabsContent>
            
            <TabsContent value="learning-engine">
              <AIAgentLearningEngine />
            </TabsContent>
            
            <TabsContent value="feedback">
              <AIAgentFeedback />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>;
};
export default AIAgent;