
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, TrendingUp, TrendingDown, Users, DollarSign, Target, BarChart3, Calendar } from 'lucide-react';

interface CustomizableManagerCardsProps {
  onCardClick: (data: any) => void;
}

const CustomizableManagerCards: React.FC<CustomizableManagerCardsProps> = ({ onCardClick }) => {
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedCards, setSelectedCards] = useState([
    'monthly_revenue',
    'team_quota',
    'pipeline_value',
    'conversion_rate'
  ]);

  const availableCards = [
    { id: 'monthly_revenue', name: 'Monthly Revenue', icon: DollarSign },
    { id: 'team_quota', name: 'Team Quota', icon: Target },
    { id: 'pipeline_value', name: 'Pipeline Value', icon: BarChart3 },
    { id: 'conversion_rate', name: 'Conversion Rate', icon: TrendingUp },
    { id: 'active_deals', name: 'Active Deals', icon: Calendar },
    { id: 'team_performance', name: 'Team Performance', icon: Users },
  ];

  const getCardData = (cardId: string) => {
    const cardDataMap = {
      monthly_revenue: {
        id: 'monthly_revenue',
        title: 'Monthly Revenue',
        value: '$425,000',
        subtitle: '12% above target',
        trend: 'up' as const,
        insights: [
          'Revenue growth has accelerated by 15% compared to last month',
          'Enterprise deals contributing 68% of total revenue',
          'Q4 performance trending 12% above annual targets',
          'SaaS subscriptions showing strong recurring revenue growth'
        ],
        recommendations: [
          'Focus on enterprise client retention strategies',
          'Expand mid-market segment to diversify revenue streams',
          'Implement upselling campaigns for existing customers',
          'Consider premium pricing for new product features'
        ],
        chartData: [
          { name: 'Jan', value: 320000 },
          { name: 'Feb', value: 350000 },
          { name: 'Mar', value: 380000 },
          { name: 'Apr', value: 390000 },
          { name: 'May', value: 410000 },
          { name: 'Jun', value: 425000 }
        ],
        chartType: 'line' as const
      },
      team_quota: {
        id: 'team_quota',
        title: 'Team Quota Achievement',
        value: '94%',
        subtitle: 'Target: 100%',
        trend: 'up' as const,
        insights: [
          'Team is 6% away from monthly quota with 5 days remaining',
          'Top performers are 25% above individual targets',
          'Sales velocity has increased by 18% this quarter',
          '3 team members need coaching support to meet targets'
        ],
        recommendations: [
          'Prioritize high-value deals in pipeline for final push',
          'Schedule 1-on-1 coaching sessions with underperforming reps',
          'Implement peer mentoring program',
          'Review and adjust territory assignments for Q1'
        ],
        chartData: [
          { name: 'Sarah J.', value: 125 },
          { name: 'Mike C.', value: 78 },
          { name: 'Lisa W.', value: 102 },
          { name: 'David R.', value: 89 },
          { name: 'Emma S.', value: 115 }
        ],
        chartType: 'bar' as const
      },
      pipeline_value: {
        id: 'pipeline_value',
        title: 'Pipeline Value',
        value: '$1.2M',
        subtitle: 'Weighted: $850K',
        trend: 'up' as const,
        insights: [
          'Pipeline health score improved to 87% this month',
          'Average deal size increased by 23% quarter-over-quarter',
          'Qualification stage conversion rate at 68%',
          'Enterprise deals represent 45% of total pipeline value'
        ],
        recommendations: [
          'Focus on moving deals from proposal to closing stage',
          'Implement deal review process for high-value opportunities',
          'Increase activity on stalled deals over 30 days',
          'Develop competitive battlecards for common objections'
        ],
        chartData: [
          { name: 'Qualified', value: 320000 },
          { name: 'Proposal', value: 450000 },
          { name: 'Negotiation', value: 280000 },
          { name: 'Closing', value: 150000 }
        ],
        chartType: 'pie' as const
      },
      conversion_rate: {
        id: 'conversion_rate',
        title: 'Conversion Rate',
        value: '28%',
        subtitle: 'Industry avg: 22%',
        trend: 'up' as const,
        insights: [
          'Conversion rate 6 points above industry average',
          'Lead qualification process showing strong results',
          'Demo-to-close rate improved by 12% this quarter',
          'Email campaigns generating highest quality leads'
        ],
        recommendations: [
          'Scale successful email campaign strategies',
          'Implement lead scoring automation',
          'Create targeted content for different buyer personas',
          'Optimize demo presentation based on winning patterns'
        ],
        chartData: [
          { name: 'Week 1', value: 24 },
          { name: 'Week 2', value: 26 },
          { name: 'Week 3', value: 29 },
          { name: 'Week 4', value: 28 }
        ],
        chartType: 'line' as const
      }
    };

    return cardDataMap[cardId as keyof typeof cardDataMap];
  };

  const handleCardClick = (cardId: string) => {
    const cardData = getCardData(cardId);
    if (cardData) {
      onCardClick(cardData);
    }
  };

  const renderCard = (cardId: string) => {
    const cardData = getCardData(cardId);
    if (!cardData) return null;

    const IconComponent = availableCards.find(card => card.id === cardId)?.icon || DollarSign;

    return (
      <Card key={cardId} className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => handleCardClick(cardId)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconComponent className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-sm font-medium">{cardData.title}</CardTitle>
            </div>
            {cardData.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-900">{cardData.value}</div>
            <p className="text-xs text-slate-600">{cardData.subtitle}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Key Performance Metrics</h2>
          <p className="text-slate-600 text-sm">Track your most important business indicators</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowCustomizeModal(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Customize
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedCards.map(renderCard)}
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Customize Dashboard Cards</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {availableCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <card.icon className="h-4 w-4 text-slate-600" />
                    <span className="text-sm">{card.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCards.includes(card.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCards([...selectedCards, card.id]);
                      } else {
                        setSelectedCards(selectedCards.filter(id => id !== card.id));
                      }
                    }}
                    className="h-4 w-4"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCustomizeModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setShowCustomizeModal(false)}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizableManagerCards;
