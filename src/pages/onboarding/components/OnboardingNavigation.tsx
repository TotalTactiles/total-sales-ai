
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboarding } from '../OnboardingContext';

interface OnboardingNavigationProps {
  steps: string[];
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({ steps }) => {
  const { currentStep, setCurrentStep, isSubmitting } = useOnboarding();
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Go to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
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
    <>
      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-200">
        <div 
          className="h-full bg-salesBlue transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Navigation buttons */}
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
        
        {currentStep < steps.length - 1 ? (
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
      
      {/* Step indicator */}
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep 
                  ? 'bg-primary' 
                  : index < currentStep 
                    ? 'bg-primary/60' 
                    : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default OnboardingNavigation;
