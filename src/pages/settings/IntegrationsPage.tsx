
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Database, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ZohoCRMIntegration from '@/components/Integrations/ZohoCRMIntegration';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';

const IntegrationsPage: React.FC = () => {
  const { profile } = useAuth();
  
  // Only allow managers to access CRM integrations
  const isManager = profile?.role === 'manager' || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations</h1>
          <p className="text-slate-600">
            Connect your favorite tools and platforms to streamline your workflow
          </p>
        </div>

        {!isManager && (
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              CRM integrations are managed by your team manager. Sales reps can import/export leads via CSV files in the Sales Dashboard.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* CRM Integrations Section - Manager Only */}
          {isManager && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  CRM Integrations
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connect your CRM to sync leads and customer data across your team
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <ZohoCRMIntegration />
                </div>
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
