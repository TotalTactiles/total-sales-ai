
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Link, 
  Palette,
  Save,
  CheckCircle,
  AlertCircle,
  Brain
} from 'lucide-react';

const Settings: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState({
    abn: '12 345 678 901',
    industry: 'Technology',
    teamSize: '10-50',
    salesChannels: ['Online', 'Phone', 'In-person']
  });

  const [profileSettings, setProfileSettings] = useState({
    name: 'John Manager',
    title: 'Sales Manager',
    alertsEnabled: true,
    tonePreference: 'professional'
  });

  const [featureToggles, setFeatureToggles] = useState({
    aiAssistant: true,
    automatedFollowUp: true,
    leadScoring: true,
    teamAnalytics: true,
    socialMediaSync: false,
    advancedReporting: true
  });

  const [personalization, setPersonalization] = useState({
    aiTone: 'professional',
    dashboardTheme: 'light',
    reportFormat: 'pdf',
    automationDefaults: 'moderate'
  });

  const connectedAccounts = [
    { name: 'HubSpot CRM', status: 'connected', type: 'crm' },
    { name: 'Gmail', status: 'connected', type: 'email' },
    { name: 'Slack', status: 'disconnected', type: 'communication' },
    { name: 'Google Calendar', status: 'connected', type: 'calendar' }
  ];

  const handleSave = () => {
    console.log('Saving settings...');
    // Save all settings and sync to Company Brain and TSAM Brain
  };

  const getStatusIcon = (status: string) => {
    return status === 'connected' ? 
      <CheckCircle className="h-4 w-4 text-green-600" /> : 
      <AlertCircle className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = (status: string) => {
    return status === 'connected' ? 
      <Badge className="bg-green-100 text-green-800">Connected</Badge> :
      <Badge variant="outline">Not Connected</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your account and system preferences</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">ABN</label>
                <Input
                  value={companyInfo.abn}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, abn: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Industry</label>
                <Select value={companyInfo.industry} onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, industry: value }))}>
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
              <div>
                <label className="text-sm font-medium">Team Size</label>
                <Select value={companyInfo.teamSize} onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, teamSize: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="10-50">10-50 employees</SelectItem>
                    <SelectItem value="50-200">50-200 employees</SelectItem>
                    <SelectItem value="200+">200+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Sales Channels</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {companyInfo.salesChannels.map((channel) => (
                    <Badge key={channel} variant="outline">{channel}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manager Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Manager Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={profileSettings.name}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Job Title</label>
                <Input
                  value={profileSettings.title}
                  onChange={(e) => setProfileSettings(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">AI Tone Preference</label>
                <Select value={profileSettings.tonePreference} onValueChange={(value) => setProfileSettings(prev => ({ ...prev, tonePreference: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="supportive">Supportive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Alerts</label>
                <Switch
                  checked={profileSettings.alertsEnabled}
                  onCheckedChange={(checked) => setProfileSettings(prev => ({ ...prev, alertsEnabled: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Feature Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(featureToggles).map(([feature, enabled]) => (
                <div key={feature} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {feature === 'aiAssistant' && 'Enable AI-powered assistance'}
                      {feature === 'automatedFollowUp' && 'Automatic follow-up sequences'}
                      {feature === 'leadScoring' && 'AI-powered lead scoring'}
                      {feature === 'teamAnalytics' && 'Advanced team analytics'}
                      {feature === 'socialMediaSync' && 'Social media integration'}
                      {feature === 'advancedReporting' && 'Enhanced reporting features'}
                    </div>
                  </div>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) => setFeatureToggles(prev => ({ ...prev, [feature]: checked }))}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectedAccounts.map((account) => (
                <div key={account.name} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(account.status)}
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{account.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(account.status)}
                    <Button variant="outline" size="sm">
                      {account.status === 'connected' ? 'Manage' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personalization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personalization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">AI Tone</label>
                <Select value={personalization.aiTone} onValueChange={(value) => setPersonalization(prev => ({ ...prev, aiTone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Dashboard Theme</label>
                <Select value={personalization.dashboardTheme} onValueChange={(value) => setPersonalization(prev => ({ ...prev, dashboardTheme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Report Format</label>
                <Select value={personalization.reportFormat} onValueChange={(value) => setPersonalization(prev => ({ ...prev, reportFormat: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Automation Level</label>
                <Select value={personalization.automationDefaults} onValueChange={(value) => setPersonalization(prev => ({ ...prev, automationDefaults: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Privacy (Visual Only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">Data Privacy Mode</div>
                  <div className="text-sm text-muted-foreground">Enhanced privacy controls</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">Analytics Tracking</div>
                  <div className="text-sm text-muted-foreground">Anonymous usage analytics</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">Data Retention</div>
                  <div className="text-sm text-muted-foreground">Automatic data cleanup</div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Training Loop (Hidden - Backend Only) */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Learning System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">AI continuously learns from your settings and usage patterns</p>
              <p className="text-xs">All data synchronized with Company Brain and TSAM systems</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
