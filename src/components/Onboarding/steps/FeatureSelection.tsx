
import React from 'react';
import { useOnboarding } from '@/pages/onboarding/OnboardingContext';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, Mail, Brain, BarChart, Target, Users, 
  Zap, MessageSquare, Calendar, Settings 
} from 'lucide-react';

const FeatureSelection: React.FC = () => {
  const { settings, updateSettings } = useOnboarding();

  const allFeatures = [
    {
      id: 'dialer',
      name: 'Auto Dialer',
      description: 'Automated calling system',
      icon: Phone,
      recommended: true,
      category: 'Communication'
    },
    {
      id: 'brain',
      name: 'AI Brain',
      description: 'Intelligent sales insights',
      icon: Brain,
      recommended: true,
      category: 'AI'
    },
    {
      id: 'leads',
      name: 'Lead Management',
      description: 'Track and manage leads',
      icon: Target,
      recommended: true,
      category: 'Leads'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Performance tracking and insights',
      icon: BarChart,
      recommended: true,
      category: 'Analytics'
    },
    {
      id: 'missions',
      name: 'Sales Missions',
      description: 'Gamified sales goals',
      icon: Target,
      recommended: false,
      category: 'Gamification'
    },
    {
      id: 'tools',
      name: 'Sales Tools',
      description: 'Additional sales utilities',
      icon: Settings,
      recommended: false,
      category: 'Tools'
    },
    {
      id: 'aiAgent',
      name: 'AI Agent',
      description: 'Virtual sales assistant',
      icon: MessageSquare,
      recommended: true,
      category: 'AI'
    }
  ];

  const selectedModules = settings.enabled_modules;

  const toggleFeature = (featureId: string) => {
    const updatedModules = {
      ...selectedModules,
      [featureId]: !selectedModules[featureId as keyof typeof selectedModules]
    };
    
    updateSettings({ enabled_modules: updatedModules });
  };

  const groupedFeatures = allFeatures.reduce((groups, feature) => {
    const category = feature.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feature);
    return groups;
  }, {} as Record<string, typeof allFeatures>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Choose Your Features</h3>
        <p className="text-gray-600">
          Select the features you want to enable. You can change these later in settings.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedFeatures).map(([category, features]) => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              {category}
            </h4>
            <div className="grid gap-3">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                const isSelected = selectedModules[feature.id as keyof typeof selectedModules];
                
                return (
                  <Card
                    key={feature.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-orange-600" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{feature.name}</span>
                              {feature.recommended && (
                                <Badge variant="secondary" className="text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={isSelected}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <p className="text-sm text-orange-700">
          You've selected {Object.values(selectedModules).filter(Boolean).length} features. 
          These will be activated in your SalesOS dashboard.
        </p>
      </div>
    </div>
  );
};

export default FeatureSelection;
