import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import ZohoCRMStep from './Onboarding/ZohoCRMStep';

interface OnboardingState {
  role: string;
  industry: string;
  assistant_name: string;
  voice_style: string;
  tone_settings: {
    formality: number;
    enthusiasm: number;
    directness: number;
  };
}

const OnboardingFlow: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<OnboardingState>({
    role: '',
    industry: '',
    assistant_name: 'AI Assistant',
    voice_style: 'professional',
    tone_settings: {
      formality: 50,
      enthusiasm: 50,
      directness: 50,
    }
  });

  // Dynamic steps based on role
  const getSteps = () => {
    const baseSteps = [
      { title: 'Choose Your Role', key: 'role' },
      { title: 'Select Your Industry', key: 'industry' }
    ];

    // Only show Zoho CRM step for managers
    if (settings.role === 'manager') {
      baseSteps.push({ title: 'Connect Zoho CRM', key: 'zoho_crm' });
    }

    baseSteps.push(
      { title: 'Name Your Assistant', key: 'assistant_name' },
      { title: 'Voice & Style', key: 'voice_style' },
      { title: 'Final Setup', key: 'complete' }
    );

    return baseSteps;
  };

  const steps = getSteps();

  const updateDatabase = async (stepKey: string, value: any) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData: any = {};
      
      if (stepKey === 'role') {
        updateData.role = value;
      } else if (stepKey === 'industry') {
        updateData.industry = value;
      } else if (stepKey === 'assistant_name') {
        updateData.assistant_name = value;
      } else if (stepKey === 'voice_style') {
        updateData.voice_style = value;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      console.log(`✅ Saved ${stepKey}:`, value);
      logger.info(`Onboarding step saved: ${stepKey}`, { value, userId: user.id });
      
    } catch (error) {
      console.error(`❌ Failed to save ${stepKey}:`, error);
      toast.error(`Failed to save ${stepKey}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const currentStepKey = steps[currentStep].key;
    
    // Skip database update for Zoho CRM step
    if (currentStepKey !== 'zoho_crm') {
      if (currentStepKey === 'role') {
        await updateDatabase('role', settings.role);
      } else if (currentStepKey === 'industry') {
        await updateDatabase('industry', settings.industry);
      } else if (currentStepKey === 'assistant_name') {
        await updateDatabase('assistant_name', settings.assistant_name);
      } else if (currentStepKey === 'voice_style') {
        await updateDatabase('voice_style', settings.voice_style);
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkipZoho = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleLaunchOS = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_complete: true,
          launched_at: new Date().toISOString(),
          user_metadata: {
            tone_settings: settings.tone_settings
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      console.log('🚀 Onboarding completed! Launching OS...');
      logger.info('Onboarding completed', { userId: user.id, settings });
      
      toast.success('Welcome to your personalized SalesOS!');
      
      setTimeout(() => {
        if (settings.role === 'manager') {
          navigate('/os/manager/dashboard');
        } else if (settings.role === 'developer' || settings.role === 'admin') {
          navigate('/os/dev/dashboard');
        } else {
          navigate('/os/rep/dashboard');
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Failed to complete onboarding:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    const stepKey = steps[currentStep].key;

    switch (stepKey) {
      case 'role':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What's your role?</h2>
            <p className="text-gray-600">This helps us customize your experience</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['sales_rep', 'manager', 'admin'].map((role) => (
                <Card 
                  key={role}
                  className={`cursor-pointer transition-all ${
                    settings.role === role 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSettings(prev => ({ ...prev, role }))}
                >
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold capitalize">
                      {role.replace('_', ' ')}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'industry':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What's your industry?</h2>
            <p className="text-gray-600">We'll tailor AI responses to your market</p>
            <Select 
              value={settings.industry} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, industry: value }))}
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
          </div>
        );

      case 'zoho_crm':
        // Only show for managers
        if (settings.role === 'manager') {
          return (
            <ZohoCRMStep 
              onNext={handleNext}
              onSkip={handleSkipZoho}
            />
          );
        }
        return null;

      case 'assistant_name':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Name your AI assistant</h2>
            <p className="text-gray-600">Choose a name you'll be comfortable using</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assistant_name">Assistant Name</Label>
                <Input
                  id="assistant_name"
                  value={settings.assistant_name}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    assistant_name: e.target.value 
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 'voice_style':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Choose your AI's personality</h2>
            <p className="text-gray-600">Customize how your assistant communicates</p>
            
            <div className="space-y-4">
              <div>
                <Label>Voice Style</Label>
                <Select 
                  value={settings.voice_style} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, voice_style: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Formality Level: {settings.tone_settings.formality}%</Label>
                  <Slider
                    value={[settings.tone_settings.formality]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({
                        ...prev,
                        tone_settings: { ...prev.tone_settings, formality: value }
                      }))
                    }
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Enthusiasm Level: {settings.tone_settings.enthusiasm}%</Label>
                  <Slider
                    value={[settings.tone_settings.enthusiasm]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({
                        ...prev,
                        tone_settings: { ...prev.tone_settings, enthusiasm: value }
                      }))
                    }
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Directness Level: {settings.tone_settings.directness}%</Label>
                  <Slider
                    value={[settings.tone_settings.directness]}
                    onValueChange={([value]) => 
                      setSettings(prev => ({
                        ...prev,
                        tone_settings: { ...prev.tone_settings, directness: value }
                      }))
                    }
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <Sparkles className="h-16 w-16 text-blue-500 mx-auto" />
            <h2 className="text-2xl font-bold">Ready to launch your SalesOS!</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Your Setup:</h3>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <p><strong>Role:</strong> {settings.role}</p>
                <p><strong>Industry:</strong> {settings.industry}</p>
                <p><strong>Assistant:</strong> {settings.assistant_name}</p>
                <p><strong>Style:</strong> {settings.voice_style}</p>
              </div>
            </div>
            <Button 
              onClick={handleLaunchOS}
              disabled={isLoading}
              size="lg"
              className="px-8"
            >
              {isLoading ? 'Launching...' : 'Launch My OS'}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  const canProceed = () => {
    const stepKey = steps[currentStep].key;
    switch (stepKey) {
      case 'role': return settings.role !== '';
      case 'industry': return settings.industry !== '';
      case 'assistant_name': return settings.assistant_name.trim() !== '';
      case 'voice_style': return settings.voice_style !== '';
      case 'complete': return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-8">
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {steps[currentStep].key !== 'zoho_crm' && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleLaunchOS} disabled={isLoading}>
                {isLoading ? (
                  'Launching...'
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Launch Sales OS
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={isLoading}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
