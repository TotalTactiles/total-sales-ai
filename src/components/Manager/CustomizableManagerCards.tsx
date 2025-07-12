
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, DollarSign, Users, Target, TrendingUp, Award, Calendar, AlertTriangle, Phone, Trophy } from 'lucide-react';

interface ManagerCardsProps {
  onCardClick: (metric: any) => void;
}

const CustomizableManagerCards: React.FC<ManagerCardsProps> = ({ onCardClick }) => {
  const [selectedCards, setSelectedCards] = useState([
    'revenue', 'quota', 'deals', 'performance'
  ]);

  const availableCards = [
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: '$247K',
      change: '+18% vs last month',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-green-600',
      category: 'Performance'
    },
    {
      id: 'quota',
      title: 'Team Quota',
      value: '87%',
      change: 'On track for 110%',
      changeType: 'positive' as const,
      icon: Target,
      iconColor: 'text-blue-600',
      category: 'Performance'
    },
    {
      id: 'deals',
      title: 'Active Deals',
      value: '34',
      change: '$127K in pipeline',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      category: 'Performance'
    },
    {
      id: 'performance',
      title: 'Team Performance',
      value: '92%',
      change: '1 needs support',
      changeType: 'neutral' as const,
      icon: Users,
      iconColor: 'text-orange-600',
      category: 'Team'
    },
    {
      id: 'calls',
      title: 'Team Calls Today',
      value: '156',
      change: '+12% vs yesterday',
      changeType: 'positive' as const,
      icon: Phone,
      iconColor: 'text-green-600',
      category: 'Team'
    },
    {
      id: 'wins',
      title: 'Wins This Week',
      value: '23',
      change: '85% win rate',
      changeType: 'positive' as const,
      icon: Trophy,
      iconColor: 'text-yellow-600',
      category: 'Performance'
    },
    {
      id: 'alerts',
      title: 'AI Alerts',
      value: '5',
      change: '2 high priority',
      changeType: 'neutral' as const,
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      category: 'Goals'
    },
    {
      id: 'goals',
      title: 'Monthly Goals',
      value: '68%',
      change: '12 days remaining',
      changeType: 'positive' as const,
      icon: Calendar,
      iconColor: 'text-blue-600',
      category: 'Goals'
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleCardToggle = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const displayedCards = availableCards.filter(card => selectedCards.includes(card.id));
  const categories = ['Performance', 'Team', 'Goals'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Performance Overview</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Customize
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customize Cards</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {categories.map(category => (
                <div key={category} className="space-y-3">
                  <h4 className="font-medium text-blue-600">{category}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {availableCards
                      .filter(card => card.category === category)
                      .map(card => {
                        const IconComponent = card.icon;
                        const isSelected = selectedCards.includes(card.id);
                        return (
                          <div
                            key={card.id}
                            onClick={() => handleCardToggle(card.id)}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className={`h-4 w-4 ${card.iconColor}`} />
                              <span className="text-sm font-medium">{card.title}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedCards.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card 
              key={index} 
              className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
              onClick={() => onCardClick(metric)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</p>
                    <p className={`text-sm ${getChangeColor(metric.changeType)}`}>
                      {metric.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-slate-100 ${metric.iconColor}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizableManagerCards;
