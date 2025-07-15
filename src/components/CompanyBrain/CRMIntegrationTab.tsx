
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  Mail,
  Calendar,
  MessageSquare,
  Zap
} from 'lucide-react';

const CRMIntegrationTab: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const crmSystems = [
    { name: 'Salesforce', connected: true, lastSync: '1 hour ago', status: 'success' },
    { name: 'HubSpot', connected: true, lastSync: '30 mins ago', status: 'syncing' },
    { name: 'Pipedrive', connected: false, lastSync: 'Never', status: 'disconnected' }
  ];

  const emailProviders = [
    { name: 'Gmail', connected: true, lastSync: '15 mins ago', status: 'success' },
    { name: 'Outlook', connected: false, lastSync: 'Never', status: 'disconnected' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-orange-100 text-orange-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <Clock className="h-4 w-4" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="crm" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="crm">CRM Systems</TabsTrigger>
          <TabsTrigger value="email">Email Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  CRM Integration
                </CardTitle>
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Integration
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Connect CRM System</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <Database className="h-6 w-6" />
                        <span className="text-sm">Salesforce</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <Database className="h-6 w-6" />
                        <span className="text-sm">HubSpot</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <Database className="h-6 w-6" />
                        <span className="text-sm">Pipedrive</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <MessageSquare className="h-6 w-6" />
                        <span className="text-sm">Request Integration</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crmSystems.map((crm) => (
                  <div key={crm.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{crm.name}</h4>
                        <p className="text-sm text-gray-500">Last sync: {crm.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(crm.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(crm.status)}
                          <span className="capitalize">{crm.status === 'success' ? 'Connected' : crm.status}</span>
                        </div>
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailProviders.map((provider) => (
                  <div key={provider.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-sm text-gray-500">Last sync: {provider.lastSync}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(provider.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(provider.status)}
                          <span className="capitalize">{provider.status === 'success' ? 'Connected' : provider.status}</span>
                        </div>
                      </Badge>
                      <Button 
                        variant={provider.connected ? "outline" : "default"} 
                        size="sm"
                      >
                        {provider.connected ? 'Settings' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Email Integration Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Syncs OS-relevant email data only</li>
                  <li>• Powers Lead Profiles with communication history</li>
                  <li>• Enables Rep OS email integration</li>
                  <li>• Supports automation sequences and AI suggestions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMIntegrationTab;
