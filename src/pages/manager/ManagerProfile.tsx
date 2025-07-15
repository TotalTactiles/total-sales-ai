
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const ManagerProfile: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={profile?.full_name || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={profile?.role || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="UTC-5 (EST)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notifications">Email Notifications</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="dailyReports" defaultChecked />
                <Label htmlFor="dailyReports">Daily Reports</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="teamUpdates" defaultChecked />
                <Label htmlFor="teamUpdates">Team Updates</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="systemAlerts" defaultChecked />
                <Label htmlFor="systemAlerts">System Alerts</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">247</div>
              <p className="text-sm text-gray-600">Days Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1,423</div>
              <p className="text-sm text-gray-600">Leads Managed</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">89%</div>
              <p className="text-sm text-gray-600">Team Performance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerProfile;
