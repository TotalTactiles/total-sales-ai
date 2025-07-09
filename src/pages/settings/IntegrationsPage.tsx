
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, FileText, Upload, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ZohoCRMIntegration from '@/components/Integrations/ZohoCRMIntegration';
import IntegrationSettings from '@/components/Settings/IntegrationSettings';

const IntegrationsPage: React.FC = () => {
  const { profile } = useAuth();
  const isManager = profile?.role === 'manager';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Integrations</h1>
          <p className="text-slate-600">
            {isManager 
              ? 'Connect your tools and platforms to streamline your team\'s sales workflow'
              : 'Manage your personal workflow with CSV import/export tools'
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

          {/* Sales Rep CSV Tools */}
          {!isManager && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lead Management Tools
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Import and export your leads using CSV files
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Upload className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Import Leads</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload CSV files to add new leads to your pipeline
                    </p>
                    <p className="text-xs text-slate-500">
                      Available from your Sales Dashboard
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Download className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Export Leads</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download your leads as CSV for external use
                    </p>
                    <p className="text-xs text-slate-500">
                      Available from your Sales Dashboard
                    </p>
                  </div>
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
