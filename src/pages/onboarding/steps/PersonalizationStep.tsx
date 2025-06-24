
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PersonalizationStepProps {
  settings: any;
  updateSettings: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const PersonalizationStep: React.FC<PersonalizationStepProps> = ({ 
  settings, 
  updateSettings, 
  nextStep, 
  prevStep, 
  isFirstStep 
}) => {
  const togglePersonalizationFlag = (key: string) => {
    updateSettings({
      personalization_flags: {
        ...settings.personalization_flags,
        [key]: !settings.personalization_flags[key]
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Personalize your experience</h1>
        <p className="text-muted-foreground">
          Choose how you'd like SalesOS to help you stay productive
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Show helpful tips</Label>
            <p className="text-sm text-muted-foreground">
              Display contextual tips and best practices throughout the platform
            </p>
          </div>
          <Switch
            checked={settings.personalization_flags.show_tips}
            onCheckedChange={() => togglePersonalizationFlag('show_tips')}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Enable notifications</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about important updates and opportunities
            </p>
          </div>
          <Switch
            checked={settings.personalization_flags.enable_notifications}
            onCheckedChange={() => togglePersonalizationFlag('enable_notifications')}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Auto-save preferences</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save your settings and preferences
            </p>
          </div>
          <Switch
            checked={settings.personalization_flags.auto_save}
            onCheckedChange={() => togglePersonalizationFlag('auto_save')}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prevStep} disabled={isFirstStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={nextStep}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalizationStep;
