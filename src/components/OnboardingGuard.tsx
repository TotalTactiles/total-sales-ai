
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - allow access for manual testing
  if (!user) {
    console.log('[OnboardingGuard] No user found, allowing access for manual testing');
    return <>{children}</>;
  }

  // If user has no profile, allow access (profile might be loading)
  if (!profile) {
    console.log('[OnboardingGuard] No profile found, allowing access');
    return <>{children}</>;
  }

  // Check if onboarding is needed (skip for developers/admins as they don't need onboarding)
  const needsOnboarding = user && profile?.company_id && 
    profile.role !== 'developer' &&
    profile.role !== 'admin' &&
    !profile.has_completed_onboarding &&
    !localStorage.getItem(`onboarding_complete_${profile.company_id}`);

  console.log('[OnboardingGuard] Auth Status:', {
    authenticated: !!user,
    profileLoaded: !!profile,
    userRole: profile?.role,
    companyId: profile?.company_id,
    needsOnboarding,
    onboardingComplete: profile?.has_completed_onboarding,
    localStorageCheck: localStorage.getItem(`onboarding_complete_${profile.company_id}`)
  });

  if (needsOnboarding) {
    return <OnboardingPage />;
  }

  return <>{children}</>;
};

export default OnboardingGuard;
