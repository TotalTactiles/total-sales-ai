
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AgentPersonalityStepProps {
  settings: any;
  updateSettings: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  completeOnboarding?: () => Promise<void>;
  isSubmitting?: boolean;
}

const AgentPersonalityStep: React.FC<AgentPersonalityStepProps> = ({ 
  settings, 
  updateSettings, 
  nextStep, 
  prevStep, 
  isFirstStep 
}) => {
  const updateTone = (key: string, value: number) => {
    updateSettings({
      tone: {
        ...settings.tone,
        [key]: value,
      },
    });
  };

  const handleNameChange = (name: string) => {
    updateSettings({ agent_name: name });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Set up your AI assistant</h1>
        <p className="text-muted-foreground">
          Customize your AI assistant's name and communication style
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="agentName">AI Assistant Name</Label>
          <Input
            id="agentName"
            placeholder="Enter a name for your AI assistant"
            value={settings.agent_name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Humor Level</Label>
              <span className="text-sm text-muted-foreground">
                {settings.tone?.humor < 30 ? 'Serious' : settings.tone?.humor < 70 ? 'Balanced' : 'Humorous'}
              </span>
            </div>
            <Slider
              value={[settings.tone?.humor || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateTone('humor', value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Strictly professional</span>
              <span>Lighthearted and witty</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Formality</Label>
              <span className="text-sm text-muted-foreground">
                {settings.tone?.formality < 30 ? 'Casual' : settings.tone?.formality < 70 ? 'Balanced' : 'Formal'}
              </span>
            </div>
            <Slider
              value={[settings.tone?.formality || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateTone('formality', value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Casual and conversational</span>
              <span>Formal and structured</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Assertiveness</Label>
              <span className="text-sm text-muted-foreground">
                {settings.tone?.pushiness < 30 ? 'Gentle' : settings.tone?.pushiness < 70 ? 'Balanced' : 'Direct'}
              </span>
            </div>
            <Slider
              value={[settings.tone?.pushiness || 50]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateTone('pushiness', value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Soft and consultative</span>
              <span>Direct and persuasive</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep} disabled={isFirstStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={nextStep} disabled={!settings.agent_name?.trim()}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AgentPersonalityStep;
