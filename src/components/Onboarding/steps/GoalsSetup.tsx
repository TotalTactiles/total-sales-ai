
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Target, TrendingUp, Calendar } from 'lucide-react';

const GoalsSetup: React.FC = () => {
  const { onboardingData, updateOnboardingData, userRole } = useOnboarding();

  const handleGoalChange = (field: string, value: string | number) => {
    updateOnboardingData({
      goals: {
        ...onboardingData.goals,
        [field]: value
      }
    });
  };

  const handlePersonalGoalsChange = (value: string) => {
    const goals = value.split('\n').filter(goal => goal.trim() !== '');
    updateOnboardingData({
      goals: {
        ...onboardingData.goals,
        personalGoals: goals
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {userRole === 'manager' ? 'Company Goals' : 'Your Goals'}
        </h3>
        <p className="text-gray-600">
          Set targets to track your progress and get AI-powered insights
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="monthlyTarget" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly Target ($)
            </Label>
            <Input
              id="monthlyTarget"
              type="number"
              value={onboardingData.goals?.monthlyTarget || ''}
              onChange={(e) => handleGoalChange('monthlyTarget', parseInt(e.target.value) || 0)}
              placeholder="50000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="quarterlyTarget" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Quarterly Target ($)
            </Label>
            <Input
              id="quarterlyTarget"
              type="number"
              value={onboardingData.goals?.quarterlyTarget || ''}
              onChange={(e) => handleGoalChange('quarterlyTarget', parseInt(e.target.value) || 0)}
              placeholder="150000"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="personalGoals">
            {userRole === 'manager' ? 'Team Objectives' : 'Personal Objectives'}
          </Label>
          <Textarea
            id="personalGoals"
            value={onboardingData.goals?.personalGoals?.join('\n') || ''}
            onChange={(e) => handlePersonalGoalsChange(e.target.value)}
            placeholder={`Enter each goal on a new line, for example:
${userRole === 'manager' ? 
  'Increase team conversion rate by 15%\nImplement new sales process\nHire 2 additional sales reps' :
  'Improve call conversion rate\nLearn advanced objection handling\nBuild stronger client relationships'
}`}
            className="mt-1 min-h-[120px]"
          />
        </div>
      </div>

      {(onboardingData.goals?.monthlyTarget || onboardingData.goals?.quarterlyTarget) && (
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            Perfect! Our AI will help you track progress and suggest optimizations to hit these targets.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalsSetup;
