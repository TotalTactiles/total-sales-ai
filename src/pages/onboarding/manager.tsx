
import React from 'react';
import QuestionFlow from '@/components/onboarding/QuestionFlow';
import { managerQuestions } from '@/constants/managerQuestions';

const ManagerOnboarding: React.FC = () => {
  return (
    <QuestionFlow
      questions={managerQuestions}
      userRole="manager"
      title="Manager Onboarding"
    />
  );
};

export default ManagerOnboarding;
