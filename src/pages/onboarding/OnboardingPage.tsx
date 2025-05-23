
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/Logo';

// Onboarding steps
import IndustryStep from './steps/IndustryStep';
import SalesModelStep from './steps/SalesModelStep';
import TeamRolesStep from './steps/TeamRolesStep';
import ToneStep from './steps/ToneStep';
import ObjectionsStep from './steps/ObjectionsStep';
import AgentNameStep from './steps/AgentNameStep';
import ModulesStep from './steps/ModulesStep';
import GoalStep from './steps/GoalStep';
import RevealStep from './steps/RevealStep';

// Define the onboarding steps
const STEPS = [
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

// Type for company settings
interface CompanySettings {
  company_id: string;
  industry: string;
  sales_model: string[];
  team_roles: string[];
  tone: {
    humor: number;
    formality: number;
    pushiness: number;
    detail: number;
  };
  pain_points: string[];
  agent_name: string;
  enabled_modules: {
    dialer: boolean;
    brain: boolean;
    leads: boolean;
    analytics: boolean;
    missions: boolean;
    tools: boolean;
    aiAgent: boolean;
  };
  original_goal: string;
  personalization_flags: {
    dashboardCustomized: boolean;
    welcomeMessageSent: boolean;
  };
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for company settings
  const [settings, setSettings] = useState<CompanySettings>({
    company_id: profile?.company_id || '',
    industry: '',
    sales_model: [],
    team_roles: [],
    tone: {
      humor: 50,
      formality: 50,
      pushiness: 30,
      detail: 60,
    },
    pain_points: [],
    agent_name: 'SalesOS',
    enabled_modules: {
      dialer: true,
      brain: true,
      leads: true,
      analytics: true,
      missions: false,
      tools: false,
      aiAgent: true,
    },
    original_goal: '',
    personalization_flags: {
      dashboardCustomized: false,
      welcomeMessageSent: false,
    },
  });

  // Update settings with current step data
  const updateSettings = (stepData: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...stepData }));
  };

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

  // Function to build dashboard from settings
  const buildDashboardFromSettings = async () => {
    // In a real implementation, this could trigger a backend process
    // For now, just simulate a delay
    return new Promise<void>(resolve => setTimeout(resolve, 1500));
  };

  // Complete the onboarding process
  const completeOnboarding = async () => {
    if (!profile?.company_id) {
      toast.error('Missing company ID. Cannot save settings.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save settings to Supabase
      const { error } = await supabase
        .from('company_settings')
        .insert({
          ...settings,
          company_id: profile.company_id,
        });
      
      if (error) throw error;
      
      // Build dashboard from settings
      await buildDashboardFromSettings();
      
      toast.success('Onboarding complete! Welcome to your SalesOS.');
      
      // Navigate to appropriate dashboard based on role
      navigate('/dashboard/manager');
    } catch (error: any) {
      console.error('Error saving onboarding settings:', error);
      toast.error('Failed to save settings: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        return <RevealStep settings={settings} completeOnboarding={completeOnboarding} isSubmitting={isSubmitting} />;
      default:
        return <div>Step not found</div>;
    }
  };

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-50 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="text-sm text-muted-foreground">
            Company Onboarding
          </div>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-slate-200">
        <div 
          className="h-full bg-salesBlue transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 shadow-md">
          {/* Current step content */}
          <div className="mb-8">
            {renderStep()}
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
        </Card>
        
        {/* Step indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {STEPS.map((_, index) => (
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
      </main>
    </div>
  );
};

export default OnboardingPage;
