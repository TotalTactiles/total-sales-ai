import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, RefreshCw } from 'lucide-react';

const MarketingAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Marketing Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          View campaign performance and audience engagement metrics.
        </p>
        <Button variant="outline" size="sm">
          Refresh Data
          <RefreshCw className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MarketingAnalytics;
