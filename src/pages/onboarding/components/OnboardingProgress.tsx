
import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { STEPS } from './OnboardingStepContent';
import { motion } from 'framer-motion';

const OnboardingProgress: React.FC = () => {
  const { currentStep } = useOnboarding();
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;
  
  return (
    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-primary"
        style={{ width: `${progressPercentage}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progressPercentage}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default OnboardingProgress;
