
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
      {!hideNavigation && <Navigation />}
      
      <div className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern AI Agent Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg animate-pulse-glow">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text">
                    AI Calling Agent
                  </h1>
                  <p className="text-slate-600 text-lg font-medium mt-1">
                    Autonomous voice AI for cold lead outreach and qualification
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Futuristic Tabs */}
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-7 mb-8 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-2 shadow-lg">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 rounded-xl py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="automation" 
                className="flex items-center gap-2 rounded-xl py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Automation</span>
                <Badge variant="secondary" className="ml-1 text-xs bg-orange-100 text-orange-800 rounded-full px-2 py-0.5">New</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="call-queue" 
                className="flex items-center gap-2 rounded-xl py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Queue</span>
              </TabsTrigger>
              <TabsTrigger 
                value="call-history" 
                className="flex items-center gap-2 rounded-xl py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger 
                value="voice-config" 
                className="flex items-center gap-2 rounded-xl py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Headphones className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger 
                value="learning-engine" 
                className="flex items-center gap-2 rounded-xl py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Learning</span>
              </TabsTrigger>
              <TabsTrigger 
                value="feedback" 
                className="flex items-center gap-2 rounded-xl py-3 px-4 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
            </TabsList>

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
    </div>
  );
};

export default AIAgent;
