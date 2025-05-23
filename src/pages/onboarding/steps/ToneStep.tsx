
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ToneStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const ToneStep: React.FC<ToneStepProps> = ({ settings, updateSettings }) => {
  const updateTone = (key: string, value: number) => {
    updateSettings({
      tone: {
        ...settings.tone,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Set your communication style</h1>
        <p className="text-muted-foreground">
          Adjust these settings to match your team's sales approach
        </p>
      </div>

      <div className="space-y-8">
        {/* Humor Level */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Humor Level</Label>
            <span className="text-sm text-muted-foreground">
              {settings.tone.humor < 30 
                ? 'Serious' 
                : settings.tone.humor < 70 
                ? 'Balanced' 
                : 'Humorous'}
            </span>
          </div>
          <Slider
            value={[settings.tone.humor]}
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

        {/* Formality */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Formality</Label>
            <span className="text-sm text-muted-foreground">
              {settings.tone.formality < 30 
                ? 'Casual' 
                : settings.tone.formality < 70 
                ? 'Balanced' 
                : 'Formal'}
            </span>
          </div>
          <Slider
            value={[settings.tone.formality]}
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

        {/* Pushiness */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Assertiveness</Label>
            <span className="text-sm text-muted-foreground">
              {settings.tone.pushiness < 30 
                ? 'Gentle' 
                : settings.tone.pushiness < 70 
                ? 'Balanced' 
                : 'Direct'}
            </span>
          </div>
          <Slider
            value={[settings.tone.pushiness]}
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

        {/* Detail Level */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Detail Level</Label>
            <span className="text-sm text-muted-foreground">
              {settings.tone.detail < 30 
                ? 'Concise' 
                : settings.tone.detail < 70 
                ? 'Balanced' 
                : 'Detailed'}
            </span>
          </div>
          <Slider
            value={[settings.tone.detail]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => updateTone('detail', value[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Brief and to the point</span>
            <span>Comprehensive and detailed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToneStep;
