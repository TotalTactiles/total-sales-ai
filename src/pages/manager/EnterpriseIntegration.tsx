
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Link, Settings } from 'lucide-react';

const EnterpriseIntegration = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enterprise Integration</h1>
        <p className="text-gray-600">Connect with enterprise systems and applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Enterprise Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Link className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Enterprise integration coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseIntegration;
