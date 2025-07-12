
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, MousePointer, DollarSign, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketingOverviewProps {
  onCardClick?: (data: any) => void;
}

const MarketingOverview: React.FC<MarketingOverviewProps> = ({ onCardClick }) => {
  const navigate = useNavigate();

  const marketingData = [
    {
      id: 'social',
      title: 'Social Media',
      value: '2.4K',
      change: '+12% this week',
      changeType: 'positive' as const,
      icon: Users,
      iconColor: 'text-blue-600',
      insights: [
        'LinkedIn engagement increased by 45% this week',
        'Twitter followers growing at 8% monthly rate',
        'Facebook ads showing 3.2x ROI improvement'
      ],
      recommendations: [
        'Increase LinkedIn posting frequency to 2x daily',
        'Focus more budget on high-performing Facebook campaigns',
        'Create video content for better Twitter engagement'
      ],
      chartData: [
        { name: 'LinkedIn', value: 1200 },
        { name: 'Twitter', value: 800 },
        { name: 'Facebook', value: 400 }
      ],
      chartType: 'bar' as const
    },
    {
      id: 'ppc',
      title: 'PPC Campaigns',
      value: '$1,247',
      change: 'ROAS: 3.2x',
      changeType: 'positive' as const,
      icon: MousePointer,
      iconColor: 'text-green-600',
      insights: [
        'Google Ads showing strong performance with 3.2x ROAS',
        'Cost per click decreased by 15% this month',
        'Conversion rate improved to 4.8%'
      ],
      recommendations: [
        'Increase budget for top-performing keywords',
        'Create more targeted ad groups for better relevance',
        'Test new ad copy variations'
      ],
      chartData: [
        { name: 'Week 1', value: 290 },
        { name: 'Week 2', value: 315 },
        { name: 'Week 3', value: 340 },
        { name: 'Week 4', value: 365 }
      ],
      chartType: 'line' as const
    },
    {
      id: 'email',
      title: 'Email Marketing',
      value: '847',
      change: '28% open rate',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      insights: [
        '28% open rate exceeds industry average of 21%',
        'Click-through rate improved to 4.2%',
        'Segmented campaigns performing 40% better'
      ],
      recommendations: [
        'A/B test subject lines for even higher open rates',
        'Create more personalized email sequences',
        'Expand successful segmentation strategies'
      ],
      chartData: [
        { name: 'Opened', value: 28 },
        { name: 'Clicked', value: 4.2 },
        { name: 'Converted', value: 1.8 }
      ],
      chartType: 'pie' as const
    },
    {
      id: 'adspend',
      title: 'Ad Spend',
      value: '$3,420',
      change: 'Under budget',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-orange-600',
      insights: [
        'Monthly ad spend 12% under allocated budget',
        'Cost per acquisition decreased by 20%',
        'Return on ad spend improved to 4.1x'
      ],
      recommendations: [
        'Reallocate unused budget to top-performing campaigns',
        'Test new advertising channels with surplus budget',
        'Increase bids on high-converting keywords'
      ],
      chartData: [
        { name: 'Google', value: 1420 },
        { name: 'Facebook', value: 1200 },
        { name: 'LinkedIn', value: 800 }
      ],
      chartType: 'pie' as const
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleSeeMore = () => {
    navigate('/manager/leads');
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">Marketing Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active Campaigns
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSeeMore}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              See More
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketingData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => onCardClick && onCardClick({
                  id: item.id,
                  title: item.title,
                  value: item.value,
                  subtitle: item.change,
                  insights: item.insights,
                  recommendations: item.recommendations,
                  chartData: item.chartData,
                  chartType: item.chartType,
                  trend: 'up'
                })}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">{item.title}</p>
                  <p className="text-xl font-bold text-slate-900 mb-1">{item.value}</p>
                  <p className={`text-xs ${getChangeColor(item.changeType)}`}>
                    {item.change}
                  </p>
                </div>
                <div className={`p-2 rounded-full bg-white ${item.iconColor}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingOverview;
