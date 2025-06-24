
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingProvider } from './OnboardingContext';
import WelcomeStep from './steps/WelcomeStep';
import IndustryStep from './steps/IndustryStep';
import GoalsStep from './steps/GoalsStep';
import PersonalizationStep from './steps/PersonalizationStep';
import AgentPersonalityStep from './steps/AgentPersonalityStep';
import ModuleSelectionStep from './steps/ModuleSelectionStep';
import RevealStep from './steps/RevealStep';
import { toast } from 'sonner';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    industry: '',
    customIndustry: '',
    original_goal: '',
    sales_model: [],
    team_roles: [],
    pain_points: [],
    agent_name: 'AI Assistant',
    tone: {
      humor: 50,
      formality: 50,
      pushiness: 50
    },
    enabled_modules: {
      dialer: true,
      brain: true,
      analytics: true,
      aiAgent: true
    },
    personalization_flags: {
      show_tips: true,
      enable_notifications: true,
      auto_save: true
    }
  });

  const steps = [
    { component: WelcomeStep, title: 'Welcome' },
    { component: IndustryStep, title: 'Industry' },
    { component: GoalsStep, title: 'Goals' },
    { component: PersonalizationStep, title: 'Personalization' },
    { component: AgentPersonalityStep, title: 'AI Personality' },
    { component: ModuleSelectionStep, title: 'Features' },
    { component: RevealStep, title: 'Ready' }
  ];

  // Redirect if user shouldn't be in onboarding
  useEffect(() => {
    if (!user || !profile) return;
    
    // If user is developer or admin, skip onboarding
    if (profile.role === 'developer' || profile.role === 'admin') {
      navigate('/os/dev/dashboard');
      return;
    }
    
    // If onboarding is already completed, redirect to appropriate OS
    if (localStorage.getItem(`onboarding_complete_${profile.company_id}`)) {
      const roleRoute = getRoleRoute(profile.role);
      navigate(roleRoute);
      return;
    }
  }, [user, profile, navigate]);

  const getRoleRoute = (role: string) => {
    switch (role) {
      case 'manager':
        return '/os/manager/dashboard';
      case 'sales_rep':
        return '/os/rep/dashboard';
      case 'developer':
      case 'admin':
        return '/os/dev/dashboard';
      default:
        return '/os/rep/dashboard';
    }
  };

  const completeOnboarding = async () => {
    if (!user || !profile) {
      toast.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    
    try {
      logger.info('Starting onboarding completion:', { 
        userId: user.id, 
        companyId: profile.company_id,
        settings 
      });

      // Save settings to database
      const { error: settingsError } = await supabase
        .from('company_settings')
        .upsert({
          company_id: profile.company_id,
          industry: settings.industry,
          customIndustry: settings.customIndustry,
          original_goal: settings.original_goal,
          sales_model: settings.sales_model,
          team_roles: settings.team_roles,
          pain_points: settings.pain_points,
          agent_name: settings.agent_name,
          tone: settings.tone,
          enabled_modules: settings.enabled_modules,
          personalization_flags: settings.personalization_flags,
          onboarding_completed_at: new Date().toISOString(),
          guided_tour_completed: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'company_id'
        });

      if (settingsError) {
        logger.error('Error saving company settings:', settingsError);
        throw new Error(`Failed to save settings: ${settingsError.message}`);
      }

      // Mark onboarding as complete in localStorage
      localStorage.setItem(`onboarding_complete_${profile.company_id}`, 'true');
      
      logger.info('Onboarding completed successfully, redirecting to OS');
      
      // Show success message
      toast.success('Welcome to SalesOS! Your workspace is ready.');
      
      // Small delay to let the toast show, then redirect
      setTimeout(() => {
        const roleRoute = getRoleRoute(profile.role);
        logger.info('Redirecting to:', roleRoute);
        navigate(roleRoute, { replace: true });
      }, 1000);

    } catch (error) {
      logger.error('Error completing onboarding:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete onboarding');
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* Progress indicator */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Setup Your SalesOS</h1>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step content */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <CurrentStepComponent
                  settings={settings}
                  updateSettings={updateSettings}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === steps.length - 1}
                  completeOnboarding={completeOnboarding}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingPage;
