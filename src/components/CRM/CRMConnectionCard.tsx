
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  RefreshCw, 
  Zap 
} from 'lucide-react';

interface CRMConnectionCardProps {
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'available';
  description: string;
  lastSync?: Date;
  totalRecords?: number;
  syncErrors?: number;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  onViewLogs: () => void;
}

const CRMConnectionCard: React.FC<CRMConnectionCardProps> = ({
  name,
  icon,
  status,
  description,
  lastSync,
  totalRecords = 0,
  syncErrors = 0,
  onConnect,
  onDisconnect,
  onSync,
  onViewLogs
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'syncing': return 'bg-yellow-500';
      case 'available': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'available': return <Database className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  const isSyncing = status === 'syncing';
  const isConnected = status === 'connected';
  const canSync = isConnected && !isSyncing;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-2">{icon}</span>
            {name}
          </CardTitle>
          <Badge className={`${getStatusColor()} text-white`}>
            {getStatusIcon()}
            <span className="ml-1 capitalize">{status}</span>
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Records</span>
                <span className="font-medium">{totalRecords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sync Errors</span>
                <span className={`font-medium ${syncErrors > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {syncErrors}
                </span>
              </div>
              {lastSync && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="font-medium">
                    {lastSync.toLocaleDateString()} {lastSync.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sync Health</span>
                <span className={syncErrors > 5 ? 'text-yellow-500' : 'text-green-500'}>
                  {syncErrors > 5 ? 'Warning' : 'Excellent'}
                </span>
              </div>
              <Progress value={Math.max(95 - (syncErrors * 5), 50)} className="h-2" />
            </div>

            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleAction(onSync)}
                disabled={isLoading || !canSync}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </Button>
              <Button size="sm" variant="outline" onClick={onViewLogs}>
                View Logs
              </Button>
              <Button size="sm" variant="outline" onClick={onDisconnect}>
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}

        {status === 'available' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect this CRM to start syncing leads automatically.
            </p>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => handleAction(onConnect)}
              disabled={isLoading}
            >
              <Zap className="h-3 w-3 mr-1" />
              Connect {name}
            </Button>
          </div>
        )}

        {status === 'disconnected' && (
          <div className="space-y-4">
            <p className="text-sm text-destructive">
              Connection lost. Please reconnect to resume lead sync.
            </p>
            <Button 
              size="sm" 
              variant="destructive" 
              className="w-full"
              onClick={() => handleAction(onConnect)}
              disabled={isLoading}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Reconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CRMConnectionCard;
