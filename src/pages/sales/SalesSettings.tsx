
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Phone, Mail, Shield, Database } from 'lucide-react';

const SalesSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    calls: true
  });

  const [callSettings, setCallSettings] = useState({
    autoRecord: true,
    transcription: true,
    aiCoaching: true,
    dialerMode: 'progressive'
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your sales workspace and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Settings</span>
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" defaultValue="Sales Representative" />
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Lead updates and reminders</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Real-time alerts</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Urgent updates only</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Call Reminders</Label>
                <p className="text-sm text-muted-foreground">Scheduled call alerts</p>
              </div>
              <Switch
                checked={notifications.calls}
                onCheckedChange={(checked) => setNotifications({...notifications, calls: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Call Settings</span>
            </CardTitle>
            <CardDescription>Configure your dialer and call preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Dialer Mode</Label>
              <Select value={callSettings.dialerMode} onValueChange={(value) => setCallSettings({...callSettings, dialerMode: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="progressive">Progressive</SelectItem>
                  <SelectItem value="predictive">Predictive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Record Calls</Label>
                <p className="text-sm text-muted-foreground">Automatically record all calls</p>
              </div>
              <Switch
                checked={callSettings.autoRecord}
                onCheckedChange={(checked) => setCallSettings({...callSettings, autoRecord: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Call Transcription</Label>
                <p className="text-sm text-muted-foreground">Generate call transcripts</p>
              </div>
              <Switch
                checked={callSettings.transcription}
                onCheckedChange={(checked) => setCallSettings({...callSettings, transcription: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Coaching</Label>
                <p className="text-sm text-muted-foreground">Real-time call coaching</p>
              </div>
              <Switch
                checked={callSettings.aiCoaching}
                onCheckedChange={(checked) => setCallSettings({...callSettings, aiCoaching: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>CRM Integration</span>
            </CardTitle>
            <CardDescription>Connect your external tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Primary CRM</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select CRM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salesforce">Salesforce</SelectItem>
                  <SelectItem value="hubspot">HubSpot</SelectItem>
                  <SelectItem value="pipedrive">Pipedrive</SelectItem>
                  <SelectItem value="zoho">Zoho CRM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email Provider</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Email Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="outlook">Outlook</SelectItem>
                  <SelectItem value="custom">Custom SMTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Connect Email
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              API Keys
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesSettings;
