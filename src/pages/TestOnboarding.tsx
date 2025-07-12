
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, TestTube, User, Building, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface OnboardingState {
  // User Info
  full_name: string;
  role: 'sales_rep' | 'manager' | 'admin' | 'developer';
  
  // Company/Industry
  industry: string;
  customIndustry?: string;
  sales_model: string[];
  team_roles: string[];
  
  // AI Configuration
  agent_name: string;
  tone: {
    humor: number;
    formality: number;
    pushiness: number;
    detail: number;
  };
  
  // Goals and Pain Points
  pain_points: string[];
  original_goal: string;
  
  // Module Selection
  enabled_modules: {
    dialer: boolean;
    brain: boolean;
    leads: boolean;
    analytics: boolean;
    missions: boolean;
    tools: boolean;
    aiAgent: boolean;
  };
}

const TestOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<OnboardingState>({
    full_name: '',
    role: 'sales_rep',
    industry: '',
    sales_model: [],
    team_roles: [],
    agent_name: 'SalesOS Assistant',
    tone: {
      humor: 50,
      formality: 50,
      pushiness: 30,
      detail: 60,
    },
    pain_points: [],
    original_goal: '',
    enabled_modules: {
      dialer: true,
      brain: true,
      leads: true,
      analytics: true,
      missions: false,
      tools: false,
      aiAgent: true,
    },
  });

  const steps = [
    { title: 'Personal Info', key: 'personal' },
    { title: 'Role Selection', key: 'role' },
    { title: 'Industry', key: 'industry' },
    { title: 'Sales Model', key: 'sales_model' },
    { title: 'Team Structure', key: 'team_roles' },
    { title: 'AI Assistant', key: 'agent_name' },
    { title: 'Communication Style', key: 'tone' },
    { title: 'Pain Points', key: 'pain_points' },
    { title: 'Goals', key: 'goals' },
    { title: 'Features', key: 'modules' },
    { title: 'Complete', key: 'complete' }
  ];

  const updateSettings = (data: Partial<OnboardingState>) => {
    setSettings(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Log the test completion with role-based OS routing
      const targetOS = getTargetOS(settings.role);
      
      console.log('🧪 Test Onboarding Completed:', {
        settings,
        targetOS,
        timestamp: new Date().toISOString()
      });
      
      logger.info('Test onboarding completed', { 
        settings, 
        targetOS,
        testMode: true 
      });
      
      toast.success(`Test Complete! Would redirect to: ${targetOS}`);
      
      // In real implementation, this would redirect to the appropriate OS
      // For testing, just show a success message
      setTimeout(() => {
        toast.info(`Target OS for ${settings.role}: ${targetOS}`);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Test onboarding error:', error);
      toast.error('Test completion failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetOS = (role: string): string => {
    switch (role) {
      case 'manager':
        return '/os/manager/dashboard';
      case 'developer':
      case 'admin':
        return '/os/dev/dashboard';
      case 'sales_rep':
      default:
        return '/os/rep/dashboard';
    }
  };

  const canProceed = (): boolean => {
    const stepKey = steps[currentStep].key;
    switch (stepKey) {
      case 'personal': return settings.full_name.trim() !== '';
      case 'role': return settings.role !== '';
      case 'industry': return settings.industry !== '';
      case 'sales_model': return settings.sales_model.length > 0;
      case 'team_roles': return settings.team_roles.length > 0;
      case 'agent_name': return settings.agent_name.trim() !== '';
      case 'tone': return true;
      case 'pain_points': return settings.pain_points.length > 0;
      case 'goals': return settings.original_goal.trim() !== '';
      case 'modules': return Object.values(settings.enabled_modules).some(Boolean);
      case 'complete': return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    const stepKey = steps[currentStep].key;

    switch (stepKey) {
      case 'personal':
        return (
          <div className="space-y-4">
            <User className="h-12 w-12 text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-center">Welcome! Let's get started</h2>
            <p className="text-gray-600 text-center">First, tell us about yourself</p>
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={settings.full_name}
                onChange={(e) => updateSettings({ full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
          </div>
        );

      case 'role':
        return (
          <div className="space-y-4">
            <Building className="h-12 w-12 text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-center">What's your role?</h2>
            <p className="text-gray-600 text-center">This helps us customize your experience</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'sales_rep', label: 'Sales Representative', desc: 'Individual contributor focused on selling' },
                { value: 'manager', label: 'Sales Manager', desc: 'Team leader managing sales reps' },
                { value: 'admin', label: 'Administrator', desc: 'System administrator' },
                { value: 'developer', label: 'Developer', desc: 'Technical team member' }
              ].map((role) => (
                <Card 
                  key={role.value}
                  className={`cursor-pointer transition-all ${
                    settings.role === role.value 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => updateSettings({ role: role.value as any })}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold">{role.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">{role.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'industry':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">What's your industry?</h2>
            <p className="text-gray-600 text-center">We'll tailor AI responses to your market</p>
            <Select 
              value={settings.industry} 
              onValueChange={(value) => updateSettings({ industry: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            {settings.industry === 'other' && (
              <div>
                <Label htmlFor="custom_industry">Please specify</Label>
                <Input
                  id="custom_industry"
                  value={settings.customIndustry || ''}
                  onChange={(e) => updateSettings({ customIndustry: e.target.value })}
                  placeholder="Your industry"
                />
              </div>
            )}
          </div>
        );

      case 'sales_model':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Sales Model</h2>
            <p className="text-gray-600 text-center">How do you typically sell? (Select all that apply)</p>
            <div className="space-y-3">
              {[
                'Inbound leads',
                'Outbound prospecting',
                'Referrals',
                'Channel partners',
                'Events/Trade shows',
                'Social selling'
              ].map((model) => (
                <label key={model} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.sales_model.includes(model)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateSettings({ sales_model: [...settings.sales_model, model] });
                      } else {
                        updateSettings({ 
                          sales_model: settings.sales_model.filter(m => m !== model) 
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span>{model}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'team_roles':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Team Structure</h2>
            <p className="text-gray-600 text-center">What roles are part of your sales process?</p>
            <div className="space-y-3">
              {[
                'SDR/BDR',
                'Account Executive',
                'Sales Manager',
                'Customer Success',
                'Marketing',
                'Sales Engineer'
              ].map((role) => (
                <label key={role} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.team_roles.includes(role)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateSettings({ team_roles: [...settings.team_roles, role] });
                      } else {
                        updateSettings({ 
                          team_roles: settings.team_roles.filter(r => r !== role) 
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'agent_name':
        return (
          <div className="space-y-4">
            <Bot className="h-12 w-12 text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold text-center">Name your AI assistant</h2>
            <p className="text-gray-600 text-center">Choose a name you'll be comfortable using</p>
            <div>
              <Label htmlFor="agent_name">Assistant Name</Label>
              <Input
                id="agent_name"
                value={settings.agent_name}
                onChange={(e) => updateSettings({ agent_name: e.target.value })}
                placeholder="e.g., Nova, Alex, Assistant"
              />
            </div>
          </div>
        );

      case 'tone':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Communication Style</h2>
            <p className="text-gray-600 text-center">Customize how your AI assistant communicates</p>
            
            {[
              { key: 'humor', label: 'Humor Level', desc: 'How playful should responses be?' },
              { key: 'formality', label: 'Formality Level', desc: 'Professional vs casual tone' },
              { key: 'pushiness', label: 'Assertiveness', desc: 'How direct in recommendations?' },
              { key: 'detail', label: 'Detail Level', desc: 'Brief vs comprehensive responses' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <Label>{label}</Label>
                  <span className="text-sm text-gray-500">{settings.tone[key as keyof typeof settings.tone]}%</span>
                </div>
                <Slider
                  value={[settings.tone[key as keyof typeof settings.tone]]}
                  onValueChange={([value]) => 
                    updateSettings({
                      tone: { ...settings.tone, [key]: value }
                    })
                  }
                  max={100}
                  step={1}
                />
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        );

      case 'pain_points':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Current Challenges</h2>
            <p className="text-gray-600 text-center">What are your biggest sales challenges?</p>
            <div className="space-y-3">
              {[
                'Lead generation',
                'Lead qualification',
                'Follow-up consistency',
                'Pipeline management',
                'Closing deals',
                'Time management',
                'Data entry/CRM',
                'Team coordination'
              ].map((pain) => (
                <label key={pain} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.pain_points.includes(pain)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateSettings({ pain_points: [...settings.pain_points, pain] });
                      } else {
                        updateSettings({ 
                          pain_points: settings.pain_points.filter(p => p !== pain) 
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span>{pain}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Goals</h2>
            <p className="text-gray-600 text-center">What do you want to achieve with SalesOS?</p>
            <div>
              <Label htmlFor="goals">Describe your main goals</Label>
              <Textarea
                id="goals"
                value={settings.original_goal}
                onChange={(e) => updateSettings({ original_goal: e.target.value })}
                placeholder="e.g., Increase sales by 30%, improve lead conversion, automate follow-ups..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Choose Features</h2>
            <p className="text-gray-600 text-center">Select the features you want to enable</p>
            <div className="space-y-3">
              {[
                { key: 'dialer', label: 'Auto Dialer', desc: 'Automated calling system' },
                { key: 'brain', label: 'AI Brain', desc: 'Intelligent sales insights' },
                { key: 'leads', label: 'Lead Management', desc: 'Track and manage leads' },
                { key: 'analytics', label: 'Analytics', desc: 'Performance tracking' },
                { key: 'missions', label: 'Sales Missions', desc: 'Gamified goals' },
                { key: 'tools', label: 'Sales Tools', desc: 'Additional utilities' },
                { key: 'aiAgent', label: 'AI Agent', desc: 'Virtual assistant' }
              ].map(({ key, label, desc }) => (
                <label key={key} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-gray-600">{desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enabled_modules[key as keyof typeof settings.enabled_modules]}
                    onChange={(e) => updateSettings({
                      enabled_modules: {
                        ...settings.enabled_modules,
                        [key]: e.target.checked
                      }
                    })}
                    className="rounded"
                  />
                </label>
              ))}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <Sparkles className="h-16 w-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold">Ready to launch your SalesOS!</h2>
            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-4">Your Configuration:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {settings.full_name}</p>
                <p><strong>Role:</strong> {settings.role}</p>
                <p><strong>Industry:</strong> {settings.industry}</p>
                <p><strong>AI Assistant:</strong> {settings.agent_name}</p>
                <p><strong>Target OS:</strong> {getTargetOS(settings.role)}</p>
              </div>
            </div>
            <Button 
              onClick={handleComplete}
              disabled={isSubmitting}
              size="lg"
              className="px-8"
            >
              {isSubmitting ? 'Processing...' : 'Complete Test'}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Test Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TestTube className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">Test Onboarding</h1>
          </div>
          <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium inline-block">
            Testing Mode - Changes will reflect in real onboarding
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < steps.length - 1 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Back to Auth Button */}
        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Back to Auth Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestOnboarding;
