import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  MoreHorizontal,
  Trophy,
  Flag,
  Award,
  Star,
  TrendingDown
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
  category: 'performance' | 'goals' | 'team';
  progress?: number;
  target?: number;
  rank?: number;
  totalMembers?: number;
}

interface PerformanceCardsGridProps {
  onCardClick?: (cardData: any) => void;
}

const PerformanceCardsGrid: React.FC<PerformanceCardsGridProps> = ({ onCardClick }) => {
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
    openLeadsNoFollowup: 7,
    monthlyCallGoal: 60,
    monthlyRevenueGoal: 150000,
    weeklyDemoGoal: 8,
    teamRank: 3,
    totalTeamMembers: 12,
    teamAvgCalls: 10,
    teamAvgRevenue: 38000
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
      isDefault: true,
      category: 'performance'
    },
    {
      id: 'deals',
      title: 'Deals Won',
      value: dashboardStats.dealsWon,
      trend: '+15% from last week',
      trendType: 'up',
      icon: Target,
      color: 'bg-green-100 text-green-600',
      isDefault: true,
      category: 'performance'
    },
    {
      id: 'streak',
      title: 'Win Streak',
      value: dashboardStats.winStreak,
      trend: 'Active streak',
      trendType: 'up',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      isDefault: true,
      category: 'performance'
    },
    {
      id: 'revenue',
      title: 'Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      trend: '+12% this month',
      trendType: 'up',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
      isDefault: true,
      category: 'performance'
    }
  ]);

  // Load saved preferences from localStorage
  const [activeCards, setActiveCards] = useState<string[]>(() => {
    const saved = localStorage.getItem('salesOS-performance-cards');
    if (saved) {
      return JSON.parse(saved);
    }
    return availableCards.filter(card => card.isDefault).map(card => card.id);
  });

  const [showCustomization, setShowCustomization] = useState(false);

  // Save preferences to localStorage whenever activeCards changes
  useEffect(() => {
    localStorage.setItem('salesOS-performance-cards', JSON.stringify(activeCards));
  }, [activeCards]);

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
        return <TrendingDown className="h-3 w-3 text-red-600 mr-1" />;
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

  const getCategoryBadge = (category: 'performance' | 'goals' | 'team') => {
    const badges = {
      performance: { label: 'Performance', color: 'bg-blue-100 text-blue-700' },
      goals: { label: 'Goals', color: 'bg-green-100 text-green-700' },
      team: { label: 'Team', color: 'bg-purple-100 text-purple-700' }
    };
    return badges[category];
  };

  const handleCardClick = (card: PerformanceCard) => {
    if (onCardClick) {
      onCardClick(card);
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

      {/* Performance Cards Grid - Now clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedCards.map(card => {
          const IconComponent = card.icon;
          return (
            <Card 
              key={card.id} 
              className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer hover:scale-105"
              onClick={() => handleCardClick(card)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                  {card.category !== 'performance' && (
                    <Badge className={`text-xs w-fit ${getCategoryBadge(card.category).color}`}>
                      {getCategoryBadge(card.category).label}
                    </Badge>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                
                {/* Progress bar for goal cards */}
                {card.progress !== undefined && (
                  <div className="mt-2 space-y-1">
                    <Progress value={card.progress} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {card.progress}% complete
                    </div>
                  </div>
                )}
                
                {/* Ranking display for team cards */}
                {card.rank !== undefined && card.totalMembers && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < (6 - card.rank!) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                )}
                
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
