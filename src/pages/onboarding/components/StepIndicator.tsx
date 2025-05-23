
import React from 'react';
import { useOnboarding } from '../OnboardingContext';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  stepIndex: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ stepIndex }) => {
  const { currentStep } = useOnboarding();
  
  return (
    <motion.div 
      className={`relative w-3 h-3 rounded-full ${
        stepIndex === currentStep 
          ? 'bg-primary shadow-glow' 
          : stepIndex < currentStep 
            ? 'bg-primary/60' 
            : 'bg-slate-300'
      }`}
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ 
        scale: stepIndex === currentStep ? 1.2 : 1,
        opacity: stepIndex === currentStep ? 1 : 0.8
      }}
      transition={{ duration: 0.5 }}
    >
      {stepIndex === currentStep && (
        <motion.div
          className="absolute inset-0 bg-primary rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
      )}
    </motion.div>
  );
};

export default StepIndicator;
