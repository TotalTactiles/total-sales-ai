
import React from 'react';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ManagerTeam = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ManagerNavigation />
      <div className="ml-64 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Team Management</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Team management features coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerTeam;
