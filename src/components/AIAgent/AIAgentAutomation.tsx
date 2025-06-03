
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import AutomationDashboard from './AutomationDashboard';
import AutomationTemplates from './AutomationTemplates';
import AutomationWorkflowBuilder from './AutomationWorkflowBuilder';
import AutomationAnalytics from './AutomationAnalytics';

const AIAgentAutomation = () => {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="space-y-6 p-6">
        {/* Futuristic Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm animate-pulse-glow">
                  <Zap className="h-8 w-8" />
                </div>
                Sales Automation Hub
              </h1>
              <p className="text-blue-100 text-xl font-medium">
                Streamline your sales process with intelligent automation
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter
              </Button>
              <Button 
                size="lg" 
                className="futuristic-button rounded-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Automation
              </Button>
            </div>
          </div>
        </div>

        {/* Modern Sub-tabs */}
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-2 shadow-lg">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-3 rounded-xl py-4 px-6 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <TrendingUp className="h-5 w-5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="flex items-center gap-3 rounded-xl py-4 px-6 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Settings className="h-5 w-5" />
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="builder" 
              className="flex items-center gap-3 rounded-xl py-4 px-6 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Zap className="h-5 w-5" />
              Builder
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-3 rounded-xl py-4 px-6 font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <TrendingUp className="h-5 w-5" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="dashboard" className="space-y-6 m-0">
              <AutomationDashboard />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6 m-0">
              <AutomationTemplates />
            </TabsContent>

            <TabsContent value="builder" className="space-y-6 m-0">
              <AutomationWorkflowBuilder />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 m-0">
              <AutomationAnalytics />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAgentAutomation;
