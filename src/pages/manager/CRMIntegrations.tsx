
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

const ManagerCRMIntegrations: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM Integrations</h1>
          <p className="text-muted-foreground">Connect and manage CRM systems</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            CRM Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">CRM Integration Hub</h3>
            <p className="text-muted-foreground">Connect with popular CRM platforms coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerCRMIntegrations;
