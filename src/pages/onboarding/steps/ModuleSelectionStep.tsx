
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Phone, Brain, Users, LineChart, Target, Cog, Bot, ArrowLeft, ArrowRight } from 'lucide-react';

interface ModuleSelectionStepProps {
  settings: any;
  updateSettings: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  completeOnboarding?: () => Promise<void>;
  isSubmitting?: boolean;
}

const ModuleSelectionStep: React.FC<ModuleSelectionStepProps> = ({ 
  settings, 
  updateSettings, 
  nextStep, 
  prevStep, 
  isFirstStep 
}) => {
  const toggleModule = (moduleId: string) => {
    updateSettings({
      enabled_modules: {
        ...settings.enabled_modules,
        [moduleId]: !settings.enabled_modules[moduleId]
      }
    });
  };
  
  const modules = [
    { 
      id: 'dialer', 
      name: 'Smart Dialer', 
      description: 'AI-powered calling with real-time coaching', 
      icon: Phone,
      isPro: false
    },
    { 
      id: 'brain', 
      name: 'Company Brain', 
      description: 'Knowledge base with auto-learning from your documents', 
      icon: Brain,
      isPro: false
    },
    { 
      id: 'leads', 
      name: 'Lead Management', 
      description: 'Track prospects through your sales pipeline', 
      icon: Users,
      isPro: false
    },
    { 
      id: 'analytics', 
      name: 'Analytics Dashboard', 
      description: 'Performance metrics and insights', 
      icon: LineChart,
      isPro: false
    },
    { 
      id: 'missions', 
      name: 'Agent Missions', 
      description: 'Targeted sales campaigns with guided workflows', 
      icon: Target,
      isPro: true
    },
    { 
      id: 'tools', 
      name: 'Advanced Tools', 
      description: 'Specialized utilities for sales acceleration', 
      icon: Cog,
      isPro: true
    },
    { 
      id: 'aiAgent', 
      name: 'AI Agent', 
      description: 'Autonomous AI assistant that can make calls for you', 
      icon: Bot,
      isPro: true
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Choose your modules</h1>
        <p className="text-muted-foreground">
          Select which features you want to enable in your SalesOS
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <div 
            key={module.id}
            className={`border rounded-lg p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
              settings.enabled_modules?.[module.id] 
                ? 'border-primary' 
                : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  settings.enabled_modules?.[module.id]
                    ? 'bg-primary/10 text-primary'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  <module.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">{module.name}</Label>
                    {module.isPro && (
                      <span className="text-xs py-0.5 px-2 bg-amber-100 text-amber-800 rounded-full dark:bg-amber-900 dark:text-amber-100">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {module.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.enabled_modules?.[module.id] || false}
                onCheckedChange={() => toggleModule(module.id)}
              />
            </div>
          </div>
        ))}
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

export default ModuleSelectionStep;
