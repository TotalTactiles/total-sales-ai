
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Settings } from 'lucide-react';

const ManagerTeam = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-600">Manage your team members and assignments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Team management dashboard coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerTeam;
