
import React from 'react';
import QuestionFlow from '@/components/onboarding/QuestionFlow';
import { salesRepQuestions } from '@/constants/salesRepQuestions';

const SalesRepOnboarding: React.FC = () => {
  return (
    <QuestionFlow
      questions={salesRepQuestions}
      userRole="sales_rep"
      title="Sales Rep Onboarding"
    />
  );
};

export default SalesRepOnboarding;
