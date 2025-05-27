
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, profile, loading } = useAuth();

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
  const needsOnboarding = user && profile?.company_id && 
    !localStorage.getItem(`onboarding_complete_${profile.company_id}`);

  if (needsOnboarding) {
    return <OnboardingPage />;
  }

  return <>{children}</>;
};

export default OnboardingGuard;
