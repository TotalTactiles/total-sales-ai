
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, Settings } from "lucide-react";

interface CRMConnectionCardProps {
  provider: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync?: string;
  recordCount?: number;
  onConnect: () => void;
  onSync: () => void;
  onConfigure: () => void;
}

const CRMConnectionCard: React.FC<CRMConnectionCardProps> = ({
  provider,
  status,
  lastSync,
  recordCount,
  onConnect,
  onSync,
  onConfigure
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canSync = status === 'connected';
  const canConfigure = status !== 'syncing';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-semibold">{provider}</CardTitle>
          {getStatusIcon()}
        </div>
        <Badge className={getStatusColor()}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {status === 'connected' && (
            <div className="space-y-2">
              <CardDescription>
                Last sync: {lastSync || 'Never'}
              </CardDescription>
              {recordCount !== undefined && (
                <CardDescription>
                  Records synced: {recordCount.toLocaleString()}
                </CardDescription>
              )}
            </div>
          )}
          
          <div className="flex space-x-2">
            {status === 'disconnected' ? (
              <Button onClick={onConnect} className="flex-1">
                Connect {provider}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={onSync} 
                  disabled={!canSync}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button 
                  onClick={onConfigure}
                  disabled={!canConfigure}
                  variant="outline"
                  size="icon"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CRMConnectionCard;
