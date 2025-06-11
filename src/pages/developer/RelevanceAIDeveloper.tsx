
import React, { useState } from 'react';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import RelevanceAIMonitor from '@/components/Developer/RelevanceAIMonitor';
import AgentTester from '@/components/Developer/AgentTester';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TestTube, 
  Brain, 
  Settings,
  Database,
  Zap
} from 'lucide-react';

const RelevanceAIDeveloperPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('monitor');

  return (
    <div className="min-h-screen bg-background">
      <DeveloperNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Relevance AI Developer Console</h1>
              <p className="text-muted-foreground">
                Monitor, test, and optimize AI agent performance across all SalesOS functions
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="monitor" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Monitor
                </TabsTrigger>
                <TabsTrigger value="testing" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Testing
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Agents
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="monitor" className="mt-6">
                <RelevanceAIMonitor />
              </TabsContent>

              <TabsContent value="testing" className="mt-6">
                <AgentTester />
              </TabsContent>

              <TabsContent value="agents" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Agent status cards would go here */}
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    Agent management interface coming soon...
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance metrics would go here */}
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    Performance analytics interface coming soon...
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data" className="mt-6">
                <div className="space-y-6">
                  {/* Data management interface would go here */}
                  <div className="text-center py-8 text-muted-foreground">
                    Data management interface coming soon...
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <div className="space-y-6">
                  {/* Settings interface would go here */}
                  <div className="text-center py-8 text-muted-foreground">
                    Agent configuration interface coming soon...
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RelevanceAIDeveloperPage;
