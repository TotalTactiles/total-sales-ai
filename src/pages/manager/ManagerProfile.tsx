
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const ManagerProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      <div className="ml-64 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manager Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Profile management features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerProfile;
