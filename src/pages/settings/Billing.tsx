
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UsageTierSelector from '@/components/RelevanceAI/UsageTierSelector';
import { CreditCard, Zap, Shield } from 'lucide-react';

const BillingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Billing & Usage</h1>
      </div>

      {/* Relevance AI Usage Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Relevance AI Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsageTierSelector />
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-green-800">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Secure Billing</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            All payments are processed securely. Your subscription includes automatic usage monitoring and upgrade notifications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
