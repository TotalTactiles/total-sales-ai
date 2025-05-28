
import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Bell, Database, Palette, Globe, Zap, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerSettings = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore comprehensive system settings and configuration options.');
  };

  // Mock settings data
  const mockSettingsData = {
    organizationSettings: {
      companyName: 'Acme Sales Corp',
      industry: 'Technology',
      timezone: 'America/New_York',
      currency: 'USD',
      fiscalYearStart: 'January',
      workingHours: '9:00 AM - 5:00 PM',
      locale: 'en-US'
    },
    teamSettings: {
      maxTeamSize: 50,
      defaultQuota: 100000,
      commissionStructure: 'Tiered',
      approvalWorkflow: true,
      leadDistribution: 'Round Robin',
      territoryManagement: true
    },
    notificationSettings: [
      {
        category: 'Lead Management',
        settings: [
          { name: 'New lead assigned', email: true, push: true, sms: false },
          { name: 'Lead status changed', email: true, push: false, sms: false },
          { name: 'Lead overdue', email: true, push: true, sms: true }
        ]
      },
      {
        category: 'Team Performance',
        settings: [
          { name: 'Quota milestone reached', email: true, push: true, sms: false },
          { name: 'Performance alert', email: true, push: true, sms: true },
          { name: 'Team goal achieved', email: true, push: true, sms: false }
        ]
      },
      {
        category: 'System & Security',
        settings: [
          { name: 'Security alerts', email: true, push: true, sms: true },
          { name: 'System maintenance', email: true, push: false, sms: false },
          { name: 'Backup completion', email: false, push: false, sms: false }
        ]
      }
    ],
    integrationSettings: [
      {
        name: 'Google Workspace',
        status: 'Connected',
        description: 'Email, Calendar, and Drive integration',
        features: ['Email sync', 'Calendar integration', 'Document sharing'],
        lastSync: '2024-01-21T14:30:00Z'
      },
      {
        name: 'Salesforce',
        status: 'Available',
        description: 'CRM data synchronization',
        features: ['Lead import', 'Contact sync', 'Opportunity tracking'],
        lastSync: null
      },
      {
        name: 'Slack',
        status: 'Connected',
        description: 'Team communication and notifications',
        features: ['Instant notifications', 'Team channels', 'File sharing'],
        lastSync: '2024-01-21T15:00:00Z'
      },
      {
        name: 'Zoom',
        status: 'Available',
        description: 'Video conferencing for sales meetings',
        features: ['Meeting scheduling', 'Recording', 'Screen sharing'],
        lastSync: null
      }
    ],
    customizationOptions: {
      theme: 'System',
      primaryColor: '#2563eb',
      logoUrl: '',
      customFields: 12,
      dashboardLayout: 'Standard',
      reportingViews: 8
    }
  };

  const handleSaveSetting = (setting: string) => {
    toast.success(`${setting} updated successfully`);
  };

  const handleConnectIntegration = (integration: string) => {
    toast.success(`${integration} integration initiated`);
  };

  const handleDisconnectIntegration = (integration: string) => {
    toast.success(`${integration} disconnected`);
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="System Settings & Configuration" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Demo Mode Indicator */}
      {shouldShowMockData && (
        <DemoModeIndicator workspace="System Settings & Organization Configuration" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure organization settings, integrations, and system preferences
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <SettingsIcon className="h-3 w-3 mr-1" />
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Basic information about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input 
                    id="company-name" 
                    defaultValue={mockSettingsData.organizationSettings.companyName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue={mockSettingsData.organizationSettings.industry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue={mockSettingsData.organizationSettings.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue={mockSettingsData.organizationSettings.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                  <Select defaultValue={mockSettingsData.organizationSettings.fiscalYearStart}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working-hours">Working Hours</Label>
                  <Input 
                    id="working-hours" 
                    defaultValue={mockSettingsData.organizationSettings.workingHours}
                  />
                </div>
              </div>
              <Button onClick={() => handleSaveSetting('Organization Information')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Data & Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Control how your data is handled and stored</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Retention</h4>
                  <p className="text-sm text-muted-foreground">Automatically delete old data after specified period</p>
                </div>
                <Select defaultValue="2-years">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="2-years">2 Years</SelectItem>
                    <SelectItem value="3-years">3 Years</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">GDPR Compliance</h4>
                  <p className="text-sm text-muted-foreground">Enable GDPR compliance features</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-muted-foreground">Allow users to export their data</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          {/* Team Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Team Configuration</CardTitle>
              <CardDescription>Configure team settings and workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-team-size">Maximum Team Size</Label>
                  <Input 
                    id="max-team-size" 
                    type="number"
                    defaultValue={mockSettingsData.teamSettings.maxTeamSize}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-quota">Default Monthly Quota</Label>
                  <Input 
                    id="default-quota" 
                    type="number"
                    defaultValue={mockSettingsData.teamSettings.defaultQuota}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission Structure</Label>
                  <Select defaultValue={mockSettingsData.teamSettings.commissionStructure}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat Rate</SelectItem>
                      <SelectItem value="Tiered">Tiered</SelectItem>
                      <SelectItem value="Performance">Performance Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-distribution">Lead Distribution</Label>
                  <Select defaultValue={mockSettingsData.teamSettings.leadDistribution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Round Robin">Round Robin</SelectItem>
                      <SelectItem value="Manual">Manual Assignment</SelectItem>
                      <SelectItem value="AI-Based">AI-Based</SelectItem>
                      <SelectItem value="Territory">Territory Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Approval Workflow</h4>
                    <p className="text-sm text-muted-foreground">Require manager approval for certain actions</p>
                  </div>
                  <Switch defaultChecked={mockSettingsData.teamSettings.approvalWorkflow} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Territory Management</h4>
                    <p className="text-sm text-muted-foreground">Enable geographic territory assignment</p>
                  </div>
                  <Switch defaultChecked={mockSettingsData.teamSettings.territoryManagement} />
                </div>
              </div>
              
              <Button onClick={() => handleSaveSetting('Team Configuration')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Performance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Management</CardTitle>
              <CardDescription>Configure performance tracking and KPIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Performance Reviews</h4>
                  <p className="text-sm text-muted-foreground">Enable quarterly performance reviews</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Goal Tracking</h4>
                  <p className="text-sm text-muted-foreground">Track individual and team goals</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Leaderboards</h4>
                  <p className="text-sm text-muted-foreground">Display team performance rankings</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Settings */}
          {mockSettingsData.notificationSettings.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>Configure notification preferences for {category.category.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.settings.map((setting, settingIndex) => (
                    <div key={settingIndex} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{setting.name}</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={setting.email} />
                          <span className="text-sm">Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={setting.push} />
                          <span className="text-sm">Push</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={setting.sms} />
                          <span className="text-sm">SMS</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* Available Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>Connect with third-party services and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockSettingsData.integrationSettings.map((integration, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                      <Badge variant={integration.status === 'Connected' ? 'default' : 'outline'}>
                        {integration.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <span className="text-sm font-medium">Features:</span>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {integration.lastSync && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Last sync: {new Date(integration.lastSync).toLocaleString()}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      {integration.status === 'Connected' ? (
                        <>
                          <Button size="sm" variant="outline">
                            Configure
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDisconnectIntegration(integration.name)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleConnectIntegration(integration.name)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API access and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">API Access</h4>
                  <p className="text-sm text-muted-foreground">Enable REST API access</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Webhook Notifications</h4>
                  <p className="text-sm text-muted-foreground">Send real-time event notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input 
                  id="webhook-url" 
                  placeholder="https://your-app.com/webhook"
                />
              </div>
              <Button onClick={() => handleSaveSetting('API Configuration')}>
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customization" className="space-y-6">
          {/* Theme & Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Theme & Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue={mockSettingsData.customizationOptions.theme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Dark">Dark</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input 
                    id="primary-color" 
                    type="color"
                    defaultValue={mockSettingsData.customizationOptions.primaryColor}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo-url">Company Logo URL</Label>
                  <Input 
                    id="logo-url" 
                    placeholder="https://your-company.com/logo.png"
                    defaultValue={mockSettingsData.customizationOptions.logoUrl}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dashboard-layout">Dashboard Layout</Label>
                  <Select defaultValue={mockSettingsData.customizationOptions.dashboardLayout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Compact">Compact</SelectItem>
                      <SelectItem value="Detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSaveSetting('Theme & Appearance')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
              <CardDescription>Add custom fields to capture additional information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Active Custom Fields</h4>
                    <p className="text-sm text-muted-foreground">
                      {mockSettingsData.customizationOptions.customFields} custom fields configured
                    </p>
                  </div>
                  <Button>
                    Add Custom Field
                  </Button>
                </div>
                
                {/* Sample custom fields */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">Lead Source Details</span>
                      <Badge variant="outline" className="ml-2">Text</Badge>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">Budget Range</span>
                      <Badge variant="outline" className="ml-2">Number</Badge>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">Decision Timeline</span>
                      <Badge variant="outline" className="ml-2">Date</Badge>
                    </div>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Customization */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customization</CardTitle>
              <CardDescription>Advanced customization options for power users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Custom CSS</h4>
                  <p className="text-sm text-muted-foreground">Apply custom styling</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Custom JavaScript</h4>
                  <p className="text-sm text-muted-foreground">Add custom functionality</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">White Label Mode</h4>
                  <p className="text-sm text-muted-foreground">Remove all branding</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerSettings;
