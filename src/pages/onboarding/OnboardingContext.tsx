
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Type for company settings
export interface CompanySettings {
  company_id: string;
  industry: string;
  customIndustry?: string;
  marketType?: string;
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
    guidedTourShown?: boolean;
  };
  onboarding_completed_at?: string;
  guided_tour_completed?: boolean;
  last_feedback_check?: string;
}

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  settings: CompanySettings;
  updateSettings: (data: Partial<CompanySettings>) => void;
  isSubmitting: boolean;
  completeOnboarding: () => Promise<void>;
  generateReferralLink: () => Promise<string | null>;
  canUseMetaphoricalUI: boolean;
}

export interface BuildDashboardOptions {
  companyId: string;
  settings: CompanySettings;
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
    guidedTourShown: false,
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
  
  // Check if browser supports advanced animations
  const [canUseMetaphoricalUI, setCanUseMetaphoricalUI] = useState(true);
  
  // Detect browser capabilities for metaphorical UI features
  useEffect(() => {
    // Check if browser supports required features for metaphorical UI
    const checkBrowserCapabilities = () => {
      // Check for WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      // Check for CSS animations 
      const cssAnimationsSupported = 'animate' in document.documentElement.style;
      
      // Check for requestAnimationFrame
      const rafSupported = 'requestAnimationFrame' in window;
      
      // Check for mobile device (simpler UI for mobile)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Set capability based on checks
      setCanUseMetaphoricalUI(!!gl && cssAnimationsSupported && rafSupported && !isMobile);
    };
    
    checkBrowserCapabilities();
  }, []);

  const updateSettings = (data: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...data }));
  };

  const generateReferralLink = async (): Promise<string | null> => {
    if (!settings.company_id) {
      toast.error('Missing company ID. Cannot generate referral link.');
      return null;
    }
    
    try {
      // Generate a unique code
      const code = `${settings.industry.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`;
      
      // Create the referral link in the database - convert settings to plain object for JSON compatibility
      const configSnapshot = JSON.parse(JSON.stringify(settings));
      
      const { error } = await supabase
        .from('referral_links')
        .insert({
          company_id: settings.company_id,
          referral_code: code,
          config_snapshot: configSnapshot
        });
        
      if (error) throw error;
      
      // Return the referral code
      return code;
    } catch (error: any) {
      console.error('Error generating referral link:', error);
      toast.error('Failed to generate referral link: ' + error.message);
      return null;
    }
  };

  const completeOnboarding = async () => {
    // Add completion timestamp
    const enhancedSettings = {
      ...settings,
      onboarding_completed_at: new Date().toISOString()
    };
    
    // Track completion in analytics
    try {
      await supabase
        .from('usage_analytics')
        .insert({
          company_id: settings.company_id,
          event_type: 'onboarding_completed',
          event_data: { settings: enhancedSettings }
        });
    } catch (error) {
      console.error('Failed to track onboarding completion:', error);
    }
    
    // Call the provided completion function
    await completeOnboardingFn(enhancedSettings);
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
        generateReferralLink,
        canUseMetaphoricalUI,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Function to build dashboard from settings - can be imported elsewhere
export const buildDashboardFromSettings = async (options: BuildDashboardOptions): Promise<boolean> => {
  const { companyId, settings } = options;
  
  try {
    // Track the dashboard build start
    await supabase
      .from('usage_analytics')
      .insert({
        company_id: companyId,
        event_type: 'dashboard_build_started',
        event_data: { modules: settings.enabled_modules }
      });
      
    // Configure modules based on settings
    // This is where we would perform any necessary setup for each module
    
    // Update company settings with personalization flag
    await supabase
      .from('company_settings')
      .update({ 
        personalization_flags: {
          ...settings.personalization_flags,
          dashboardCustomized: true
        }
      })
      .eq('company_id', companyId);
    
    // Track successful build
    await supabase
      .from('usage_analytics')
      .insert({
        company_id: companyId,
        event_type: 'dashboard_build_completed',
        event_data: { success: true }
      });
      
    return true;
  } catch (error) {
    console.error('Error building dashboard from settings:', error);
    
    // Track failed build
    await supabase
      .from('usage_analytics')
      .insert({
        company_id: companyId,
        event_type: 'dashboard_build_error',
        event_data: { error: String(error) }
      });
      
    return false;
  }
};
