
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { USAGE_TIERS } from '@/services/relevance/RelevanceAIService';

interface UsageTierSelectorProps {
  currentTier?: string;
  onTierChange?: (tier: string) => void;
}

const UsageTierSelector: React.FC<UsageTierSelectorProps> = ({
  currentTier = USAGE_TIERS.BASIC,
  onTierChange
}) => {
  const [selectedTier, setSelectedTier] = useState(currentTier);

  const tiers = [
    {
      id: USAGE_TIERS.BASIC,
      name: 'Basic',
      price: '$29/month',
      features: ['100 AI calls/month', 'Basic workflows', 'Email support'],
      popular: false
    },
    {
      id: USAGE_TIERS.PROFESSIONAL,
      name: 'Professional',
      price: '$99/month',
      features: ['1,000 AI calls/month', 'Advanced workflows', 'Priority support', 'Custom integrations'],
      popular: true
    },
    {
      id: USAGE_TIERS.ENTERPRISE,
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited AI calls', 'Custom workflows', '24/7 support', 'Dedicated account manager'],
      popular: false
    }
  ];

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    onTierChange?.(tierId);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Your AI Usage Tier</h2>
        <p className="text-muted-foreground">Select the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <Card 
            key={tier.id}
            className={`relative cursor-pointer transition-all ${
              selectedTier === tier.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelectTier(tier.id)}
          >
            {tier.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <div className="text-2xl font-bold text-primary">{tier.price}</div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full mt-4"
                variant={selectedTier === tier.id ? 'default' : 'outline'}
              >
                {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UsageTierSelector;
