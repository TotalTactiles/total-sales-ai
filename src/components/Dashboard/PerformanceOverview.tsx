
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, X, RotateCcw } from 'lucide-react';
import { 
  Phone, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Mail,
  Clock,
  Award,
  BarChart3
} from 'lucide-react';

interface PerformanceCard {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

const defaultCards: PerformanceCard[] = [
  {
    id: 'calls',
    title: 'Calls Made',
    value: '12',
    change: '+8% from last week',
    icon: <Phone className="h-4 w-4" />,
    color: 'text-blue-600',
    trend: 'up'
  },
  {
    id: 'deals',
    title: 'Deals Won',
    value: '3',
    change: '+15% from last week',
    icon: <Target className="h-4 w-4" />,
    color: 'text-green-600',
    trend: 'up'
  },
  {
    id: 'streak',
    title: 'Win Streak',
    value: '5',
    change: 'Active streak',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-purple-600',
    trend: 'up'
  },
  {
    id: 'revenue',
    title: 'Revenue',
    value: '$45,000',
    change: '+12% this month',
    icon: <DollarSign className="h-4 w-4" />,
    color: 'text-yellow-600',
    trend: 'up'
  }
];

const availableCards: PerformanceCard[] = [
  ...defaultCards,
  {
    id: 'meetings',
    title: 'Meetings',
    value: '8',
    change: '+20% from last week',
    icon: <Calendar className="h-4 w-4" />,
    color: 'text-indigo-600',
    trend: 'up'
  },
  {
    id: 'emails',
    title: 'Emails Sent',
    value: '45',
    change: '+5% from last week',
    icon: <Mail className="h-4 w-4" />,
    color: 'text-pink-600',
    trend: 'up'
  },
  {
    id: 'response_time',
    title: 'Avg Response',
    value: '2.3h',
    change: '-15% faster',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-teal-600',
    trend: 'up'
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: '24%',
    change: '+3% from last month',
    icon: <Award className="h-4 w-4" />,
    color: 'text-orange-600',
    trend: 'up'
  }
];

const PerformanceOverview: React.FC = () => {
  const [selectedCards, setSelectedCards] = useState<PerformanceCard[]>(defaultCards);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);

  // Load saved configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('performance-overview-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setSelectedCards(parsed);
      } catch (error) {
        console.error('Failed to load performance config:', error);
      }
    }
  }, []);

  // Save configuration whenever it changes
  useEffect(() => {
    localStorage.setItem('performance-overview-config', JSON.stringify(selectedCards));
  }, [selectedCards]);

  const addCard = (card: PerformanceCard) => {
    if (!selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(prev => [...prev, card]);
    }
    setShowAvailable(false);
  };

  const removeCard = (cardId: string) => {
    setSelectedCards(prev => prev.filter(c => c.id !== cardId));
  };

  const resetToDefault = () => {
    setSelectedCards(defaultCards);
    setIsCustomizing(false);
    setShowAvailable(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default: return <BarChart3 className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Performance Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="h-8"
            >
              <Settings className="h-3 w-3 mr-1" />
              Customize
            </Button>
            {isCustomizing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefault}
                className="h-8 text-gray-500"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Performance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {selectedCards.map((card) => (
            <div key={card.id} className="relative bg-white rounded-lg p-4 border border-gray-100">
              {isCustomizing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCard(card.id)}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-100 hover:bg-red-200 rounded-full"
                >
                  <X className="h-3 w-3 text-red-600" />
                </Button>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gray-50 ${card.color}`}>
                  {card.icon}
                </div>
                {getTrendIcon(card.trend)}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                <p className="text-xs text-gray-500">{card.change}</p>
              </div>
            </div>
          ))}
          
          {/* Add Card Button */}
          {isCustomizing && (
            <div
              className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              onClick={() => setShowAvailable(true)}
            >
              <div className="text-center">
                <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Add Card</p>
              </div>
            </div>
          )}
        </div>

        {/* Available Cards Modal */}
        {showAvailable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Performance Card</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAvailable(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableCards
                  .filter(card => !selectedCards.find(c => c.id === card.id))
                  .map((card) => (
                    <div
                      key={card.id}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-colors"
                      onClick={() => addCard(card)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-white ${card.color}`}>
                          {card.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{card.title}</p>
                          <p className="text-lg font-bold text-gray-900">{card.value}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{card.change}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceOverview;
