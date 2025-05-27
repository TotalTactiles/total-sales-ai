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
  const { onboardingData, updateOnboardingData, userRole } = useOnboarding();

  const allFeatures = [
    {
      id: 'ai-coaching',
      name: 'AI Coaching',
      description: 'Real-time coaching and feedback',
      icon: Brain,
      recommended: true,
      category: 'AI'
    },
    {
      id: 'voice-ai',
      name: 'Voice AI Assistant',
      description: 'Voice commands and responses',
      icon: MessageSquare,
      recommended: true,
      category: 'AI'
    },
    {
      id: 'call-analytics',
      name: 'Call Analytics',
      description: 'Track and analyze call performance',
      icon: Phone,
      recommended: userRole === 'sales_rep',
      category: 'Analytics'
    },
    {
      id: 'email-automation',
      name: 'Email Automation',
      description: 'Automated email sequences',
      icon: Mail,
      recommended: true,
      category: 'Automation'
    },
    {
      id: 'lead-scoring',
      name: 'Lead Scoring',
      description: 'AI-powered lead prioritization',
      icon: Target,
      recommended: true,
      category: 'Leads'
    },
    {
      id: 'team-management',
      name: 'Team Management',
      description: 'Manage and monitor team performance',
      icon: Users,
      recommended: userRole === 'manager',
      category: 'Management',
      managerOnly: true
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Detailed performance insights',
      icon: BarChart,
      recommended: userRole === 'manager',
      category: 'Analytics'
    },
    {
      id: 'automation-workflows',
      name: 'Workflow Automation',
      description: 'Custom automation workflows',
      icon: Zap,
      recommended: false,
      category: 'Automation'
    },
    {
      id: 'calendar-integration',
      name: 'Calendar Integration',
      description: 'Sync with your calendar',
      icon: Calendar,
      recommended: true,
      category: 'Integration'
    },
    {
      id: 'custom-fields',
      name: 'Custom Fields',
      description: 'Customize data fields',
      icon: Settings,
      recommended: false,
      category: 'Customization'
    }
  ];

  const availableFeatures = allFeatures.filter(feature => 
    !feature.managerOnly || userRole === 'manager'
  );

  const selectedFeatures = onboardingData.preferredFeatures || 
    availableFeatures.filter(f => f.recommended).map(f => f.id);

  const toggleFeature = (featureId: string) => {
    const updated = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    
    updateOnboardingData({ preferredFeatures: updated });
  };

  const groupedFeatures = availableFeatures.reduce((groups, feature) => {
    const category = feature.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feature);
    return groups;
  }, {} as Record<string, typeof availableFeatures>);

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
                const isSelected = selectedFeatures.includes(feature.id);
                
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
          You've selected {selectedFeatures.length} features. 
          These will be activated in your SalesOS dashboard.
        </p>
      </div>
    </div>
  );
};

export default FeatureSelection;
