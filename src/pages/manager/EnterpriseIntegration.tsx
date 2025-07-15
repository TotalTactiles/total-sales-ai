
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EnterpriseIntegration: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Enterprise Integration</h1>
        <Button>Add Integration</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Salesforce CRM</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Microsoft Teams</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Slack</span>
                <span className="text-red-600">Disconnected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>API Calls Today</span>
                <span>2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Success Rate</span>
                <span>99.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg Response Time</span>
                <span>145ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseIntegration;
