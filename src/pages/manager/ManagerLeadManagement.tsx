
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, TrendingUp } from 'lucide-react';

const ManagerLeadManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        <p className="text-gray-600">Manage leads and pipeline</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Lead Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Lead management dashboard coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerLeadManagement;
