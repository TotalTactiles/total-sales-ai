
import React from 'react';
import { useOnboarding } from '../OnboardingContext';

interface StepIndicatorProps {
  stepIndex: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ stepIndex }) => {
  const { currentStep } = useOnboarding();
  
  return (
    <div 
      className={`w-2 h-2 rounded-full ${
        stepIndex === currentStep 
          ? 'bg-primary' 
          : stepIndex < currentStep 
            ? 'bg-primary/60' 
            : 'bg-slate-300'
      }`}
    />
  );
};

export default StepIndicator;
