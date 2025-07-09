
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ZohoCRMIntegration from '@/components/Integrations/ZohoCRMIntegration';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';

const IntegrationsPage: React.FC = () => {
  const { profile } = useAuth();
  const isManager = profile?.role === 'manager';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations</h1>
          <p className="text-slate-600">
            {isManager 
              ? 'Connect your tools and platforms to streamline your team\'s sales workflow'
              : 'Manage your integrations and workflow settings'
            }
          </p>
        </div>

        <div className="space-y-6">
          {/* Manager-only CRM Integrations */}
          {isManager && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  CRM Integrations (Manager Only)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect your CRM to feed data to your entire sales team
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <ZohoCRMIntegration />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sales Rep Note */}
          {!isManager && (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center">
                  Lead management tools (CSV import/export) are available in the Leads section.
                  CRM integrations are managed by your team manager.
                </p>
              </CardContent>
            </Card>
          )}

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
