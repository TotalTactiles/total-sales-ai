
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Sales Automation Hub
          </h2>
          <p className="text-muted-foreground">
            Streamline your sales process with intelligent automation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Automation
          </Button>
        </div>
      </div>

      {/* Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Workflow Builder
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AutomationDashboard />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <AutomationTemplates />
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <AutomationWorkflowBuilder />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AutomationAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgentAutomation;
