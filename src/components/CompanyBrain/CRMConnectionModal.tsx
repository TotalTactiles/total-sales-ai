
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  ExternalLink, 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface CRMConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (crmId: string) => void;
  onRequestIntegration: (request: any) => void;
}

const CRMConnectionModal: React.FC<CRMConnectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onConnect,
  onRequestIntegration 
}) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    crmName: '',
    companyName: '',
    description: '',
    urgency: 'medium'
  });

  const crmOptions = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'World\'s leading CRM platform for enterprise sales',
      logo: '🔵',
      status: 'available',
      features: ['Lead Management', 'Opportunity Tracking', 'Analytics', 'Automation']
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      description: 'Simple and effective CRM for sales teams',
      logo: '🟡',
      status: 'available',
      features: ['Pipeline Management', 'Deal Tracking', 'Email Integration', 'Reports']
    },
    {
      id: 'monday',
      name: 'Monday CRM',
      description: 'Work management platform with CRM capabilities',
      logo: '🟣',
      status: 'available',
      features: ['Project Management', 'Customer Tracking', 'Workflows', 'Collaboration']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Inbound marketing and sales platform',
      logo: '🟠',
      status: 'available',
      features: ['Marketing Automation', 'Lead Nurturing', 'Analytics', 'Content Management']
    },
    {
      id: 'zoho',
      name: 'Zoho CRM',
      description: 'Comprehensive CRM with lead management and automation',
      logo: '🔴',
      status: 'available',
      features: ['Lead Management', 'Sales Automation', 'Analytics', 'Mobile App']
    },
    {
      id: 'clickup',
      name: 'ClickUp',
      description: 'Project management with CRM capabilities',
      logo: '🟢',
      status: 'available',
      features: ['Task Management', 'Customer Tracking', 'Time Tracking', 'Integrations']
    }
  ];

  const handleConnect = (crmId: string) => {
    toast.info(`Connecting to ${crmOptions.find(c => c.id === crmId)?.name}...`);
    
    // Simulate OAuth flow
    setTimeout(() => {
      onConnect(crmId);
      toast.success(`Successfully connected to ${crmOptions.find(c => c.id === crmId)?.name}!`);
      onClose();
    }, 2000);
  };

  const handleRequestSubmit = () => {
    if (!requestData.crmName || !requestData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const request = {
      ...requestData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      type: 'crm_integration_request'
    };

    onRequestIntegration(request);
    toast.success('Integration request submitted! Our team will review and get back to you.');
    
    // Reset form
    setRequestData({ crmName: '', companyName: '', description: '', urgency: 'medium' });
    setShowRequestForm(false);
    onClose();
  };

  if (showRequestForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Request CRM Integration
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <p className="text-blue-800 text-sm">
                Don't see your CRM? Request a custom integration and our team will prioritize it based on demand.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">CRM Name *</label>
                <Input
                  placeholder="e.g., Close.io, Freshworks, SugarCRM"
                  value={requestData.crmName}
                  onChange={(e) => setRequestData({...requestData, crmName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  placeholder="Your company name"
                  value={requestData.companyName}
                  onChange={(e) => setRequestData({...requestData, companyName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Why do you need this integration? *</label>
                <Textarea
                  placeholder="Describe your use case, current workflow, and how this would help your team..."
                  value={requestData.description}
                  onChange={(e) => setRequestData({...requestData, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Priority Level</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={requestData.urgency}
                  onChange={(e) => setRequestData({...requestData, urgency: e.target.value})}
                >
                  <option value="low">Low - Nice to have</option>
                  <option value="medium">Medium - Would be helpful</option>
                  <option value="high">High - Critical for our workflow</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleRequestSubmit} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                Back to CRM List
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connect Your CRM
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crmOptions.map((crm) => (
              <Card key={crm.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{crm.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{crm.name}</CardTitle>
                        <Badge 
                          className={crm.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {crm.status === 'available' ? 'Available' : 'Coming Soon'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{crm.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {crm.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleConnect(crm.id)}
                    className="w-full"
                    disabled={crm.status !== 'available'}
                  >
                    {crm.status === 'available' ? (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect {crm.name}
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Coming Soon
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Request Integration Section */}
          <div className="border-t pt-6">
            <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <AlertCircle className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Don't see your CRM?</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Request a custom integration and we'll prioritize it based on user demand
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRequestForm(true)}
                    className="mt-3"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Request Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMConnectionModal;
