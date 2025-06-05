
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

// Import the context and components
import { OnboardingProvider, CompanySettings, buildDashboardFromSettings } from './OnboardingContext';
import OnboardingStepContent, { STEPS } from './components/OnboardingStepContent';
import OnboardingProgress from './components/OnboardingProgress';
import StepNavigation from './components/StepNavigation';
import StepIndicator from './components/StepIndicator';
import AIAssistantHelper from '@/components/AIAssistant/AIAssistantHelper';

// Define the tour steps for the guided tutorial
const DASHBOARD_TOUR_STEPS = [
  {
    title: 'Welcome to Your Dashboard',
    description: 'This is your personalized SalesOS dashboard. Let me show you around!',
  },
  {
    title: 'Navigation',
    description: 'Use the sidebar to navigate between different sections of the platform.',
    targetSelector: '.sidebar'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Here you can track your sales performance and team metrics at a glance.',
    targetSelector: '.analytics-dashboard'
  },
  {
    title: 'Smart Dialer',
    description: 'Make AI-assisted calls with real-time coaching and objection handling.',
    targetSelector: '.dialer-module'
  },
  {
    title: 'AI Brain',
    description: 'Access your company knowledge and get intelligent answers to your questions.',
    targetSelector: '.brain-module'
  },
  {
    title: 'Need Help?',
    description: 'I\'m always here to help. Click on me anytime you have questions!',
  },
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Check if user should be redirected if onboarding is already done
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!profile?.company_id) return;
      
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('onboarding_completed_at')
          .eq('company_id', profile.company_id)
          .maybeSingle();
          
        if (error) throw error;
        
        // If onboarding is already complete, redirect to dashboard
        if (data?.onboarding_completed_at) {
          const redirectPath = profile.role === 'manager' ? '/manager/dashboard' : '/sales/dashboard';
          navigate(redirectPath);
        }
      } catch (err) {
        console.error('Error checking onboarding status:', err);
      }
    };
    
    checkOnboardingStatus();
  }, [profile?.company_id, navigate]);

  // Function to build dashboard from settings
  const buildDashboardFromSettingsHandler = async () => {
    // In a real implementation, this could trigger a backend process
    // For now, just simulate a delay
    return new Promise<void>(resolve => setTimeout(resolve, 1500));
  };

  // Complete the onboarding process
  const completeOnboardingHandler = async (settings: CompanySettings) => {
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
          onboarding_completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Build dashboard from settings
      await buildDashboardFromSettings({
        companyId: profile.company_id,
        settings: settings
      });
      
      // Show completion state briefly before redirecting
      setOnboardingComplete(true);
      
      // After a delay, redirect to the appropriate dashboard
      setTimeout(() => {
        toast.success('Onboarding complete! Welcome to your SalesOS.');
        navigate('/manager/dashboard');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error saving onboarding settings:', error);
      toast.error('Failed to save settings: ' + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingProvider
      initialCompanyId={profile?.company_id}
      completeOnboardingFn={completeOnboardingHandler}
      isSubmitting={isSubmitting}
    >
      {onboardingComplete ? (
        // Show completion state with assistant before redirect
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-background to-slate-50 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <Logo className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Welcome to SalesOS!</h1>
            <p className="text-muted-foreground">Your personalized sales platform is ready.</p>
            <p className="text-muted-foreground mt-1">Taking you to your dashboard...</p>
          </motion.div>
          
          {/* Show AI Assistant with first-time tour */}
          <AIAssistantHelper
            agentName={profile?.company_id ? undefined : 'SalesOS'}
            introMessage="Welcome to SalesOS! Let me show you around your new dashboard."
            tourSteps={DASHBOARD_TOUR_STEPS}
          />
        </motion.div>
      ) : (
        // Normal onboarding flow
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
          <OnboardingProgress />
          
          {/* Main content */}
          <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
            <Card className="p-6 shadow-md">
              {/* Current step content */}
              <div className="mb-8">
                <OnboardingStepContent />
              </div>
              
              {/* Navigation buttons */}
              <StepNavigation />
            </Card>
            
            {/* Step indicator */}
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-2">
                {STEPS.map((_, index) => (
                  <StepIndicator key={index} stepIndex={index} />
                ))}
              </div>
            </div>
          </main>
        </div>
      )}
    </OnboardingProvider>
  );
};

export default OnboardingPage;
