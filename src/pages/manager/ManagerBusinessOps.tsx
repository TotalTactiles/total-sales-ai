
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, DollarSign, Users } from 'lucide-react';

const ManagerBusinessOps = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Business Operations</h1>
        <p className="text-gray-600">Monitor and optimize business operations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Operations Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Business operations dashboard coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerBusinessOps;
