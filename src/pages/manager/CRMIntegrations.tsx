
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CRMIntegrationsPanel from '@/components/CRM/CRMIntegrationsPanel';
import { Database, TrendingUp, Users } from 'lucide-react';

const ManagerCRMIntegrations = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CRM & Data Management</h1>
          <p className="text-slate-600">
            Manage integrations and oversee data flow across your sales ecosystem
          </p>
        </div>

        <div className="grid gap-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-lg shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Integrations</p>
                    <p className="text-3xl font-bold text-slate-900">3</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Leads Synced Today</p>
                    <p className="text-3xl font-bold text-slate-900">47</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Sync Success Rate</p>
                    <p className="text-3xl font-bold text-slate-900">98.5%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Integration Management</CardTitle>
          </CardHeader>
          <CardContent>
            <CRMIntegrationsPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerCRMIntegrations;
