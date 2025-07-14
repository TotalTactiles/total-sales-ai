
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Play, Pause, Settings, TrendingUp, Clock, CheckCircle, AlertCircle, Plus, Filter, Search, Sparkles, Brain } from 'lucide-react';
import AutomationDashboard from './AutomationDashboard';
import AutomationTemplates from './AutomationTemplates';
import AutomationAnalytics from './AutomationAnalytics';
import { toast } from 'sonner';

const AIAgentAutomation = () => {
  const [activeSubTab, setActiveSubTab] = useState('dashboard');
  const [hasNewTemplates, setHasNewTemplates] = useState(false);
  const [newTemplatesCount, setNewTemplatesCount] = useState(0);

  useEffect(() => {
    // Check for new templates from Manager OS
    const checkNewTemplates = () => {
      const storedTemplates = localStorage.getItem('newAutomationTemplates');
      if (storedTemplates) {
        const templateData = JSON.parse(storedTemplates);
        const timestamp = new Date(templateData.timestamp);
        const now = new Date();
        const timeDiff = now.getTime() - timestamp.getTime();
        
        // Show notification for templates added in the last 5 minutes
        if (timeDiff < 5 * 60 * 1000) {
          setHasNewTemplates(true);
          setNewTemplatesCount(templateData.templates.length);
        }
      }
    };

    // Listen for new template events
    const handleNewTemplates = (event: CustomEvent) => {
      setHasNewTemplates(true);
      setNewTemplatesCount(event.detail.templates.length);
      
      // Show AI Assistant notification
      setTimeout(() => {
        toast.success("New automation templates available – tap to view and deploy", {
          duration: 10000,
          action: {
            label: 'View Templates',
            onClick: () => setActiveSubTab('templates')
          }
        });
      }, 1000);
    };

    checkNewTemplates();
    window.addEventListener('newAutomationTemplates', handleNewTemplates as EventListener);
    
    return () => {
      window.removeEventListener('newAutomationTemplates', handleNewTemplates as EventListener);
    };
  }, []);

  const clearNewTemplatesNotification = () => {
    setHasNewTemplates(false);
    setNewTemplatesCount(0);
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Header with AI Branding */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-6 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Brain className="h-6 w-6" />
              </div>
              AI Sales Automation Hub
            </h2>
            <p className="text-blue-100 text-sm">
              Streamline your sales process with intelligent automation
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-white hover:bg-blue-50 font-medium text-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              New Automation
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Sub-tabs - Removed Workflow Builder for Rep View */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg p-1 h-12">
          <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white relative"
            onClick={clearNewTemplatesNotification}
          >
            <Settings className="h-4 w-4" />
            <span>Templates</span>
            {hasNewTemplates && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{newTemplatesCount}</span>
              </div>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="dashboard" className="space-y-6 m-0">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6 m-0">
            <AutomationTemplates hasNewTemplates={hasNewTemplates} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 m-0">
            <AutomationAnalytics />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AIAgentAutomation;
