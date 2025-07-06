
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Bell, Shield, Palette, Database } from 'lucide-react';

const SalesSettings: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Customize your Sales OS experience</p>
        </div>
        <Badge className="bg-gray-100 text-gray-800">
          <Settings className="h-3 w-3 mr-1" />
          Preferences
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="Your full name" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="your.email@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <label className="text-sm font-medium">Territory</label>
              <Input placeholder="North America" />
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lead Assignments</p>
                <p className="text-sm text-gray-600">Get notified of new leads</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deal Updates</p>
                <p className="text-sm text-gray-600">Pipeline changes and wins</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Insights</p>
                <p className="text-sm text-gray-600">Smart recommendations</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Digest</p>
                <p className="text-sm text-gray-600">Morning summary email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>

        {/* AI Assistant Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Assistant Name</label>
              <Input placeholder="AI Assistant" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Voice Coaching</p>
                <p className="text-sm text-gray-600">Real-time call guidance</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Lead Scoring</p>
                <p className="text-sm text-gray-600">AI-powered lead prioritization</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Smart Reminders</p>
                <p className="text-sm text-gray-600">Intelligent follow-up alerts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline">Export Data</Button>
            <Button variant="outline">Privacy Settings</Button>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesSettings;
