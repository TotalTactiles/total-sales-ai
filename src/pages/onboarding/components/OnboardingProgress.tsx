
import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { STEPS } from './OnboardingStepContent';

const OnboardingProgress: React.FC = () => {
  const { currentStep } = useOnboarding();
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;
  
  return (
    <div className="w-full h-1 bg-slate-200">
      <div 
        className="h-full bg-salesBlue transition-all duration-300 ease-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default OnboardingProgress;
