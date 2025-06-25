
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const DemoBanner: React.FC = () => {
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Demo Mode:</strong> You're viewing pre-loaded demo data. Real-time data will be available after completing full onboarding.
      </AlertDescription>
    </Alert>
  );
};

export default DemoBanner;
