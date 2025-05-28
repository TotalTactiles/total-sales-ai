
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Settings,
  Eye,
  Zap
} from 'lucide-react';
import { zohoCRMIntegration } from '@/services/integrations/zohoCRM';

const DeveloperCRMIntegrations = () => {
  const [zohoStatus, setZohoStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrationStatuses();
  }, []);

  const fetchIntegrationStatuses = async () => {
    setLoading(true);
    try {
      const zoho = await zohoCRMIntegration.getStatus();
      setZohoStatus(zoho);
    } catch (error) {
      console.error('Failed to fetch integration statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const integrations = [
    {
      name: 'Zoho CRM',
      status: zohoStatus?.connected ? 'connected' : 'disconnected',
      lastSync: zohoStatus?.lastSync,
      totalRecords: zohoStatus?.totalLeads || 0,
      syncErrors: zohoStatus?.syncErrors || 0,
      description: 'Lead management and customer data synchronization'
    },
    {
      name: 'ClickUp',
      status: 'connected',
      lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      totalRecords: 127,
      syncErrors: 2,
      description: 'Task and project management integration'
    },
    {
      name: 'HubSpot',
      status: 'available',
      lastSync: null,
      totalRecords: 0,
      syncErrors: 0,
      description: 'Marketing and sales platform integration (Coming Soon)'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'syncing': return 'bg-yellow-500';
      case 'available': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <AlertTriangle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'available': return <Clock className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">CRM Integration Dashboard</h1>
          <p className="text-slate-400 mt-2">Monitor and manage external integrations</p>
        </div>
        <Button 
          onClick={fetchIntegrationStatuses}
          variant="outline" 
          className="border-slate-600 text-white hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Database className="h-5 w-5 mr-2 text-cyan-400" />
                  {integration.name}
                </CardTitle>
                <Badge className={`${getStatusColor(integration.status)} text-white`}>
                  {getStatusIcon(integration.status)}
                  <span className="ml-1 capitalize">{integration.status}</span>
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                {integration.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integration.status === 'connected' && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Records</span>
                      <span className="text-white font-medium">{integration.totalRecords}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Sync Errors</span>
                      <span className={`font-medium ${integration.syncErrors > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {integration.syncErrors}
                      </span>
                    </div>
                    {integration.lastSync && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Last Sync</span>
                        <span className="text-white font-medium">
                          {new Date(integration.lastSync).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Sync Health</span>
                      <span className="text-green-400">Excellent</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700 flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View Logs
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}

              {integration.status === 'available' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400">
                    This integration is not yet configured. Contact development team to enable.
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                    disabled
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Coming Soon
                  </Button>
                </div>
              )}

              {integration.status === 'disconnected' && (
                <div className="space-y-4">
                  <p className="text-sm text-red-400">
                    Integration is disconnected. Check authentication or network connectivity.
                  </p>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="w-full"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Reconnect
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Health Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Integration Health Overview</CardTitle>
          <CardDescription className="text-slate-400">
            System-wide integration monitoring and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">2</div>
              <div className="text-sm text-slate-400">Active Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">127</div>
              <div className="text-sm text-slate-400">Total Records Synced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">2</div>
              <div className="text-sm text-slate-400">Recent Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">98.5%</div>
              <div className="text-sm text-slate-400">Overall Health</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperCRMIntegrations;
