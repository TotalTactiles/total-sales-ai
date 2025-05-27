
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Crown, TestTube } from 'lucide-react';
import Logo from '@/components/Logo';
import OnboardingFlow from '@/components/Onboarding/OnboardingFlow';
import { OnboardingProvider } from '@/contexts/OnboardingContext';

const OnboardingTest: React.FC = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [testRole, setTestRole] = React.useState<'manager' | 'sales_rep' | null>(null);

  if (showOnboarding) {
    return (
      <OnboardingProvider>
        <OnboardingFlow />
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
            Test the complete onboarding experience for both Manager and Sales Rep roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Manager Flow Test */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader className="text-center">
              <Crown className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Test Manager Flow</CardTitle>
              <p className="text-gray-600">
                Experience the complete onboarding process as a Manager
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div>✓ Role Selection</div>
                <div>✓ Company Setup</div>
                <div>✓ Social Media Integration</div>
                <div>✓ Personal Information</div>
                <div>✓ Company Goals</div>
                <div>✓ Feature Selection</div>
              </div>
              <Button
                onClick={() => {
                  setTestRole('manager');
                  setShowOnboarding(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Manager Onboarding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Sales Rep Flow Test */}
          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Test Sales Rep Flow</CardTitle>
              <p className="text-gray-600">
                Experience the complete onboarding process as a Sales Rep
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div>✓ Role Selection</div>
                <div>✓ Personal Information</div>
                <div>✓ Knowledge Assessment</div>
                <div>✓ Goal Setting</div>
                <div>✓ Feature Selection</div>
              </div>
              <Button
                onClick={() => {
                  setTestRole('sales_rep');
                  setShowOnboarding(true);
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Sales Rep Onboarding
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
              <strong>1. Role-Based Flows:</strong> Each role has a different onboarding sequence with role-specific steps and content.
            </div>
            <div>
              <strong>2. Navigation:</strong> You can go back and forth between steps, or skip the entire onboarding process.
            </div>
            <div>
              <strong>3. Completion:</strong> After completing onboarding, you'll be redirected to the appropriate dashboard.
            </div>
            <div>
              <strong>4. Data Persistence:</strong> Your onboarding progress and choices are saved throughout the process.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OnboardingTest;
