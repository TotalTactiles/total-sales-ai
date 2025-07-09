
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database } from 'lucide-react';
import ZohoCRMIntegration from '@/components/Integrations/ZohoCRMIntegration';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';

const IntegrationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations</h1>
          <p className="text-slate-600">
            Connect your favorite tools and platforms to streamline your sales workflow
          </p>
        </div>

        {/* CRM Integrations Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                CRM Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <ZohoCRMIntegration />
              </div>
            </CardContent>
          </Card>

          {/* General Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integration Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IntegrationSettings />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
