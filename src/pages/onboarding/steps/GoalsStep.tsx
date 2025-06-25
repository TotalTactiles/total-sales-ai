
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface GoalsStepProps {
  settings: any;
  updateSettings: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  completeOnboarding?: () => Promise<void>;
  isSubmitting?: boolean;
}

const GoalsStep: React.FC<GoalsStepProps> = ({ 
  settings, 
  updateSettings, 
  nextStep, 
  prevStep, 
  isFirstStep 
}) => {
  const handleGoalChange = (goal: string) => {
    updateSettings({ original_goal: goal });
  };

  const goalExamples = [
    "Reduce our sales cycle by 20% through better qualification and objection handling",
    "Train new sales reps 50% faster with AI coaching and real-time guidance",
    "Increase deal conversion rates by improving our follow-up process",
    "Standardize our sales approach across the entire team",
    "Help our reps spend less time on admin work and more time selling"
  ];

  const useExample = (example: string) => {
    updateSettings({ original_goal: example });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">What's your main goal?</h1>
        <p className="text-muted-foreground">
          Tell us what you want your SalesOS to help you achieve
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="goal">Your Goal</Label>
          <Textarea
            id="goal"
            placeholder="Describe what you want to accomplish with SalesOS..."
            value={settings.original_goal || ''}
            onChange={(e) => handleGoalChange(e.target.value)}
            className="mt-1 h-32"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            We'll use this to customize your experience and track your progress over time.
          </p>
        </div>

        <div className="mt-8">
          <Label>Need inspiration? Try one of these:</Label>
          <div className="mt-2 space-y-2">
            {goalExamples.map((example, index) => (
              <div 
                key={index}
                className="border border-dashed rounded-lg p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => useExample(example)}
              >
                <p className="text-sm">"{example}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep} disabled={isFirstStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={nextStep} disabled={!settings.original_goal?.trim()}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GoalsStep;
