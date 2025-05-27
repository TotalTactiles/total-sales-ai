import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, SkipForward, Check } from 'lucide-react';
import RoleSelection from './steps/RoleSelection';
import CompanySetup from './steps/CompanySetup';
import PersonalSetup from './steps/PersonalSetup';
import SocialIntegration from './steps/SocialIntegration';
import GoalsSetup from './steps/GoalsSetup';
import KnowledgeAssessment from './steps/KnowledgeAssessment';
import FeatureSelection from './steps/FeatureSelection';

const OnboardingFlow: React.FC = () => {
  const {
    currentStep,
    totalSteps,
    userRole,
    nextStep,
    previousStep,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding();

  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <RoleSelection />;
      case 1:
        return userRole === 'manager' ? <CompanySetup /> : <PersonalSetup />;
      case 2:
        return userRole === 'manager' ? <SocialIntegration /> : <KnowledgeAssessment />;
      case 3:
        return userRole === 'manager' ? <PersonalSetup /> : <GoalsSetup />;
      case 4:
        return userRole === 'manager' ? <GoalsSetup /> : <FeatureSelection />;
      case 5:
        return <FeatureSelection />;
      default:
        return <RoleSelection />;
    }
  };

  const getStepTitle = () => {
    const titles = {
      0: 'Choose Your Role',
      1: userRole === 'manager' ? 'Company Setup' : 'Personal Information',
      2: userRole === 'manager' ? 'Social Media Integration' : 'Knowledge Assessment',
      3: userRole === 'manager' ? 'Personal Information' : 'Set Your Goals',
      4: userRole === 'manager' ? 'Set Company Goals' : 'Select Features',
      5: 'Select Features'
    };
    return titles[currentStep as keyof typeof titles] || 'Setup';
  };

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome to SalesOS
          </CardTitle>
          <p className="text-gray-600 mt-2">{getStepTitle()}</p>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {getStepComponent()}

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={previousStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={skipOnboarding}
                className="flex items-center gap-2 text-gray-500"
              >
                <SkipForward className="h-4 w-4" />
                Skip Setup
              </Button>
            </div>

            <Button
              onClick={isLastStep ? completeOnboarding : nextStep}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
