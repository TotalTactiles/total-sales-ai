
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Bot, Settings, CheckCircle, AlertTriangle, Circle } from 'lucide-react';
import { useTSAMAI } from '@/contexts/TSAMAIContext';

const AISystemStatus: React.FC = () => {
  const { 
    isSystemReady, 
    isLive, 
    getAIMetrics, 
    getAutomationStatus, 
    activateAI, 
    deactivateAI,
    isProcessing,
    processingMessage
  } = useTSAMAI();

  const aiMetrics = getAIMetrics();
  const automationStatus = getAutomationStatus();

  const handleActivateAI = async () => {
    try {
      await activateAI();
    } catch (error) {
      console.error('Failed to activate AI:', error);
    }
  };

  const handleDeactivateAI = async () => {
    try {
      await deactivateAI();
    } catch (error) {
      console.error('Failed to deactivate AI:', error);
    }
  };

  const getStatusBadge = (status: boolean, activeLabel: string = "Active", inactiveLabel: string = "Inactive") => {
    if (status) {
      return (
        <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          {activeLabel}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <Circle className="h-3 w-3 mr-1" />
        {inactiveLabel}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">TSAM AI System Status</h2>
        <div className="flex items-center gap-3">
          {getStatusBadge(isSystemReady, "System Ready", "Initializing")}
          {getStatusBadge(isLive, "AI Live", "AI Offline")}
          
          {isSystemReady && (
            <Button
              onClick={isLive ? handleDeactivateAI : handleActivateAI}
              disabled={isProcessing}
              className={isLive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isLive ? "Deactivate AI" : "🚀 Go Live"}
            </Button>
          )}
        </div>
      </div>

      {isProcessing && (
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin">
                <Settings className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-blue-400">{processingMessage}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Models Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-purple-400" />
              AI Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Total Models</span>
                <span className="text-sm font-bold text-white">{aiMetrics?.totalModels || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Active Models</span>
                <span className="text-sm font-bold text-green-400">{aiMetrics?.activeModels || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Status</span>
                {getStatusBadge(aiMetrics?.activeModels > 0, "Online", "Standby")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Agents Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bot className="h-5 w-5 text-green-400" />
              AI Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Total Agents</span>
                <span className="text-sm font-bold text-white">{aiMetrics?.totalAgents || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Active Agents</span>
                <span className="text-sm font-bold text-green-400">{aiMetrics?.activeAgents || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Queued Tasks</span>
                <span className="text-sm font-bold text-yellow-400">{aiMetrics?.queuedInteractions || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Status */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-orange-400" />
              Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Total Workflows</span>
                <span className="text-sm font-bold text-white">{automationStatus?.totalWorkflows || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Active Workflows</span>
                <span className="text-sm font-bold text-green-400">{automationStatus?.activeWorkflows || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Pending Approvals</span>
                <span className="text-sm font-bold text-red-400">{automationStatus?.awaitingApproval || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Readiness */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Launch Readiness Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              {getStatusBadge(isSystemReady)}
              <span className="text-gray-300">System Initialized</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(aiMetrics?.totalModels > 0)}
              <span className="text-gray-300">AI Models Configured</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(aiMetrics?.totalAgents > 0)}
              <span className="text-gray-300">AI Agents Ready</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(automationStatus?.totalWorkflows > 0)}
              <span className="text-gray-300">Automation Workflows Ready</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(aiMetrics?.readyForLaunch)}
              <span className="text-gray-300">Backend Infrastructure Ready</span>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(isLive, "🚀 LIVE", "⏳ Standby")}
              <span className="text-gray-300">System Status</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {aiMetrics?.readyForLaunch && !isLive && (
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-green-400 mb-2">✅ TSAM AI BACKEND READY FOR LAUNCH</h3>
            <p className="text-gray-300 mb-4">
              All systems are configured and ready. Click "Go Live" to activate AI functionality across all workspaces.
            </p>
            <Button 
              onClick={handleActivateAI}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              🚀 Activate TSAM AI System
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AISystemStatus;
