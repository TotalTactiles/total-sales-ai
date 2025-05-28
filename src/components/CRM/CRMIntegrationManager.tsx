
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Database } from 'lucide-react';
import { toast } from 'sonner';
import CRMConnectionCard from './CRMConnectionCard';
import { zohoCRMIntegration } from '@/services/integrations/zohoCRM';
import { clickUpCRMIntegration } from '@/services/integrations/clickupCRM';
import type { ZohoIntegrationService, ClickUpIntegrationService, CRMIntegrationStatus } from '@/services/integrations/types';

interface CRMStatus {
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'available';
  description: string;
  lastSync?: Date;
  totalRecords?: number;
  syncErrors?: number;
}

const CRMIntegrationManager: React.FC = () => {
  const [crmStatuses, setCrmStatuses] = useState<CRMStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const crmConfigs = [
    {
      id: 'zoho',
      name: 'Zoho CRM',
      icon: '🎯',
      description: 'Lead management and customer data synchronization',
      service: zohoCRMIntegration as ZohoIntegrationService
    },
    {
      id: 'clickup',
      name: 'ClickUp',
      icon: '📋',
      description: 'Task and project management integration',
      service: clickUpCRMIntegration as ClickUpIntegrationService
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: '🧡',
      description: 'Marketing and sales platform integration (Coming Soon)',
      service: null
    }
  ];

  const fetchCRMStatuses = async () => {
    setIsRefreshing(true);
    try {
      const statuses: CRMStatus[] = [];

      for (const config of crmConfigs) {
        if (config.service) {
          try {
            const status = await config.service.getStatus();
            let totalRecords = 0;
            
            // Handle different integration types
            if (config.id === 'zoho' && 'totalLeads' in status) {
              totalRecords = status.totalLeads;
            } else if (config.id === 'clickup' && 'totalTasks' in status) {
              totalRecords = status.totalTasks;
            }

            statuses.push({
              name: config.name,
              icon: config.icon,
              status: status.connected ? 'connected' : 'disconnected',
              description: config.description,
              lastSync: status.lastSync,
              totalRecords,
              syncErrors: status.syncErrors
            });
          } catch (error) {
            console.error(`Failed to get ${config.name} status:`, error);
            statuses.push({
              name: config.name,
              icon: config.icon,
              status: 'disconnected',
              description: config.description,
              totalRecords: 0,
              syncErrors: 0
            });
          }
        } else {
          statuses.push({
            name: config.name,
            icon: config.icon,
            status: 'available',
            description: config.description,
            totalRecords: 0,
            syncErrors: 0
          });
        }
      }

      setCrmStatuses(statuses);
    } catch (error) {
      console.error('Failed to fetch CRM statuses:', error);
      toast.error('Failed to refresh CRM statuses');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCRMStatuses();
  }, []);

  const handleConnect = async (crmName: string) => {
    const config = crmConfigs.find(c => c.name === crmName);
    if (!config?.service) {
      toast.error(`${crmName} integration coming soon`);
      return;
    }

    try {
      let result;
      if (config.id === 'zoho') {
        const zohoService = config.service as ZohoIntegrationService;
        result = await zohoService.connect();
      } else if (config.id === 'clickup') {
        const clickupService = config.service as ClickUpIntegrationService;
        result = await clickupService.connectWithOAuth();
      } else {
        throw new Error('Unsupported CRM type');
      }

      if (result.success && result.authUrl) {
        window.open(result.authUrl, `${config.id}-auth`, 'width=600,height=700');
        toast.success(`${crmName} authentication window opened`);
      } else {
        toast.error(result.error || `Failed to connect ${crmName}`);
      }
    } catch (error) {
      console.error(`Failed to connect ${crmName}:`, error);
      toast.error(`Failed to connect ${crmName}`);
    }
  };

  const handleDisconnect = async (crmName: string) => {
    const config = crmConfigs.find(c => c.name === crmName);
    if (!config?.service) return;

    try {
      const result = await config.service.disconnect();
      if (result.success) {
        toast.success(`${crmName} disconnected successfully`);
        await fetchCRMStatuses();
      } else {
        toast.error(result.error || `Failed to disconnect ${crmName}`);
      }
    } catch (error) {
      console.error(`Failed to disconnect ${crmName}:`, error);
      toast.error(`Failed to disconnect ${crmName}`);
    }
  };

  const handleSync = async (crmName: string) => {
    const config = crmConfigs.find(c => c.name === crmName);
    if (!config?.service) return;

    // Update status to syncing
    setCrmStatuses(prev => prev.map(status => 
      status.name === crmName 
        ? { ...status, status: 'syncing' as const }
        : status
    ));

    try {
      let result;
      if (config.id === 'zoho') {
        const zohoService = config.service as ZohoIntegrationService;
        result = await zohoService.syncLeads(false);
      } else if (config.id === 'clickup') {
        const clickupService = config.service as ClickUpIntegrationService;
        result = await clickupService.syncTasks(false);
      } else {
        throw new Error('Unsupported CRM sync type');
      }

      if (result.success) {
        toast.success(`${crmName} sync completed: ${result.synced} records synced`);
        if (result.errors > 0) {
          toast.warning(`${result.errors} errors encountered during sync`);
        }
      } else {
        toast.error(`${crmName} sync failed`);
      }
    } catch (error) {
      console.error(`Failed to sync ${crmName}:`, error);
      toast.error(`Failed to sync ${crmName}`);
    } finally {
      await fetchCRMStatuses();
    }
  };

  const handleViewLogs = (crmName: string) => {
    toast.info(`Opening ${crmName} logs...`);
  };

  const connectedCount = crmStatuses.filter(status => status.status === 'connected').length;
  const totalRecords = crmStatuses.reduce((sum, status) => sum + (status.totalRecords || 0), 0);
  const totalErrors = crmStatuses.reduce((sum, status) => sum + (status.syncErrors || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CRM Integrations</h2>
          <p className="text-muted-foreground">Connect and manage your CRM integrations</p>
        </div>
        <Button 
          onClick={fetchCRMStatuses}
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Overview</CardTitle>
          <CardDescription>System-wide CRM integration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{connectedCount}</div>
              <div className="text-sm text-muted-foreground">Connected CRMs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{totalErrors}</div>
              <div className="text-sm text-muted-foreground">Recent Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {connectedCount > 0 ? Math.max(95 - (totalErrors * 2), 60) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">System Health</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CRM Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crmStatuses.map((crm) => (
          <CRMConnectionCard
            key={crm.name}
            name={crm.name}
            icon={crm.icon}
            status={crm.status}
            description={crm.description}
            lastSync={crm.lastSync}
            totalRecords={crm.totalRecords}
            syncErrors={crm.syncErrors}
            onConnect={() => handleConnect(crm.name)}
            onDisconnect={() => handleDisconnect(crm.name)}
            onSync={() => handleSync(crm.name)}
            onViewLogs={() => handleViewLogs(crm.name)}
          />
        ))}
      </div>

      {/* Add New CRM Card */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Add New CRM</h3>
          <p className="text-muted-foreground text-center mb-4">
            Request a new CRM integration or connect a custom data source
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Request Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMIntegrationManager;
