
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TestTube, 
  Brain, 
  Settings,
  Database,
  Zap
} from 'lucide-react';
import RelevanceAIMonitor from '@/components/Developer/RelevanceAIMonitor';
import AgentTester from '@/components/Developer/AgentTester';
import DeveloperLogs from '@/components/Developer/DeveloperLogs';

const RelevanceAIDeveloperPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Relevance AI Developer Console</h1>
          <p className="text-muted-foreground">
            Monitor and manage AI agents for SalesOS
          </p>
        </div>

        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
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
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor">
            <RelevanceAIMonitor />
          </TabsContent>

          <TabsContent value="testing">
            <AgentTester />
          </TabsContent>

          <TabsContent value="agents">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Agent management interface coming soon...
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Performance analytics interface coming soon...
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <div className="p-6">
              <div className="space-y-6">
                <div className="text-center py-8 text-muted-foreground">
                  Data management interface coming soon...
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="p-6">
              <div className="space-y-6">
                <div className="text-center py-8 text-muted-foreground">
                  Agent configuration interface coming soon...
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <DeveloperLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RelevanceAIDeveloperPage;
