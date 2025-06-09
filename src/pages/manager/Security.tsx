
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import AISecurityDashboard from '@/components/Security/AISecurityDashboard';
import { useAuth } from '@/contexts/AuthContext';

const SecurityPage: React.FC = () => {
  const { profile } = useAuth();

  // Only allow managers and admins
  if (profile?.role !== 'manager' && profile?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Restricted</h2>
            <p className="text-muted-foreground">Security dashboard is only available to managers and administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Center</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage AI security posture, data protection, and access controls
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 mr-1" />
          Secure
        </Badge>
      </div>

      <AISecurityDashboard />
    </div>
  );
};

export default SecurityPage;
