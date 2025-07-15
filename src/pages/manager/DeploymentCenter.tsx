
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DeploymentCenter: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deployment Center</h1>
        <Button>Deploy New Version</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Production v2.1.4</span>
                <span className="text-green-600">Stable</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Staging v2.2.0</span>
                <span className="text-blue-600">Testing</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>v2.1.4 - 2 days ago</span>
                <span className="text-green-600">Success</span>
              </div>
              <div className="flex items-center justify-between">
                <span>v2.1.3 - 1 week ago</span>
                <span className="text-green-600">Success</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeploymentCenter;
