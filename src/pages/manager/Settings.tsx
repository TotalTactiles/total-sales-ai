
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Brain,
  Users,
  Database,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ManagerSettings = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState({
    // Profile settings
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    company: 'Total Tactiles Inc.',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    dealAlerts: true,
    teamUpdates: true,
    
    // AI settings
    aiSuggestions: true,
    voiceCommands: true,
    autoAnalysis: true,
    smartInsights: true,
    
    // Team settings
    teamSize: 12,
    autoAssignment: true,
    leadDistribution: 'round-robin',
    performanceTracking: true,
    
    // Security settings
    twoFactor: false,
    sessionTimeout: 60,
    dataExport: true
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In a real app, this would save to the backend
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Settings</h1>
          <p className="text-gray-600">Configure your management preferences and team settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={settings.fullName}
                    onChange={(e) => updateSetting('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => updateSetting('company', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value="Sales Manager"
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email updates about important events</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Get real-time notifications in the browser</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Automated weekly team performance reports</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Deal Alerts</h4>
                    <p className="text-sm text-gray-600">Notifications for high-value deals and closures</p>
                  </div>
                  <Switch
                    checked={settings.dealAlerts}
                    onCheckedChange={(checked) => updateSetting('dealAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Team Updates</h4>
                    <p className="text-sm text-gray-600">Updates about team member activities</p>
                  </div>
                  <Switch
                    checked={settings.teamUpdates}
                    onCheckedChange={(checked) => updateSetting('teamUpdates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Assistant Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">AI Suggestions</h4>
                    <p className="text-sm text-gray-600">Enable AI-powered recommendations and insights</p>
                  </div>
                  <Switch
                    checked={settings.aiSuggestions}
                    onCheckedChange={(checked) => updateSetting('aiSuggestions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Voice Commands</h4>
                    <p className="text-sm text-gray-600">Control the AI assistant with voice commands</p>
                  </div>
                  <Switch
                    checked={settings.voiceCommands}
                    onCheckedChange={(checked) => updateSetting('voiceCommands', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Analysis</h4>
                    <p className="text-sm text-gray-600">Automatic analysis of team performance data</p>
                  </div>
                  <Switch
                    checked={settings.autoAnalysis}
                    onCheckedChange={(checked) => updateSetting('autoAnalysis', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Smart Insights</h4>
                    <p className="text-sm text-gray-600">Proactive insights and optimization suggestions</p>
                  </div>
                  <Switch
                    checked={settings.smartInsights}
                    onCheckedChange={(checked) => updateSetting('smartInsights', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    value={settings.teamSize}
                    onChange={(e) => updateSetting('teamSize', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadDistribution">Lead Distribution</Label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={settings.leadDistribution}
                    onChange={(e) => updateSetting('leadDistribution', e.target.value)}
                  >
                    <option value="round-robin">Round Robin</option>
                    <option value="performance-based">Performance Based</option>
                    <option value="manual">Manual Assignment</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Assignment</h4>
                    <p className="text-sm text-gray-600">Automatically assign new leads to team members</p>
                  </div>
                  <Switch
                    checked={settings.autoAssignment}
                    onCheckedChange={(checked) => updateSetting('autoAssignment', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Performance Tracking</h4>
                    <p className="text-sm text-gray-600">Track individual team member performance</p>
                  </div>
                  <Switch
                    checked={settings.performanceTracking}
                    onCheckedChange={(checked) => updateSetting('performanceTracking', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={settings.twoFactor}
                    onCheckedChange={(checked) => updateSetting('twoFactor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Export</h4>
                    <p className="text-sm text-gray-600">Allow data export functionality</p>
                  </div>
                  <Switch
                    checked={settings.dataExport}
                    onCheckedChange={(checked) => updateSetting('dataExport', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                  min="15"
                  max="480"
                />
                <p className="text-sm text-gray-600">Automatically log out after period of inactivity</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerSettings;
