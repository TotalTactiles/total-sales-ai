
import React, { useState } from 'react';
import AcademyLayout from './AcademyLayout';
import { useEnhancedUsageTracking } from '@/hooks/useEnhancedUsageTracking';

const CompanyBrainSalesRep: React.FC = () => {
  const { trackEvent } = useEnhancedUsageTracking();

  React.useEffect(() => {
    trackEvent({
      feature: 'company_brain_sales_rep',
      action: 'page_load',
      context: 'academy_access',
      metadata: { timestamp: Date.now() }
    });
  }, []);

  return <AcademyLayout />;
};

export default CompanyBrainSalesRep;
