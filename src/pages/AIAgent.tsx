import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import AIAgentDashboard from '@/components/AIAgent/AIAgentDashboard';
import AIAgentCallQueue from '@/components/AIAgent/AIAgentCallQueue';
import AIAgentHistory from '@/components/AIAgent/AIAgentHistory';
import AIAgentVoiceConfig from '@/components/AIAgent/AIAgentVoiceConfig';
import AIAgentFeedback from '@/components/AIAgent/AIAgentFeedback';
import AIAgentLearningEngine from '@/components/AIAgent/AIAgentLearningEngine';
import AIAgentAutomation from '@/components/AIAgent/AIAgentAutomation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Headphones, ClipboardList, Clock, Settings, LineChart, Brain, Zap } from 'lucide-react';
interface AIAgentProps {
  hideNavigation?: boolean;
}
const AIAgent: React.FC<AIAgentProps> = ({
  hideNavigation = false
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      {!hideNavigation && <Navigation />}
      
      <div className="flex-1 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm">
                  <Headphones className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="flat-heading-lg">
                    AI Calling Agent
                  </h1>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Autonomous voice AI for cold lead outreach and qualification
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Compact Tabs */}
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-lg p-1 mb-4 shadow-sm">
              <TabsList className="grid grid-cols-7 w-full bg-transparent gap-0.5">
                <TabsTrigger value="dashboard" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80">
                  <LineChart className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="automation" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80">
                  <Zap className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">Automation</span>
                  
                </TabsTrigger>
                <TabsTrigger value="call-queue" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80">
                  <ClipboardList className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">Queue</span>
                </TabsTrigger>
                <TabsTrigger value="call-history" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80">
                  <Clock className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">History</span>
                </TabsTrigger>
                <TabsTrigger value="voice-config" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80">
                  <Headphones className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">Voice</span>
                </TabsTrigger>
                <TabsTrigger value="learning-engine" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80">
                  <Brain className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">Learning</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80">
                  <Settings className="h-3 w-3" />
                  <span className="hidden sm:inline text-xs">Training</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard">
              <AIAgentDashboard />
            </TabsContent>
            
            <TabsContent value="automation">
              <AIAgentAutomation />
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