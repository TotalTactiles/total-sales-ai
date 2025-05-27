
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  isOnboardingComplete: boolean;
  userRole: 'manager' | 'sales_rep' | null;
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
}

interface OnboardingData {
  role?: 'manager' | 'sales_rep';
  companyName?: string;
  companyLogo?: string;
  website?: string;
  socialAccounts?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    photo?: string;
  };
  goals?: {
    monthlyTarget?: number;
    quarterlyTarget?: number;
    personalGoals?: string[];
  };
  knowledgeLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredFeatures?: string[];
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  // Determine total steps based on role
  const totalSteps = onboardingData.role === 'manager' ? 6 : 5;

  useEffect(() => {
    checkOnboardingStatus();
  }, [user, profile]);

  const checkOnboardingStatus = async () => {
    if (!user || !profile) return;

    // Check if onboarding is already complete
    if (profile.role && localStorage.getItem(`onboarding_complete_${user.id}`)) {
      setIsOnboardingComplete(true);
      return;
    }

    // Set initial role if available
    if (profile.role) {
      setOnboardingData(prev => ({ ...prev, role: profile.role as 'manager' | 'sales_rep' }));
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      // Update user profile with onboarding data
      await supabase
        .from('profiles')
        .update({
          role: onboardingData.role,
          full_name: onboardingData.personalInfo ? 
            `${onboardingData.personalInfo.firstName} ${onboardingData.personalInfo.lastName}` : 
            profile?.full_name
        })
        .eq('id', user.id);

      // Store onboarding completion
      localStorage.setItem(`onboarding_complete_${user.id}`, 'true');
      localStorage.setItem(`onboarding_data_${user.id}`, JSON.stringify(onboardingData));

      // Log onboarding completion
      await supabase
        .from('usage_analytics')
        .insert({
          user_id: user.id,
          company_id: profile?.company_id || user.id,
          event_type: 'onboarding_completed',
          event_data: {
            role: onboardingData.role,
            steps_completed: totalSteps,
            timestamp: new Date().toISOString()
          }
        });

      setIsOnboardingComplete(true);
      toast.success('Welcome to SalesOS! Your account is ready.');

    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };

  const skipOnboarding = async () => {
    if (!user) return;

    try {
      localStorage.setItem(`onboarding_complete_${user.id}`, 'true');
      setIsOnboardingComplete(true);
      toast.info('Onboarding skipped. You can complete setup later in settings.');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
    }
  };

  const value: OnboardingContextType = {
    currentStep,
    totalSteps,
    isOnboardingComplete,
    userRole: onboardingData.role || null,
    onboardingData,
    updateOnboardingData,
    nextStep,
    previousStep,
    completeOnboarding,
    skipOnboarding
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
