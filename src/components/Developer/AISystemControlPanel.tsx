
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Power, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Bot,
  RefreshCw,
  Settings,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAIActivation } from '@/hooks/useAIActivation';

const AISystemControlPanel: React.FC = () => {
  const { profile } = useAuth();
  const { 
    activateAISystem, 
    refreshActivationStatus, 
    validateSystemHealth,
    isActivating, 
    activationResult, 
    activationStatus 
  } = useAIActivation();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthCheck, setHealthCheck] = useState<boolean | null>(null);

  // Only show for admins and developers
  if (!['admin', 'developer'].includes(profile?.role || '')) {
    return null;
  }

  useEffect(() => {
    refreshActivationStatus();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshActivationStatus();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleHealthCheck = async () => {
    const isHealthy = await validateSystemHealth();
    setHealthCheck(isHealthy);
  };

  const getStatusColor = () => {
    if (!activationStatus.isActive) return 'text-red-600';
    if (activationStatus.agentCount < activationStatus.activeUsers) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBadge = () => {
    if (!activationStatus.isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (activationStatus.agentCount < activationStatus.activeUsers) return <Badge variant="secondary">Partial</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI System Control Panel
          </h2>
          <p className="text-gray-600">Manage and monitor AI agent activation across the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleHealthCheck}
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Health Check
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Power className={`h-5 w-5 ${getStatusColor()}`} />
              <div>
                <div className="text-sm text-gray-600">System Status</div>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Active Agents</div>
                <div className="text-2xl font-bold">{activationStatus.agentCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Active Users</div>
                <div className="text-2xl font-bold">{activationStatus.activeUsers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {healthCheck === null ? (
                <Settings className="h-5 w-5 text-gray-400" />
              ) : healthCheck ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              <div>
                <div className="text-sm text-gray-600">System Health</div>
                <div className="text-sm font-medium">
                  {healthCheck === null ? 'Not Checked' : healthCheck ? 'Healthy' : 'Issues Detected'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activation Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-600" />
            AI System Activation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Full System Activation</h3>
              <p className="text-sm text-gray-600">
                Activate AI agents for all users and enable full AI capabilities
              </p>
            </div>
            <Button
              onClick={activateAISystem}
              disabled={isActivating}
              className="flex items-center gap-2"
            >
              {isActivating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Power className="h-4 w-4" />
                  Activate AI System
                </>
              )}
            </Button>
          </div>

          {isActivating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Activation Progress</span>
                <span>Processing...</span>
              </div>
              <Progress value={50} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activation Results */}
      {activationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activationResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              Activation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600">Agents Activated</div>
                <div className="text-lg font-bold text-green-800">
                  {activationResult.activatedAgents.length}
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600">Demo Accounts</div>
                <div className="text-sm font-medium text-blue-800">
                  Sales: {activationResult.userAccounts.demoSalesRep ? '✓' : '✗'} | 
                  Manager: {activationResult.userAccounts.demoManager ? '✓' : '✗'}
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm text-purple-600">Real Users</div>
                <div className="text-lg font-bold text-purple-800">
                  {activationResult.userAccounts.realUsers.length}
                </div>
              </div>
            </div>

            {/* Activated Agents List */}
            {activationResult.activatedAgents.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Successfully Activated:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activationResult.activatedAgents.map((agent, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {agent}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Errors */}
            {activationResult.errors.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Errors:</h4>
                <div className="space-y-1">
                  {activationResult.errors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-red-700">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Last Activation:</span>
              <span className="ml-2 font-medium">
                {activationStatus.lastActivation 
                  ? new Date(activationStatus.lastActivation).toLocaleString()
                  : 'Never'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">Coverage:</span>
              <span className="ml-2 font-medium">
                {activationStatus.activeUsers > 0 
                  ? `${Math.round((activationStatus.agentCount / activationStatus.activeUsers) * 100)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISystemControlPanel;
