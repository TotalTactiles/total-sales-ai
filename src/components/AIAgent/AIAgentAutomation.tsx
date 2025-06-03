
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
    <div className="space-y-5">
      {/* Refined Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-5 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-1">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Zap className="h-5 w-5" />
              </div>
              Sales Automation Hub
            </h2>
            <p className="text-blue-100 text-sm font-medium">
              Streamline your sales process with intelligent automation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm text-xs">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filter
            </Button>
            <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 font-medium text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Automation
            </Button>
          </div>
        </div>
      </div>

      {/* Refined Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-lg p-1 shadow-sm">
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80"
            >
              <Settings className="h-3.5 w-3.5" />
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="builder" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80"
            >
              <Zap className="h-3.5 w-3.5" />
              Workflow Builder
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-slate-100/80"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-5">
          <TabsContent value="dashboard" className="space-y-5 m-0">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="templates" className="space-y-5 m-0">
            <AutomationTemplates />
          </TabsContent>

          <TabsContent value="builder" className="space-y-5 m-0">
            <AutomationWorkflowBuilder />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-5 m-0">
            <AutomationAnalytics />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AIAgentAutomation;
