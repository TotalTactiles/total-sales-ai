
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboarding } from '../OnboardingContext';
import { STEPS } from './OnboardingStepContent';
import { motion } from 'framer-motion';

const StepNavigation: React.FC = () => {
  const { currentStep, setCurrentStep, isSubmitting } = useOnboarding();
  
  // Go to next step
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <motion.div 
      className="flex justify-between mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {currentStep > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={isSubmitting}
            className="flex items-center group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" /> 
            Back
          </Button>
        </motion.div>
      )}
      
      {currentStep < STEPS.length - 1 ? (
        <motion.div
          className="ml-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={nextStep}
            className="flex items-center group"
          >
            Next <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-[2px] transition-transform" />
          </Button>
        </motion.div>
      ) : (
        <div /> // Empty div for spacing when on last step
      )}
    </motion.div>
  );
};

export default StepNavigation;
