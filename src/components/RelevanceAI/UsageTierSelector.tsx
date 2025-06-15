
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { USAGE_TIERS } from '@/services/relevance/RelevanceAIService';
import { useRelevanceAI } from '@/hooks/useRelevanceAI';

const UsageTierSelector: React.FC = () => {
  const { usageStats, upgradeTier } = useRelevanceAI();

  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case 'Basic': return <Zap className="h-5 w-5" />;
      case 'Pro': return <Star className="h-5 w-5" />;
      case 'Elite': return <Crown className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'Basic': return 'border-gray-200 bg-white';
      case 'Pro': return 'border-blue-200 bg-blue-50';
      case 'Elite': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Relevance AI Pricing</h2>
        <p className="text-gray-600">Choose the plan that fits your AI automation needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {USAGE_TIERS.map((tier) => {
          const isCurrentTier = usageStats?.currentTier === tier.name;
          const canUpgrade = usageStats?.currentTier !== tier.name && tier.name !== 'Basic';
          
          return (
            <Card 
              key={tier.name} 
              className={`relative ${getTierColor(tier.name)} ${
                isCurrentTier ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {isCurrentTier && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Current Plan</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getTierIcon(tier.name)}
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {tier.price === 0 ? 'Free' : `$${tier.price}`}
                  {tier.price > 0 && <span className="text-sm font-normal text-gray-500">/month</span>}
                </div>
                <div className="text-sm text-gray-600">
                  {tier.monthlyRequests.toLocaleString()} requests/month
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentTier ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : canUpgrade ? (
                  <Button 
                    className="w-full"
                    onClick={() => upgradeTier(tier.name)}
                  >
                    Upgrade to {tier.name}
                  </Button>
                ) : tier.name === 'Basic' && usageStats?.currentTier !== 'Basic' ? (
                  <Button className="w-full" variant="outline" disabled>
                    Downgrade
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current usage display */}
      {usageStats && (
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Current Usage</h3>
              <Badge className={usageStats.percentageUsed >= 90 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                {usageStats.percentageUsed}% used
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Requests Used:</span>
                <div className="font-semibold">{usageStats.requestsUsed.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Monthly Limit:</span>
                <div className="font-semibold">{usageStats.requestsLimit.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Remaining:</span>
                <div className="font-semibold">{(usageStats.requestsLimit - usageStats.requestsUsed).toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsageTierSelector;
