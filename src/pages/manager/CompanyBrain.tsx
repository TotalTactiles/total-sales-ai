
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const ManagerCompanyBrain: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Brain</h1>
          <p className="text-muted-foreground">AI knowledge management system</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Company Brain System</h3>
            <p className="text-muted-foreground">AI-powered knowledge management and training system coming soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerCompanyBrain;
