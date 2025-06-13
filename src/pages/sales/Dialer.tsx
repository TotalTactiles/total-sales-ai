
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';

const SalesDialer: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Power Dialer</h1>
          <p className="text-muted-foreground">Make calls efficiently</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Power Dialer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Phone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Power Dialer System</h3>
            <p className="text-muted-foreground">Efficient calling and contact management.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDialer;
