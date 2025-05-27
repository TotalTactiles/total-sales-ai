
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Users, User, Crown, Target } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const selectRole = (role: 'manager' | 'sales_rep') => {
    updateOnboardingData({ role });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">What's your role?</h3>
        <p className="text-gray-600">
          Help us customize your SalesOS experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            onboardingData.role === 'manager' 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => selectRole('manager')}
        >
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Manager</h4>
            <p className="text-sm text-gray-600 mb-4">
              Lead teams, analyze performance, and drive company growth
            </p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                Team Management
              </div>
              <div className="flex items-center justify-center gap-1">
                <Target className="h-3 w-3" />
                Analytics & Insights
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            onboardingData.role === 'sales_rep' 
              ? 'ring-2 ring-green-500 bg-green-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => selectRole('sales_rep')}
        >
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">Sales Rep</h4>
            <p className="text-sm text-gray-600 mb-4">
              Close deals, manage leads, and hit your targets
            </p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center justify-center gap-1">
                <Target className="h-3 w-3" />
                Lead Management
              </div>
              <div className="flex items-center justify-center gap-1">
                <Users className="h-3 w-3" />
                Personal Dashboard
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {onboardingData.role && (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Perfect! We'll customize SalesOS for your {onboardingData.role === 'manager' ? 'management' : 'sales'} needs.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
