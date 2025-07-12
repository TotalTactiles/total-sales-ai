
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle2, Building, Users, Target, Mic, Bot, Settings, BarChart } from 'lucide-react';
import Logo from '@/components/Logo';

interface OnboardingData {
  industry: string;
  customIndustry?: string;
  salesModel: string[];
  teamRoles: string[];
  tone: {
    formality: string;
    energy: string;
    approach: string;
  };
  painPoints: string[];
  agentName: string;
  modules: string[];
  goals: string;
  role: 'sales_rep' | 'manager' | 'admin' | 'developer';
}

const TestOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    industry: '',
    salesModel: [],
    teamRoles: [],
    tone: { formality: '', energy: '', approach: '' },
    painPoints: [],
    agentName: '',
    modules: [],
    goals: '',
    role: 'sales_rep'
  });

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Real Estate', 'Manufacturing',
    'Retail', 'Education', 'Professional Services', 'Other'
  ];

  const salesModels = [
    'Inbound Sales', 'Outbound Sales', 'Account-Based Sales', 'Channel Sales',
    'Inside Sales', 'Field Sales', 'E-commerce', 'Consultative Sales'
  ];

  const teamRoles = [
    'Sales Development Rep (SDR)', 'Account Executive (AE)', 'Sales Manager',
    'Customer Success Manager', 'Business Development Rep (BDR)', 'Sales Engineer'
  ];

  const painPoints = [
    'Low conversion rates', 'Long sales cycles', 'Difficulty qualifying leads',
    'Inconsistent follow-up', 'Poor lead quality', 'Objection handling',
    'Time management', 'CRM adoption', 'Pipeline visibility', 'Team collaboration'
  ];

  const modules = [
    { id: 'dialer', name: 'Smart Dialer', icon: '📞' },
    { id: 'scripts', name: 'AI Call Scripts', icon: '📝' },
    { id: 'analytics', name: 'Performance Analytics', icon: '📊' },
    { id: 'leads', name: 'Lead Management', icon: '👥' },
    { id: 'email', name: 'Email Automation', icon: '✉️' },
    { id: 'coaching', name: 'AI Coaching', icon: '🎯' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed with data:', data);
    alert('Test onboarding completed! Check console for data.');
    navigate('/auth');
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'salesModel' | 'teamRoles' | 'painPoints' | 'modules', item: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Building className="h-12 w-12 text-[#7B61FF] mx-auto mb-4" />
              <CardTitle className="text-2xl">What's your industry?</CardTitle>
              <p className="text-gray-600">Help us customize TSAM for your business</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                value={data.industry} 
                onValueChange={(value) => updateData('industry', value)}
                className="grid grid-cols-2 gap-4"
              >
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <RadioGroupItem value={industry} id={industry} />
                    <Label htmlFor={industry}>{industry}</Label>
                  </div>
                ))}
              </RadioGroup>
              {data.industry === 'Other' && (
                <div className="mt-4">
                  <Label htmlFor="customIndustry">Please specify your industry</Label>
                  <Input
                    id="customIndustry"
                    value={data.customIndustry || ''}
                    onChange={(e) => updateData('customIndustry', e.target.value)}
                    placeholder="Enter your industry"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Target className="h-12 w-12 text-[#7B61FF] mx-auto mb-4" />
              <CardTitle className="text-2xl">What's your sales model?</CardTitle>
              <p className="text-gray-600">Select all that apply to your business</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {salesModels.map((model) => (
                  <div key={model} className="flex items-center space-x-2">
                    <Checkbox
                      checked={data.salesModel.includes(model)}
                      onCheckedChange={() => toggleArrayItem('salesModel', model)}
                    />
                    <Label>{model}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-[#7B61FF] mx-auto mb-4" />
              <CardTitle className="text-2xl">What roles are on your team?</CardTitle>
              <p className="text-gray-600">Help us understand your team structure</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {teamRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      checked={data.teamRoles.includes(role)}
                      onCheckedChange={() => toggleArrayItem('teamRoles', role)}
                    />
                    <Label>{role}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Mic className="h-12 w-12 text-[#7B61FF] mx-auto mb-4" />
              <CardTitle className="text-2xl">Set your AI tone</CardTitle>
              <p className="text-gray-600">Customize how your AI assistant communicates</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-medium">Formality Level</Label>
                <RadioGroup 
                  value={data.tone.formality} 
                  onValueChange={(value) => updateData('tone', { ...data.tone, formality: value })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="casual" />
                    <Label htmlFor="casual">Casual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Professional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="formal" />
                    <Label htmlFor="formal">Formal</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-lg font-medium">Energy Level</Label>
                <RadioGroup 
                  value={data.tone.energy} 
                  onValueChange={(value) => updateData('tone', { ...data.tone, energy: value })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="calm" id="calm" />
                    <Label htmlFor="calm">Calm</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced">Balanced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="energetic" id="energetic" />
                    <Label htmlFor="energetic">Energetic</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-lg font-medium">Approach</Label>
                <RadioGroup 
                  value={data.tone.approach} 
                  onValueChange={(value) => updateData('tone', { ...data.tone, approach: value })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="direct" />
                    <Label htmlFor="direct">Direct</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consultative" id="consultative" />
                    <Label htmlFor="consultative">Consultative</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="supportive" id="supportive" />
                    <Label htmlFor="supportive">Supportive</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Settings className="h-12 w-12 text-[#7B61FF] mx-auto mb-4" />
              <CardTitle className="text-2xl">What are your main pain points?</CardTitle>
              <p className="text-gray-600">We'll help you tackle these challenges</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {painPoints.map((point) => (
                  <div key={point} className="flex items-center space-x-2">
                    <Checkbox
                      checked={data.painPoints.includes(point)}
                      onCheckedChange={() => toggleArrayItem('painPoints', point)}
                    />
                    <Label>{point}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Bot className="h-12 w-12 text-[#7B61FF] mx-auto mb-4" />
              <CardTitle className="text-2xl">Name your AI assistant</CardTitle>
              <p className="text-gray-600">Give your AI sales assistant a personal touch</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="agentName">Assistant Name</Label>
                <Input
                  id="agentName"
                  value={data.agentName}
                  onChange={(e) => updateData('agentName', e.target.value)}
                  placeholder="e.g., Sarah, Alex, Morgan..."
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  Choose a name that feels right for your team. This is how your AI assistant will introduce itself.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <BarChart className="h-12 w-12 text-[#7B61FF] mx-auto mb-4" />
              <CardTitle className="text-2xl">Choose your modules</CardTitle>
              <p className="text-gray-600">Select the features you want to enable</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {modules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={data.modules.includes(module.id)}
                        onCheckedChange={() => toggleArrayItem('modules', module.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{module.icon}</span>
                          <Label className="font-medium">{module.name}</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">What's your primary goal?</CardTitle>
              <p className="text-gray-600">Tell us what success looks like for you</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="goals">Describe your main objective</Label>
                <Input
                  id="goals"
                  value={data.goals}
                  onChange={(e) => updateData('goals', e.target.value)}
                  placeholder="e.g., Increase sales by 30%, improve conversion rates, reduce response time..."
                  className="text-lg"
                />
                <p className="text-sm text-gray-500">
                  This helps us customize your dashboard and recommendations.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.industry !== '';
      case 2: return data.salesModel.length > 0;
      case 3: return data.teamRoles.length > 0;
      case 4: return data.tone.formality !== '' && data.tone.energy !== '' && data.tone.approach !== '';
      case 5: return data.painPoints.length > 0;
      case 6: return data.agentName.trim() !== '';
      case 7: return data.modules.length > 0;
      case 8: return data.goals.trim() !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      {/* Header */}
      <div className="container mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              TEST ONBOARDING
            </Badge>
          </div>
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Exit Test
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container mx-auto mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto">
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-2xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              className="bg-[#7B61FF] hover:bg-[#674edc] flex items-center gap-2"
            >
              Complete Setup
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#7B61FF] hover:bg-[#674edc] flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestOnboarding;
