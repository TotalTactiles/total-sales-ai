import { logger } from '@/utils/logger';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Crown, TestTube } from 'lucide-react';
import Logo from '@/components/Logo';
import OnboardingPage from '@/pages/onboarding/OnboardingPage';
import { OnboardingProvider } from '@/pages/onboarding/OnboardingContext';

const OnboardingTest: React.FC = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  if (showOnboarding) {
    return (
      <OnboardingProvider
        initialCompanyId="test-company-id"
        completeOnboardingFn={async (settings) => {
          logger.info('Test onboarding completed:', settings);
          alert('Test onboarding completed! Check console for details.');
          setShowOnboarding(false);
        }}
        isSubmitting={false}
      >
        <OnboardingPage />
      </OnboardingProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              ONBOARDING TEST
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Back to Auth
          </Button>
        </div>
      </header>

      {/* Test Interface */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <TestTube className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Onboarding Flow Test
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Test the complete onboarding experience with the unified comprehensive flow.
          </p>
        </div>

        <div className="grid grid-cols-1 max-w-2xl mx-auto mb-12">
          {/* Unified Flow Test */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader className="text-center">
              <Crown className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Test Unified Onboarding Flow</CardTitle>
              <p className="text-gray-600">
                Experience the complete comprehensive onboarding process
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div>✓ Industry Selection</div>
                <div>✓ Sales Model Configuration</div>
                <div>✓ Team Roles Setup</div>
                <div>✓ AI Tone Customization</div>
                <div>✓ Pain Points & Objections</div>
                <div>✓ AI Agent Naming</div>
                <div>✓ Module Selection</div>
                <div>✓ Goal Setting</div>
                <div>✓ Dashboard Reveal</div>
              </div>
              <Button
                onClick={() => setShowOnboarding(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Comprehensive Onboarding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-600">
            <div>
              <strong>1. Comprehensive Flow:</strong> This unified onboarding includes all advanced features like industry-specific customization, AI tone settings, and module selection.
            </div>
            <div>
              <strong>2. Real-time Testing:</strong> All changes are logged to the console and can be monitored during the flow.
            </div>
            <div>
              <strong>3. Integration Ready:</strong> Once satisfied with the flow, it can be easily integrated into the main authentication process.
            </div>
            <div>
              <strong>4. Data Persistence:</strong> Test data is saved during the process and can be reviewed for optimization.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OnboardingTest;
