
import React from 'react';
import DeveloperNavigation from '@/components/Navigation/DeveloperNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const DeveloperFlags = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DeveloperNavigation />
      <div className="ml-64 p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Feature Flags</h1>
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Feature Flag Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Feature flag controls coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperFlags;
