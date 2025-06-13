
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const ManagerSecurity: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security</h1>
          <p className="text-muted-foreground">Security settings and permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Security Management</h3>
            <p className="text-muted-foreground">Advanced security controls and permissions coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerSecurity;
