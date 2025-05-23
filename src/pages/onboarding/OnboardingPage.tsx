
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/components/Logo';

// Import the context and components
import { OnboardingProvider, CompanySettings } from './OnboardingContext';
import OnboardingStepContent, { STEPS } from './components/OnboardingStepContent';
import OnboardingProgress from './components/OnboardingProgress';
import StepNavigation from './components/StepNavigation';
import StepIndicator from './components/StepIndicator';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to build dashboard from settings
  const buildDashboardFromSettings = async () => {
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

  return (
    <OnboardingProvider
      initialCompanyId={profile?.company_id}
      completeOnboardingFn={completeOnboardingHandler}
      isSubmitting={isSubmitting}
    >
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
    </OnboardingProvider>
  );
};

export default OnboardingPage;
