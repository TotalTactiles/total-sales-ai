
import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Zap, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const SalesSettings = () => {
  const { leads } = useLeads();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore comprehensive settings and preferences.');
  };

  // Mock settings state
  const [settings, setSettings] = useState({
    profile: {
      name: 'Alex Johnson',
      email: 'alex.johnson@company.com',
      phone: '+1 (555) 123-4567',
      title: 'Senior Sales Representative',
      timezone: 'America/New_York'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      leadAlerts: true,
      taskReminders: true,
      weeklyReports: true
    },
    ai: {
      autoSuggestions: true,
      emailDrafting: true,
      callScripts: true,
      leadScoring: true,
      aiConfidence: [80]
    },
    dialer: {
      autoDialing: false,
      voicemailDrop: true,
      callRecording: true,
      dialerSpeed: [2],
      maxAttempts: [3]
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      personalizedAds: false,
      thirdPartyIntegrations: true
    }
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
    toast.success('Setting updated successfully');
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleResetSettings = () => {
    toast.info('Settings reset to default values');
  };

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Sales Settings" 
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
        <DemoModeIndicator workspace="Sales Settings & Preferences" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize your sales workspace and preferences
          </p>
        </div>
        <Button variant="outline" onClick={handleResetSettings}>
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="dialer">Dialer</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={settings.profile.title}
                    onChange={(e) => handleSettingChange('profile', 'title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.profile.timezone}
                    onValueChange={(value) => handleSettingChange('profile', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile}>
                Save Profile Changes
              </Button>
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
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive urgent alerts via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser and app notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lead-alerts">New Lead Alerts</Label>
                    <p className="text-sm text-muted-foreground">Instant notifications for new leads</p>
                  </div>
                  <Switch
                    id="lead-alerts"
                    checked={settings.notifications.leadAlerts}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'leadAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="task-reminders">Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Reminders for scheduled tasks</p>
                  </div>
                  <Switch
                    id="task-reminders"
                    checked={settings.notifications.taskReminders}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'taskReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly performance summaries</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => handleSettingChange('notifications', 'weeklyReports', checked)}
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
                <Zap className="h-5 w-5" />
                AI Assistant Settings
              </CardTitle>
              <CardDescription>
                Configure your AI assistant behavior and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-suggestions">Auto Suggestions</Label>
                    <p className="text-sm text-muted-foreground">Show AI-powered suggestions in real-time</p>
                  </div>
                  <Switch
                    id="auto-suggestions"
                    checked={settings.ai.autoSuggestions}
                    onCheckedChange={(checked) => handleSettingChange('ai', 'autoSuggestions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-drafting">Email Drafting</Label>
                    <p className="text-sm text-muted-foreground">AI assistance for email composition</p>
                  </div>
                  <Switch
                    id="email-drafting"
                    checked={settings.ai.emailDrafting}
                    onCheckedChange={(checked) => handleSettingChange('ai', 'emailDrafting', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="call-scripts">Call Scripts</Label>
                    <p className="text-sm text-muted-foreground">AI-generated call scripts and talking points</p>
                  </div>
                  <Switch
                    id="call-scripts"
                    checked={settings.ai.callScripts}
                    onCheckedChange={(checked) => handleSettingChange('ai', 'callScripts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lead-scoring">Lead Scoring</Label>
                    <p className="text-sm text-muted-foreground">Automatic lead prioritization</p>
                  </div>
                  <Switch
                    id="lead-scoring"
                    checked={settings.ai.leadScoring}
                    onCheckedChange={(checked) => handleSettingChange('ai', 'leadScoring', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>AI Confidence Threshold</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimum confidence level for AI suggestions ({settings.ai.aiConfidence[0]}%)
                  </p>
                  <Slider
                    value={settings.ai.aiConfidence}
                    onValueChange={(value) => handleSettingChange('ai', 'aiConfidence', value)}
                    max={100}
                    min={50}
                    step={5}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dialer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Dialer Configuration
              </CardTitle>
              <CardDescription>
                Configure auto-dialer settings and call preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-dialing">Auto Dialing</Label>
                    <p className="text-sm text-muted-foreground">Automatically dial leads in sequence</p>
                  </div>
                  <Switch
                    id="auto-dialing"
                    checked={settings.dialer.autoDialing}
                    onCheckedChange={(checked) => handleSettingChange('dialer', 'autoDialing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voicemail-drop">Voicemail Drop</Label>
                    <p className="text-sm text-muted-foreground">Automatically leave pre-recorded voicemails</p>
                  </div>
                  <Switch
                    id="voicemail-drop"
                    checked={settings.dialer.voicemailDrop}
                    onCheckedChange={(checked) => handleSettingChange('dialer', 'voicemailDrop', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="call-recording">Call Recording</Label>
                    <p className="text-sm text-muted-foreground">Record calls for training and compliance</p>
                  </div>
                  <Switch
                    id="call-recording"
                    checked={settings.dialer.callRecording}
                    onCheckedChange={(checked) => handleSettingChange('dialer', 'callRecording', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Dialer Speed</Label>
                  <p className="text-sm text-muted-foreground">
                    Calls per minute ({settings.dialer.dialerSpeed[0]} CPM)
                  </p>
                  <Slider
                    value={settings.dialer.dialerSpeed}
                    onValueChange={(value) => handleSettingChange('dialer', 'dialerSpeed', value)}
                    max={5}
                    min={1}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Max Attempts per Lead</Label>
                  <p className="text-sm text-muted-foreground">
                    Maximum call attempts ({settings.dialer.maxAttempts[0]} attempts)
                  </p>
                  <Slider
                    value={settings.dialer.maxAttempts}
                    onValueChange={(value) => handleSettingChange('dialer', 'maxAttempts', value)}
                    max={10}
                    min={1}
                    step={1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your data privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share anonymized data for product improvement</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.privacy.dataSharing}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'dataSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve the platform with usage data</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'analytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="personalized-ads">Personalized Ads</Label>
                    <p className="text-sm text-muted-foreground">Receive personalized recommendations</p>
                  </div>
                  <Switch
                    id="personalized-ads"
                    checked={settings.privacy.personalizedAds}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'personalizedAds', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="third-party">Third-party Integrations</Label>
                    <p className="text-sm text-muted-foreground">Allow connections to external services</p>
                  </div>
                  <Switch
                    id="third-party"
                    checked={settings.privacy.thirdPartyIntegrations}
                    onCheckedChange={(checked) => handleSettingChange('privacy', 'thirdPartyIntegrations', checked)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesSettings;
