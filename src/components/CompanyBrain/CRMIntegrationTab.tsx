
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  CheckCircle, 
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Settings
} from 'lucide-react';

interface CRMIntegration {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  lastSync?: Date;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  recordCount?: number;
}

const CRMIntegrationTab: React.FC = () => {
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([
    {
      id: 'hubspot',
      name: 'HubSpot',
      logo: '🚀',
      connected: true,
      lastSync: new Date(Date.now() - 10 * 60000),
      status: 'connected',
      recordCount: 1247
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      logo: '☁️',
      connected: false,
      status: 'disconnected'
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      logo: '📊',
      connected: true,
      lastSync: new Date(Date.now() - 5 * 60000),
      status: 'syncing',
      recordCount: 892
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState({ crm: '', description: '' });

  const availableCRMs = [
    { id: 'salesforce', name: 'Salesforce', logo: '☁️' },
    { id: 'hubspot', name: 'HubSpot', logo: '🚀' },
    { id: 'pipedrive', name: 'Pipedrive', logo: '📊' },
    { id: 'zoho', name: 'Zoho CRM', logo: '📋' },
    { id: 'monday', name: 'Monday.com', logo: '📅' },
    { id: 'airtable', name: 'Airtable', logo: '📝' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'bg-green-100 text-green-800',
      syncing: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800',
      disconnected: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === 'connected' ? 'Connected' : 
         status === 'syncing' ? 'Syncing...' :
         status === 'error' ? 'Error' : 'Not Connected'}
      </Badge>
    );
  };

  const handleConnect = (crmId: string) => {
    // Simulate OAuth flow
    setIntegrations(prev => prev.map(integration => 
      integration.id === crmId 
        ? { ...integration, connected: true, status: 'syncing' as const }
        : integration
    ));

    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === crmId 
          ? { 
              ...integration, 
              status: 'connected' as const, 
              lastSync: new Date(),
              recordCount: Math.floor(Math.random() * 2000) + 100
            }
          : integration
      ));
    }, 3000);
  };

  const handleRequestIntegration = () => {
    // Send request to DevOS
    console.log('Integration request:', requestDetails);
    setIsRequestModalOpen(false);
    setRequestDetails({ crm: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CRM Integration</h2>
          <p className="text-muted-foreground">Connect your CRM systems for seamless data sync</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add CRM Integration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {availableCRMs.map((crm) => (
                  <Button
                    key={crm.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-4"
                    onClick={() => {
                      handleConnect(crm.id);
                      setIsAddModalOpen(false);
                    }}
                  >
                    <span className="text-2xl mr-3">{crm.logo}</span>
                    <div className="text-left">
                      <div className="font-medium">{crm.name}</div>
                      <div className="text-sm text-muted-foreground">Connect via OAuth</div>
                    </div>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Request Integration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Custom Integration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">CRM Name</label>
                  <Input
                    value={requestDetails.crm}
                    onChange={(e) => setRequestDetails(prev => ({ ...prev, crm: e.target.value }))}
                    placeholder="e.g., Custom CRM, Legacy System"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description & Requirements</label>
                  <Textarea
                    value={requestDetails.description}
                    onChange={(e) => setRequestDetails(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please describe your CRM system and integration requirements..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleRequestIntegration} className="w-full">
                  Send Request to Dev Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{integration.logo}</span>
                  {integration.name}
                </CardTitle>
                {getStatusIcon(integration.status)}
              </div>
              {getStatusBadge(integration.status)}
            </CardHeader>
            <CardContent className="space-y-4">
              {integration.connected && (
                <>
                  {integration.lastSync && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Last sync: </span>
                      <span className="font-medium">
                        {integration.lastSync.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  )}
                  
                  {integration.recordCount && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Records synced: </span>
                      <span className="font-medium">{integration.recordCount.toLocaleString()}</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2">
                {!integration.connected ? (
                  <Button 
                    className="flex-1" 
                    onClick={() => handleConnect(integration.id)}
                  >
                    Connect
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sync
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Email Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect your email accounts to sync relevant data for Lead Profiles, Rep OS, Automations, and AI suggestions.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">
              Connect Gmail
            </Button>
            <Button variant="outline">
              Connect Outlook
            </Button>
            <Button variant="outline">
              Custom Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMIntegrationTab;
