
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap } from 'lucide-react';

const DataProtectionCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Protection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Data Encryption (AES-256)</div>
                <div className="text-sm text-gray-600">All sensitive data encrypted at rest and in transit</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Access Control Matrix</div>
                <div className="text-sm text-gray-600">Role-based permissions enforced across all resources</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">AI Audit Trail</div>
                <div className="text-sm text-gray-600">All AI actions logged and monitored in real-time</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Data Leak Prevention</div>
                <div className="text-sm text-gray-600">AI outputs sanitized to prevent sensitive data exposure</div>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Monitoring</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataProtectionCard;
