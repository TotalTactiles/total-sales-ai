
import React, { createContext, useContext, useState } from 'react';

// Type for company settings
export interface CompanySettings {
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
    marketTypeSet?: boolean;
  };
  marketType?: string;
  customIndustry?: string;
}

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  settings: CompanySettings;
  updateSettings: (data: Partial<CompanySettings>) => void;
  isSubmitting: boolean;
  completeOnboarding: () => Promise<void>;
}

const defaultSettings: CompanySettings = {
  company_id: '',
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
};

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
  initialCompanyId?: string;
  completeOnboardingFn: (settings: CompanySettings) => Promise<void>;
  isSubmitting: boolean;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ 
  children, 
  initialCompanyId, 
  completeOnboardingFn,
  isSubmitting 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<CompanySettings>({
    ...defaultSettings,
    company_id: initialCompanyId || '',
  });

  const updateSettings = (data: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = async () => {
    await completeOnboardingFn(settings);
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        settings,
        updateSettings,
        isSubmitting,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
