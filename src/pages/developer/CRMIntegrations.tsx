
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CRMIntegrationsPanel from '@/components/CRM/CRMIntegrationsPanel';

const DeveloperCRMIntegrations = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CRM Integrations - Developer View</h1>
          <p className="text-slate-400">
            Monitor and manage CRM integrations with full system access
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Integration Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CRMIntegrationsPanel />
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Integration Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-slate-700 rounded">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">[SUCCESS]</span>
                    <span className="text-slate-300">2024-01-16 10:30:15</span>
                  </div>
                  <p className="text-white mt-1">Zoho CRM sync completed - 25 leads imported</p>
                </div>
                <div className="p-3 bg-slate-700 rounded">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-400">[INFO]</span>
                    <span className="text-slate-300">2024-01-16 09:15:42</span>
                  </div>
                  <p className="text-white mt-1">ClickUp integration authenticated successfully</p>
                </div>
                <div className="p-3 bg-slate-700 rounded">
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-400">[WARN]</span>
                    <span className="text-slate-300">2024-01-16 08:45:20</span>
                  </div>
                  <p className="text-white mt-1">Salesforce rate limit approaching (80% of quota used)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeveloperCRMIntegrations;
