
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

const BusinessOperationsInsights = () => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            <CardTitle className="text-lg">Business Operations Insights</CardTitle>
          </div>
          <Button variant="secondary" size="sm" className="text-purple-600">
            Read more
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-purple-100">
          AI-powered insights aligned with your business goals
        </p>
      </CardContent>
    </Card>
  );
};

export default BusinessOperationsInsights;
