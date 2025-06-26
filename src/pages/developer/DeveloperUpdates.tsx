
import React from 'react';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const DeveloperUpdates = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DeveloperNavigation />
      <div className="ml-64 p-6">
        <h1 className="text-3xl font-bold text-white mb-8">System Updates</h1>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Deployment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">System update tracking coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperUpdates;
