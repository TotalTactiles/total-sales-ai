
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboarding } from '../OnboardingContext';
import { STEPS } from './OnboardingStepContent';

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
    <div className="flex justify-between mt-8">
      {currentStep > 0 && (
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      )}
      
      {currentStep < STEPS.length - 1 ? (
        <Button 
          onClick={nextStep}
          className="ml-auto flex items-center"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div /> // Empty div for spacing when on last step
      )}
    </div>
  );
};

export default StepNavigation;
