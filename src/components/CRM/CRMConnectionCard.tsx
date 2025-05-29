
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw, Settings } from "lucide-react";

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
  totalRecords,
  syncErrors,
  onConnect,
  onDisconnect,
  onSync,
  onViewLogs
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'available':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
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
      case 'available':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canSync = status === 'connected';
  const canConfigure = status !== 'syncing';
  const isConnected = status === 'connected';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          {getStatusIcon()}
        </div>
        <Badge className={getStatusColor()}>
          {status === 'available' ? 'Available' : status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
          
          {isConnected && (
            <div className="space-y-2">
              <CardDescription>
                Last sync: {lastSync ? lastSync.toLocaleDateString() : 'Never'}
              </CardDescription>
              {totalRecords !== undefined && (
                <CardDescription>
                  Records synced: {totalRecords.toLocaleString()}
                </CardDescription>
              )}
              {syncErrors !== undefined && syncErrors > 0 && (
                <CardDescription className="text-red-600">
                  Sync errors: {syncErrors}
                </CardDescription>
              )}
            </div>
          )}
          
          <div className="flex space-x-2">
            {status === 'disconnected' || status === 'available' ? (
              <Button onClick={onConnect} className="flex-1">
                Connect {name}
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
                  onClick={onDisconnect}
                  disabled={!canConfigure}
                  variant="outline"
                  className="flex-1"
                >
                  Disconnect
                </Button>
                <Button 
                  onClick={onViewLogs}
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
