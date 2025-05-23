
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingContext';
import WaterFlowSlider from '../components/metaphorical-ui/WaterFlowSlider';
import ColorToneSlider from '../components/metaphorical-ui/ColorToneSlider';

interface ToneStepProps {
  settings: any;
  updateSettings: (data: any) => void;
}

const ToneStep: React.FC<ToneStepProps> = ({ settings, updateSettings }) => {
  const { canUseMetaphoricalUI } = useOnboarding();

  const updateTone = (key: string, value: number) => {
    updateSettings({
      tone: {
        ...settings.tone,
        [key]: value,
      },
    });
  };

  // Enhanced UI with metaphorical elements
  if (canUseMetaphoricalUI) {
    return (
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Set your communication style
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Adjust these settings to match your team's sales approach
          </motion.p>
        </div>

        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Humor Level - Color Tone */}
          <ColorToneSlider
            label="Humor Level"
            value={settings.tone.humor}
            onChange={(value) => updateTone('humor', value)}
            leftLabel="Strictly professional"
            rightLabel="Lighthearted and witty"
            leftColor="rgba(59, 130, 246, 0.5)" // Blue
            rightColor="rgba(236, 72, 153, 0.5)" // Pink
          />

          {/* Formality - Water Flow */}
          <WaterFlowSlider
            label="Formality"
            value={settings.tone.formality}
            onChange={(value) => updateTone('formality', value)}
            leftLabel="Casual and conversational"
            rightLabel="Formal and structured"
          />

          {/* Pushiness - Color Tone */}
          <ColorToneSlider
            label="Assertiveness"
            value={settings.tone.pushiness}
            onChange={(value) => updateTone('pushiness', value)}
            leftLabel="Soft and consultative"
            rightLabel="Direct and persuasive"
            leftColor="rgba(52, 211, 153, 0.5)" // Green
            rightColor="rgba(239, 68, 68, 0.5)" // Red
          />

          {/* Detail Level - Water Flow */}
          <WaterFlowSlider
            label="Detail Level"
            value={settings.tone.detail}
            onChange={(value) => updateTone('detail', value)}
            leftLabel="Brief and to the point"
            rightLabel="Comprehensive and detailed"
          />
        </motion.div>
      </motion.div>
    );
  }

  // Fallback UI for browsers/devices that don't support advanced features
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
