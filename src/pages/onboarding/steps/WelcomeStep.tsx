
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  nextStep: () => void;
  prevStep?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  settings?: any;
  updateSettings?: (data: any) => void;
  completeOnboarding?: () => Promise<void>;
  isSubmitting?: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ nextStep }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to SalesOS!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's personalize your sales experience in just a few quick steps. 
          We'll configure everything to match your team's unique needs and goals.
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">What you'll set up:</h2>
        <ul className="text-left space-y-2 max-w-md mx-auto">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Your industry and business model
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Sales goals and team structure
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            AI assistant personality
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Feature preferences
          </li>
        </ul>
      </div>

      <div className="flex justify-center">
        <Button onClick={nextStep} size="lg" className="px-8">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
