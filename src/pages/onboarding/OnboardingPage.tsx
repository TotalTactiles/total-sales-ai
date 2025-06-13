
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { getDashboardUrl } from '@/components/Navigation/navigationUtils';

const OnboardingPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    companyName: '',
    industry: '',
    teamSize: '',
    goals: []
  });

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Real Estate',
    'Manufacturing',
    'Retail',
    'Education',
    'Consulting',
    'Other'
  ];

  const teamSizes = [
    '1-5 people',
    '6-20 people',
    '21-50 people',
    '51-100 people',
    '100+ people'
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    if (profile?.company_id) {
      localStorage.setItem(`onboarding_complete_${profile.company_id}`, 'true');
    }
    toast.success('Welcome to SalesOS! Your account is ready.');
    const dashboardUrl = getDashboardUrl(profile);
    navigate(dashboardUrl, { replace: true });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Tell us about your company</h2>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={onboardingData.companyName}
                  onChange={(e) => setOnboardingData({ ...onboardingData, companyName: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>
              
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={onboardingData.industry}
                  onValueChange={(value) => setOnboardingData({ ...onboardingData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select
                  value={onboardingData.teamSize}
                  onValueChange={(value) => setOnboardingData({ ...onboardingData, teamSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your team size" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">You're all set!</h2>
              <p className="text-muted-foreground">Your SalesOS workspace is ready</p>
            </div>
            
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-4">What's next?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Explore your personalized dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Import your leads and contacts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Set up your AI assistant preferences</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Logo />
          <CardTitle className="mt-4">Welcome to SalesOS</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between items-center mt-8">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of 2
            </span>
            <Button 
              onClick={handleNext}
              disabled={currentStep === 1 && (!onboardingData.companyName || !onboardingData.industry)}
            >
              {currentStep === 2 ? 'Get Started' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
