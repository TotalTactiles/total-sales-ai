
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Users, Shield, Bell } from 'lucide-react';

const ManagerSettings = () => {
  return (
    <div className="flex-1 px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Manager Settings</h1>
          <p className="text-muted-foreground">Configure your management dashboard and team settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
              <CardDescription>Configure team roles, permissions, and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Manage Team Roles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configure Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Lead Assignment Rules
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure alerts and notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Performance Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Team Updates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  System Notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Compliance
              </CardTitle>
              <CardDescription>Security settings and compliance configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Access Controls
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Data Privacy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Audit Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>General system and integration settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Integrations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  API Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Backup & Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;
