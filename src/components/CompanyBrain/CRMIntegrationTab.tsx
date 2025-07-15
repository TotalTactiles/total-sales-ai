
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock,
  Settings,
  RefreshCw,
  Mail,
  Database,
  ExternalLink,
  Ticket
} from 'lucide-react';
import { toast } from 'sonner';
import SocialMediaIntegration from './SocialMediaIntegration';

interface CRMIntegration {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  lastSync: Date | null;
  dataPoints: {
    contacts: number;
    deals: number;
    activities: number;
  };
}

interface EmailProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: 'active' | 'syncing' | 'error';
  lastSync: Date | null;
  syncedData: string[];
}

const CRMIntegrationTab: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestDetails, setRequestDetails] = useState({ name: '', description: '' });

  const [crmIntegrations, setCrmIntegrations] = useState<CRMIntegration[]>([
    {
      id: 'salesforce',
      name: 'Salesforce',
      icon: '☁️',
      description: 'World\'s leading CRM platform for enterprise sales',
      connected: true,
      status: 'active',
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      dataPoints: { contacts: 2340, deals: 156, activities: 890 }
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      icon: '🧡',
      description: 'Inbound marketing and sales platform',
      connected: false,
      status: 'disconnected',
      lastSync: null,
      dataPoints: { contacts: 0, deals: 0, activities: 0 }
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      icon: '🔧',
      description: 'Sales-focused CRM for small to medium businesses',
      connected: false,
      status: 'disconnected',
      lastSync: null,
      dataPoints: { contacts: 0, deals: 0, activities: 0 }
    }
  ]);

  const [emailProviders, setEmailProviders] = useState<EmailProvider[]>([
    {
      id: 'gmail',
      name: 'Gmail',
      icon: '📧',
      connected: true,
      status: 'active',
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      syncedData: ['Lead Emails', 'Rep Communications', 'Automation Triggers']
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: '📮',
      connected: false,
      status: 'error',
      lastSync: null,
      syncedData: []
    }
  ]);

  const availableCRMs = [
    { id: 'zoho', name: 'Zoho CRM', description: 'Comprehensive CRM with lead management' },
    { id: 'monday', name: 'Monday.com', description: 'Work management platform with CRM features' },
    { id: 'freshsales', name: 'Freshsales', description: 'Modern CRM for high-velocity sales teams' },
    { id: 'copper', name: 'Copper', description: 'CRM designed for Google Workspace users' },
    { id: 'activecompaign', name: 'ActiveCampaign', description: 'Customer experience automation' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'syncing': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleConnectCRM = (crmId: string) => {
    toast.info(`OAuth connection for ${crmId} - Feature disabled for demo`);
    setIsAddModalOpen(false);
  };

  const handleConnectEmail = (providerId: string) => {
    toast.info(`Email OAuth for ${providerId} - Feature disabled for demo`);
  };

  const handleRequestIntegration = () => {
    if (!requestDetails.name.trim()) {
      toast.error('Please enter integration name');
      return;
    }
    
    toast.success('Integration request sent to DevOS - You\'ll receive updates via email');
    setIsRequestModalOpen(false);
    setRequestDetails({ name: '', description: '' });
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-8">
      {/* Social Media Integration Section */}
      <SocialMediaIntegration />

      {/* CRM Integration Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">CRM Integration</h3>
            <p className="text-sm text-gray-600">
              Connect your CRM systems to sync leads, contacts, and sales data
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crmIntegrations.map((crm) => (
            <Card key={crm.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{crm.icon}</span>
                    <div>
                      <CardTitle className="text-base">{crm.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(crm.status)} border-current mt-1`}
                      >
                        {getStatusIcon(crm.status)}
                        <span className="ml-1 capitalize">{crm.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{crm.description}</p>

                {crm.connected ? (
                  <>
                    <div className="text-xs">
                      <span className="text-gray-600">Last Sync: </span>
                      <span>{formatTimeAgo(crm.lastSync)}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded p-2">
                        <div className="font-semibold">{crm.dataPoints.contacts}</div>
                        <div className="text-xs text-gray-600">Contacts</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <div className="font-semibold">{crm.dataPoints.deals}</div>
                        <div className="text-xs text-gray-600">Deals</div>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <div className="font-semibold">{crm.dataPoints.activities}</div>
                        <div className="text-xs text-gray-600">Activities</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="destructive" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Button 
                      onClick={() => handleConnectCRM(crm.id)}
                      className="w-full"
                    >
                      Connect {crm.name}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Email Integration Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Email Integrations</h3>
          <p className="text-sm text-gray-600">
            Connect email providers to sync communications and enable automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emailProviders.map((provider) => (
            <Card key={provider.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <CardTitle className="text-base">{provider.name}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(provider.status)} border-current mt-1`}
                      >
                        {getStatusIcon(provider.status)}
                        <span className="ml-1 capitalize">{provider.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {provider.connected ? (
                  <>
                    <div className="text-xs">
                      <span className="text-gray-600">Last Sync: </span>
                      <span>{formatTimeAgo(provider.lastSync)}</span>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Synced Data:</div>
                      <div className="space-y-1">
                        {provider.syncedData.map((data) => (
                          <Badge key={data} variant="secondary" className="text-xs mr-1">
                            {data}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="destructive" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Button 
                      onClick={() => handleConnectEmail(provider.id)}
                      className="w-full"
                    >
                      Connect {provider.name}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Integration Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add CRM Integration</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableCRMs.map((crm) => (
                <Card key={crm.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{crm.name}</h4>
                      <Database className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{crm.description}</p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleConnectCRM(crm.id)}
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center py-4 border-t">
              <p className="text-sm text-gray-600 mb-3">Don't see your CRM?</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsRequestModalOpen(true);
                }}
              >
                <Ticket className="h-4 w-4 mr-2" />
                Request Integration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Integration Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Custom Integration</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Integration Name *</label>
              <Input
                placeholder="e.g., Custom CRM, Legacy System"
                value={requestDetails.name}
                onChange={(e) => setRequestDetails(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full h-24 p-3 border rounded-md resize-none"
                placeholder="Describe the integration requirements, API details, etc..."
                value={requestDetails.description}
                onChange={(e) => setRequestDetails(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">DevOS Integration Request</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your request will be sent to our development team. You'll receive updates 
                    on feasibility, timeline, and implementation via email.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestIntegration}>
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRMIntegrationTab;
