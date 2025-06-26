
import React from 'react';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const SalesProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SalesRepNavigation />
      <div className="ml-64 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Sales Rep Profile
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

export default SalesProfile;
