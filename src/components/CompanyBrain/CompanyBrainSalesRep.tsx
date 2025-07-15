
import React, { useState } from 'react';
import AcademyLayout from './AcademyLayout';
import UnifiedAIBubble from '../UnifiedAI/UnifiedAIBubble';
import { useEnhancedUsageTracking } from '@/hooks/useEnhancedUsageTracking';
import { useAILearningInsights } from '@/hooks/useAILearningInsights';

const CompanyBrainSalesRep: React.FC = () => {
  const { trackEvent } = useEnhancedUsageTracking();
  const { insights, patterns, isAnalyzing } = useAILearningInsights();

  React.useEffect(() => {
    trackEvent({
      feature: 'company_brain_sales_rep',
      action: 'page_load',
      context: 'academy_access',
      metadata: { timestamp: Date.now() }
    });
  }, []);

  return (
    <div className="relative">
      <AcademyLayout />
      <UnifiedAIBubble 
        context={{
          workspace: 'company_brain'
        }}
        className="z-50"
      />
    </div>
  );
};

export default CompanyBrainSalesRep;
