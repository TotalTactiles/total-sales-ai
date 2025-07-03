
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Target, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Clock,
  Users,
  Mail,
  Settings,
  Plus,
  X,
  MoreHorizontal
} from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';

interface PerformanceCard {
  id: string;
  title: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  isDefault: boolean;
}

const PerformanceCardsGrid: React.FC = () => {
  const { leads } = useMockData();
  
  // Mock data for dashboard stats
  const dashboardStats = {
    callsMade: 12,
    dealsWon: 3,
    winStreak: 5,
    totalRevenue: 45000,
    conversionRate: 23.5,
    leadsContacted: 8,
    emailsSent: 15,
    meetingsScheduled: 4,
    demosBooked: 6,
    avgResponseTime: 2.4,
    biggestDeal: 12500,
    openLeadsNoFollowup: 7
  };

  const [availableCards] = useState<PerformanceCard[]>([
    {
      id: 'calls',
      title: 'Calls Made',
      value: dashboardStats.callsMade,
      trend: '+8% from last week',
      trendType: 'up',
      icon: Phone,
      color: 'bg-blue-100 text-blue-600',
      isDefault: true
    },
    {
      id: 'deals',
      title: 'Deals Won',
      value: dashboardStats.dealsWon,
      trend: '+15% from last week',
      trendType: 'up',
      icon: Target,
      color: 'bg-green-100 text-green-600',
      isDefault: true
    },
    {
      id: 'streak',
      title: 'Win Streak',
      value: dashboardStats.winStreak,
      trend: 'Active streak',
      trendType: 'up',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      isDefault: true
    },
    {
      id: 'revenue',
      title: 'Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      trend: '+12% this month',
      trendType: 'up',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
      isDefault: true
    },
    {
      id: 'demos',
      title: 'Demos Booked',
      value: dashboardStats.demosBooked,
      trend: '+3 this week',
      trendType: 'up',
      icon: Calendar,
      color: 'bg-indigo-100 text-indigo-600',
      isDefault: false
    },
    {
      id: 'response_time',
      title: 'Avg Response Time',
      value: `${dashboardStats.avgResponseTime}h`,
      trend: '-0.5h improvement',
      trendType: 'up',
      icon: Clock,
      color: 'bg-teal-100 text-teal-600',
      isDefault: false
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: `${dashboardStats.conversionRate}%`,
      trend: '+5.2% this month',
      trendType: 'up',
      icon: Users,
      color: 'bg-pink-100 text-pink-600',
      isDefault: false
    },
    {
      id: 'biggest_deal',
      title: 'Biggest Deal',
      value: `$${dashboardStats.biggestDeal.toLocaleString()}`,
      trend: 'This month',
      trendType: 'neutral',
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600',
      isDefault: false
    },
    {
      id: 'open_leads',
      title: 'Open Leads (No Follow-up)',
      value: dashboardStats.openLeadsNoFollowup,
      trend: 'Needs attention',
      trendType: 'down',
      icon: Mail,
      color: 'bg-red-100 text-red-600',
      isDefault: false
    }
  ]);

  const [activeCards, setActiveCards] = useState<string[]>(
    availableCards.filter(card => card.isDefault).map(card => card.id)
  );

  const [showCustomization, setShowCustomization] = useState(false);

  const toggleCard = (cardId: string) => {
    setActiveCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const displayedCards = availableCards.filter(card => activeCards.includes(card.id));

  const getTrendIcon = (trendType: 'up' | 'down' | 'neutral') => {
    switch (trendType) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600 mr-1" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-600 mr-1 rotate-180" />;
      default:
        return <MoreHorizontal className="h-3 w-3 text-gray-500 mr-1" />;
    }
  };

  const getTrendColor = (trendType: 'up' | 'down' | 'neutral') => {
    switch (trendType) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with customization toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCustomization(!showCustomization)}
          className="h-8 text-xs"
        >
          <Settings className="h-3 w-3 mr-1" />
          Customize
        </Button>
      </div>

      {/* Customization Panel */}
      {showCustomization && (
        <Card className="border border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Customize Cards</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomization(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableCards.map(card => (
                <Button
                  key={card.id}
                  variant={activeCards.includes(card.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCard(card.id)}
                  className="h-8 text-xs justify-start"
                >
                  <card.icon className="h-3 w-3 mr-1" />
                  {card.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedCards.map(card => {
          const IconComponent = card.icon;
          return (
            <Card key={card.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className={`flex items-center mt-1 text-xs font-medium ${getTrendColor(card.trendType)}`}>
                  {getTrendIcon(card.trendType)}
                  <span>{card.trend}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceCardsGrid;
