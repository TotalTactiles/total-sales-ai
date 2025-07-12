import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar } from 'lucide-react';
import { AIInsightsModal } from '@/components/Manager/AIInsightsModal';
import ManagerPulse from '@/components/Manager/ManagerPulse';
import TeamPerformanceSection from '@/components/Manager/TeamPerformanceSection';
import TeamRewardsOverview from '@/components/Manager/TeamRewardsOverview';

const ManagerDashboard = () => {
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openInsightModal = (insightData: any) => {
    setSelectedInsight(insightData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInsight(null);
  };

  // Mock data for main metrics
  const mainMetrics = [
    {
      title: 'Revenue',
      value: '$847K',
      change: '+12.5%',
      trend: 'up',
      period: 'vs last month',
      icon: DollarSign,
      data: { revenue: 847000, growth: 12.5, breakdown: [120000, 145000, 180000, 200000, 202000] }
    },
    {
      title: 'Leads',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      period: 'vs last month',
      icon: Users,
      data: { leads: 2847, growth: 8.2, sources: { google: 1200, linkedin: 800, referral: 547, organic: 300 } }
    },
    {
      title: 'Deals',
      value: '156',
      change: '+15.7%',
      trend: 'up',
      period: 'vs last month',
      icon: Target,
      data: { deals: 156, growth: 15.7, pipeline: { qualified: 45, proposal: 67, negotiation: 32, closing: 12 } }
    },
    {
      title: 'Conversion Rate',
      value: '5.8%',
      change: '-2.1%',
      trend: 'down',
      period: 'vs last month',
      icon: TrendingUp,
      data: { rate: 5.8, change: -2.1, funnel: { leads: 2847, qualified: 1200, demos: 400, proposals: 200, closed: 165 } }
    }
  ];

  const monthlyForecast = {
    title: 'Monthly Forecast',
    current: '$847K',
    target: '$950K',
    projected: '$892K',
    confidence: 78,
    data: {
      historical: [750000, 820000, 780000, 847000],
      forecast: [892000, 950000],
      breakdown: { existing: 640000, pipeline: 252000, new: 58000 }
    }
  };

  const campaignPerformance = [
    {
      name: 'Social Media',
      spend: '$12.5K',
      leads: '347',
      cpl: '$36',
      trend: 'up',
      change: '+8.2%',
      data: { platforms: { linkedin: 180, facebook: 120, twitter: 47 }, engagement: 4.2 }
    },
    {
      name: 'PPC Campaigns',
      spend: '$28.7K',
      leads: '892',
      cpl: '$32',
      trend: 'up',
      change: '+15.3%',
      data: { keywords: 125, avgPosition: 2.3, clickthrough: 3.8 }
    },
    {
      name: 'Email Marketing',
      spend: '$2.1K',
      leads: '234',
      cpl: '$9',
      trend: 'down',
      change: '-5.1%',
      data: { campaigns: 8, openRate: 24.5, clickRate: 3.2 }
    }
  ];

  const leadSources = [
    {
      source: 'Google Ads',
      leads: '1,247',
      conversion: '6.2%',
      revenue: '$324K',
      trend: 'up',
      data: { quality: 7.8, avgDeal: 18500, timeToClose: 45 }
    },
    {
      source: 'LinkedIn',
      leads: '834',
      conversion: '8.1%',
      revenue: '$189K',
      trend: 'up',
      data: { quality: 8.5, avgDeal: 22000, timeToClose: 38 }
    },
    {
      source: 'Referrals',
      leads: '423',
      conversion: '12.4%',
      revenue: '$156K',
      trend: 'up',
      data: { quality: 9.2, avgDeal: 35000, timeToClose: 28 }
    }
  ];

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card 
              key={metric.title} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openInsightModal({
                title: `${metric.title} Analysis`,
                type: 'metric',
                data: metric.data,
                insights: [
                  `${metric.title} is ${metric.trend === 'up' ? 'performing well' : 'needs attention'} with ${metric.change} change`,
                  'AI recommendations available for optimization',
                  'Trend analysis shows consistent growth pattern'
                ]
              })}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {metric.change}
                  </span>
                  <span>{metric.period}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly Forecast */}
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => openInsightModal({
          title: 'Monthly Forecast Analysis',
          type: 'forecast',
          data: monthlyForecast.data,
          insights: [
            `Currently at ${monthlyForecast.current} of ${monthlyForecast.target} target`,
            `${monthlyForecast.confidence}% confidence in hitting projected ${monthlyForecast.projected}`,
            'Pipeline health indicates strong month-end performance'
          ]
        })}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {monthlyForecast.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current</p>
              <p className="text-2xl font-bold">{monthlyForecast.current}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="text-2xl font-bold">{monthlyForecast.target}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projected</p>
              <p className="text-2xl font-bold text-blue-600">{monthlyForecast.projected}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-2xl font-bold text-green-600">{monthlyForecast.confidence}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager Pulse */}
      <ManagerPulse />

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaignPerformance.map((campaign) => (
          <Card 
            key={campaign.name}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openInsightModal({
              title: `${campaign.name} Performance`,
              type: 'campaign',
              data: campaign.data,
              insights: [
                `Spend: ${campaign.spend} generating ${campaign.leads} leads`,
                `Cost per lead: ${campaign.cpl} (${campaign.change})`,
                'Optimization recommendations available'
              ]
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                {campaign.name}
                <Badge variant={campaign.trend === 'up' ? 'default' : 'destructive'}>
                  {campaign.change}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spend:</span>
                <span className="font-medium">{campaign.spend}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Leads:</span>
                <span className="font-medium">{campaign.leads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CPL:</span>
                <span className="font-medium">{campaign.cpl}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lead Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leadSources.map((source) => (
          <Card 
            key={source.source}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openInsightModal({
              title: `${source.source} Analysis`,
              type: 'source',
              data: source.data,
              insights: [
                `${source.leads} leads with ${source.conversion} conversion rate`,
                `Generated ${source.revenue} in revenue`,
                `Average deal size: $${source.data.avgDeal.toLocaleString()}`
              ]
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{source.source}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Leads:</span>
                <span className="font-medium">{source.leads}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conversion:</span>
                <span className="font-medium text-green-600">{source.conversion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">{source.revenue}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Performance Section */}
      <TeamPerformanceSection />

      {/* Team Rewards Overview */}
      <TeamRewardsOverview />

      {/* AI Insights Modal */}
      <AIInsightsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedInsight}
      />
    </div>
  );
};

export default ManagerDashboard;
