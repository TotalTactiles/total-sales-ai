
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DemoActionButton from './DemoActionButton';
import { Terminal, Bot, Activity, Zap } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

const DeveloperDemoActions: React.FC = () => {
  const { isDemoUser, demoRole } = useDemoMode();

  if (!isDemoUser || demoRole !== 'developer') {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-green-400" />
          Demo Developer Actions
          <Badge variant="outline" className="text-green-400 border-green-400">
            Demo Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DemoActionButton
            action="system-health-check"
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
            successMessage="System health check completed - All systems operational"
          >
            <Activity className="h-4 w-4" />
            Health Check
          </DemoActionButton>

          <DemoActionButton
            action="deploy-agent"
            payload={{ agentId: 'sales-assistant-v2', environment: 'production' }}
            variant="outline"
            className="flex items-center gap-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
            successMessage="Sales Assistant v2 deployed successfully"
          >
            <Bot className="h-4 w-4" />
            Deploy Agent
          </DemoActionButton>
        </div>

        <div className="space-y-2">
          <DemoActionButton
            action="run-automation"
            payload={{ automationId: 'log-analyzer', severity: 'warning' }}
            variant="default"
            className="w-full flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
            successMessage="Log analysis completed - 2 warnings resolved"
          >
            <Zap className="h-4 w-4" />
            Analyze System Logs
          </DemoActionButton>

          <DemoActionButton
            action="run-automation"
            payload={{ automationId: 'performance-optimizer' }}
            variant="outline"
            className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            successMessage="Performance optimization completed - 15% improvement"
          >
            ⚡ Optimize Performance
          </DemoActionButton>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            🎭 <strong>Demo Mode:</strong> All system operations are sandboxed and simulated.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeveloperDemoActions;
