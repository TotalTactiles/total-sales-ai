
import React from 'react';
import { 
  Activity, 
  TestTube, 
  Brain, 
  Settings,
  Database,
  Zap
} from 'lucide-react';
import ResponsiveNavigation from '@/components/Navigation/ResponsiveNavigation';
import RelevanceAIMonitor from '@/components/Developer/RelevanceAIMonitor';
import AgentTester from '@/components/Developer/AgentTester';
import DeveloperLogs from '@/components/Developer/DeveloperLogs';

const RelevanceAIDeveloperPage: React.FC = () => {
  const tabs = [
    {
      id: 'monitor',
      label: 'Monitor',
      icon: <Activity className="h-4 w-4" />,
      component: <RelevanceAIMonitor />
    },
    {
      id: 'testing',
      label: 'Testing',
      icon: <TestTube className="h-4 w-4" />,
      component: <AgentTester />
    },
    {
      id: 'agents',
      label: 'Agents',
      icon: <Brain className="h-4 w-4" />,
      component: (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Agent management interface coming soon...
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <Zap className="h-4 w-4" />,
      component: (
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Performance analytics interface coming soon...
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data',
      label: 'Data',
      icon: <Database className="h-4 w-4" />,
      component: (
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center py-8 text-muted-foreground">
              Data management interface coming soon...
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      component: (
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center py-8 text-muted-foreground">
              Agent configuration interface coming soon...
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: <Database className="h-4 w-4" />,
      component: <DeveloperLogs />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavigation 
        tabs={tabs}
        defaultTab="monitor"
        className="h-screen"
      />
    </div>
  );
};

export default RelevanceAIDeveloperPage;
