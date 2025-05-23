
import React from 'react';
import { useOnboarding } from '../OnboardingContext';

// Import all step components
import IndustryStep from '../steps/IndustryStep';
import SalesModelStep from '../steps/SalesModelStep';
import TeamRolesStep from '../steps/TeamRolesStep';
import ToneStep from '../steps/ToneStep';
import ObjectionsStep from '../steps/ObjectionsStep';
import AgentNameStep from '../steps/AgentNameStep';
import ModulesStep from '../steps/ModulesStep';
import GoalStep from '../steps/GoalStep';
import RevealStep from '../steps/RevealStep';

// Define the onboarding steps
export const STEPS = [
  'industry',
  'salesModel',
  'teamRoles',
  'tone',
  'objections',
  'agentName',
  'modules',
  'goal',
  'reveal',
];

const OnboardingStepContent: React.FC = () => {
  const { currentStep, settings, updateSettings, completeOnboarding, isSubmitting } = useOnboarding();

  // Render the current step
  const renderStep = () => {
    switch (STEPS[currentStep]) {
      case 'industry':
        return <IndustryStep settings={settings} updateSettings={updateSettings} />;
      case 'salesModel':
        return <SalesModelStep settings={settings} updateSettings={updateSettings} />;
      case 'teamRoles':
        return <TeamRolesStep settings={settings} updateSettings={updateSettings} />;
      case 'tone':
        return <ToneStep settings={settings} updateSettings={updateSettings} />;
      case 'objections':
        return <ObjectionsStep settings={settings} updateSettings={updateSettings} />;
      case 'agentName':
        return <AgentNameStep settings={settings} updateSettings={updateSettings} />;
      case 'modules':
        return <ModulesStep settings={settings} updateSettings={updateSettings} />;
      case 'goal':
        return <GoalStep settings={settings} updateSettings={updateSettings} />;
      case 'reveal':
        return <RevealStep 
          settings={settings} 
          completeOnboarding={completeOnboarding}
          isSubmitting={isSubmitting} 
        />;
      default:
        return <div>Step not found</div>;
    }
  };

  return <div className="mb-8">{renderStep()}</div>;
};

export default OnboardingStepContent;
