
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  RefreshCw, 
  Settings,
  Trash2,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { zohoCRMIntegration, type ZohoIntegrationStatus } from '@/services/integrations/zohoCRM';

const ZohoCRMIntegration: React.FC = () => {
  const [status, setStatus] = useState<ZohoIntegrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setIsLoading(true);
    try {
      const integrationStatus = await zohoCRMIntegration.getStatus();
      setStatus(integrationStatus);
    } catch (error) {
      console.error('Failed to load Zoho status:', error);
      toast.error('Failed to load integration status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await zohoCRMIntegration.connect();
      
      if (result.success && result.authUrl) {
        const popup = window.open(
          result.authUrl, 
          'zoho-auth', 
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setTimeout(loadStatus, 2000); // Give time for auth callback
          }
        }, 1000);

        toast.success('Zoho authentication window opened');
      } else {
        throw new Error(result.error || 'Failed to initiate connection');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to Zoho CRM');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async (fullSync: boolean = false) => {
    setIsSyncing(true);
    try {
      const result = await zohoCRMIntegration.syncLeads(fullSync);
      
      if (result.success) {
        toast.success(`Sync completed: ${result.synced} leads synced`);
        if (result.errors > 0) {
          toast.warning(`${result.errors} errors encountered during sync`);
        }
        await loadStatus();
      } else {
        toast.error('Sync failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Zoho CRM? This will stop all data syncing.')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const result = await zohoCRMIntegration.disconnect();
      
      if (result.success) {
        toast.success('Zoho CRM disconnected successfully');
        await loadStatus();
      } else {
        toast.error(result.error || 'Failed to disconnect');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to disconnect');
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
              Z
            </div>
            <div>
              <CardTitle>Zoho CRM</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comprehensive lead management and customer data sync
              </p>
            </div>
          </div>
          <Badge 
            variant={status?.connected ? "default" : "secondary"}
            className={status?.connected ? "bg-green-100 text-green-800" : ""}
          >
            {status?.connected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {status?.connected ? (
          <>
            {/* Connection Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{status.totalLeads}</div>
                <div className="text-sm text-muted-foreground">Total Leads</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {status.lastSync ? new Date(status.lastSync).toLocaleDateString() : 'Never'}
                </div>
                <div className="text-sm text-muted-foreground">Last Sync</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-600">{status.syncErrors}</div>
                <div className="text-sm text-muted-foreground">Recent Errors</div>
              </div>
            </div>

            {/* Sync Health */}
            {status.syncErrors > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Sync Issues Detected</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  {status.syncErrors} errors occurred during recent syncs. Check logs for details.
                </p>
              </div>
            )}

            {/* Rate Limit Status */}
            {status.rateLimitStatus?.limited && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Rate Limited</span>
                </div>
                <p className="text-sm text-orange-700 mt-1">
                  Sync paused due to Zoho API rate limits. 
                  {status.rateLimitStatus.resetTime && (
                    <> Resumes at {new Date(status.rateLimitStatus.resetTime).toLocaleTimeString()}</>
                  )}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => handleSync(false)} 
                disabled={isSyncing}
                variant="default"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Quick Sync
                  </>
                )}
              </Button>

              <Button 
                onClick={() => handleSync(true)} 
                disabled={isSyncing}
                variant="outline"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Full Sync
              </Button>

              <Button 
                onClick={loadStatus} 
                disabled={isLoading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>

              <Button 
                onClick={handleDisconnect} 
                disabled={isDisconnecting}
                variant="destructive"
                className="ml-auto"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Disconnect
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Not Connected State */}
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="h-8 w-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold">
                  Z
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Zoho CRM</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Import your existing leads and keep your sales data synchronized between platforms.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Automatic lead import and sync
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Real-time data updates
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Enhanced lead scoring with AI
                </div>
              </div>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect to Zoho CRM
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ZohoCRMIntegration;
