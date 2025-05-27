
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OnboardingFlow from './Onboarding/OnboardingFlow';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const { isOnboardingComplete } = useOnboarding();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - let auth flow handle this
  if (!user) {
    return <>{children}</>;
  }

  // Check if onboarding is needed
  const needsOnboarding = user && !isOnboardingComplete && 
    !localStorage.getItem(`onboarding_complete_${user.id}`);

  if (needsOnboarding) {
    return <OnboardingFlow />;
  }

  return <>{children}</>;
};

export default OnboardingGuard;
