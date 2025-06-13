
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, profile, loading, isDemoMode } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or demo mode - let auth flow handle this
  if (!user || isDemoMode()) {
    return <>{children}</>;
  }

  // If user has no profile, something went wrong - force re-auth
  if (!profile) {
    return <>{children}</>;
  }

  // Check if onboarding is needed (skip for developers as they don't need onboarding)
  const needsOnboarding = user && profile?.company_id && 
    profile.role !== 'developer' &&
    !localStorage.getItem(`onboarding_complete_${profile.company_id}`);

  if (needsOnboarding) {
    return <OnboardingPage />;
  }

  return <>{children}</>;
};

export default OnboardingGuard;
