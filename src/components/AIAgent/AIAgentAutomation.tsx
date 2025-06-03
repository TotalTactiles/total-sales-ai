
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
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-4 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="h-4 w-4" />
              </div>
              Sales Automation Hub
            </h2>
            <p className="text-blue-100 text-xs">
              Streamline your sales process with intelligent automation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm text-xs h-8">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
            <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 font-medium text-xs h-8">
              <Plus className="h-3 w-3 mr-1" />
              New Automation
            </Button>
          </div>
        </div>
      </div>

      {/* Compact Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg p-0.5 h-9">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <Settings className="h-3 w-3" />
            <span className="text-xs">Templates</span>
          </TabsTrigger>
          <TabsTrigger 
            value="builder" 
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <Zap className="h-3 w-3" />
            <span className="text-xs">Workflow Builder</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="dashboard" className="space-y-4 m-0">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 m-0">
            <AutomationTemplates />
          </TabsContent>

          <TabsContent value="builder" className="space-y-4 m-0">
            <AutomationWorkflowBuilder />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 m-0">
            <AutomationAnalytics />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AIAgentAutomation;
