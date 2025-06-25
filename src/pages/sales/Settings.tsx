
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, Bell, Lock, Palette, Integrations, Mic, Phone, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [callRecording, setCallRecording] = useState(true);

  const integrations = [
    {
      name: 'Salesforce',
      status: 'connected',
      description: 'Sync leads and opportunities',
      lastSync: '2 hours ago'
    },
    {
      name: 'HubSpot',
      status: 'disconnected',
      description: 'CRM and marketing automation',
      lastSync: 'Never'
    },
    {
      name: 'Gmail',
      status: 'connected',
      description: 'Email integration for outreach',
      lastSync: '5 minutes ago'
    },
    {
      name: 'Zoom',
      status: 'disconnected',
      description: 'Video conferencing for demos',
      lastSync: 'Never'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pl-72">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="voice">Voice & Calls</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-6 w-6" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-gray-600">Switch to dark theme</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Time Zone</Label>
                    <Select defaultValue="est">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Default Page</Label>
                    <Select defaultValue="dashboard">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="pipeline">Pipeline</SelectItem>
                        <SelectItem value="inbox">Inbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Nudges</Label>
                    <p className="text-sm text-gray-600">Get AI-powered sales suggestions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Follow-up Reminders</Label>
                    <p className="text-sm text-gray-600">Reminders for scheduled follow-ups</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Performance Updates</Label>
                    <p className="text-sm text-gray-600">Weekly performance summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch />
                </div>

                <div>
                  <Label>Notification Schedule</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="startTime" className="text-sm">Start Time</Label>
                      <Input id="startTime" type="time" defaultValue="09:00" />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-sm">End Time</Label>
                      <Input id="endTime" type="time" defaultValue="18:00" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Integrations className="h-6 w-6" />
                  Connected Integrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {integration.name === 'Gmail' && <Mail className="h-5 w-5" />}
                          {integration.name === 'Zoom' && <Phone className="h-5 w-5" />}
                          {(integration.name === 'Salesforce' || integration.name === 'HubSpot') && <SettingsIcon className="h-5 w-5" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{integration.name}</h4>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                          <p className="text-xs text-gray-500">Last sync: {integration.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={integration.status === 'connected' ? 'default' : 'secondary'}
                          className={integration.status === 'connected' ? 'bg-green-500' : ''}
                        >
                          {integration.status}
                        </Badge>
                        <Button size="sm" variant={integration.status === 'connected' ? 'outline' : 'default'}>
                          {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-6 w-6" />
                  Voice & Call Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Call Recording</Label>
                    <p className="text-sm text-gray-600">Automatically record calls for AI analysis</p>
                  </div>
                  <Switch checked={callRecording} onCheckedChange={setCallRecording} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-time Coaching</Label>
                    <p className="text-sm text-gray-600">Get live AI suggestions during calls</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>Microphone</Label>
                  <Select defaultValue="default">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Microphone</SelectItem>
                      <SelectItem value="headset">Headset Microphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Voice Commands</Label>
                  <p className="text-sm text-gray-600 mb-2">Enable voice commands for hands-free operation</p>
                  <Switch />
                </div>

                <div>
                  <Label>Call Quality</Label>
                  <Select defaultValue="high">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Data Saver)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Sharing</Label>
                    <p className="text-sm text-gray-600">Share anonymized data to improve AI</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics Tracking</Label>
                    <p className="text-sm text-gray-600">Help us improve the product with usage analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div>
                  <Label>Password</Label>
                  <Button variant="outline" className="w-full mt-1">
                    Change Password
                  </Button>
                </div>

                <div>
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Data Export</Label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600">Download your data</p>
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-red-600">Danger Zone</Label>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-600">Permanently delete your account</p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
