
import React, { useState } from 'react';
import AIDailySummary from '@/components/Dashboard/AIDailySummary';
import ChatBubble from '@/components/AI/ChatBubble';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { AIInsightsModal } from '@/components/Manager/AIInsightsModal';
import { 
  DollarSign, 
  Users, 
  Target, 
  TrendingUp, 
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3
} from 'lucide-react';

const ManagerDashboard = () => {
  const [selectedModal, setSelectedModal] = useState<any>(null);

  const aiSummary = "Good morning! Your team has achieved 68% month completion with strong pipeline data at $137,700. Revenue trends show +15.2% growth. AI suggests focusing on the 3 active rewards to maintain momentum.";

  // Top Metrics Data with AI insights
  const topMetrics = [
    {
      id: 'revenue',
      title: 'Revenue',
      value: '$346,249',
      change: '+12% from last month',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      insights: [
        "Revenue growth accelerated by 12% compared to last month",
        "Top performing channel: Enterprise sales (+25%)",
        "Seasonal trend indicates continued growth through Q4"
      ],
      recommendations: [
        "Focus on Enterprise segment for maximum ROI",
        "Increase marketing spend in top-performing channels",
        "Consider hiring additional sales reps for scaling"
      ],
      chartData: [
        { name: 'Jan', value: 280000 },
        { name: 'Feb', value: 295000 },
        { name: 'Mar', value: 310000 },
        { name: 'Apr', value: 346249 }
      ],
      chartType: 'line' as const,
      trend: 'up' as const
    },
    {
      id: 'leads',
      title: 'Leads',
      value: '1,247',
      change: '+5% from last month',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      insights: [
        "Lead quality improved by 18% this month",
        "LinkedIn campaigns generating highest quality leads",
        "Conversion rate from leads to qualified prospects: 24%"
      ],
      recommendations: [
        "Double down on LinkedIn advertising budget",
        "Implement lead scoring to prioritize high-value prospects",
        "Create nurture sequences for unqualified leads"
      ],
      chartData: [
        { name: 'Organic', value: 487 },
        { name: 'Paid', value: 312 },
        { name: 'Referral', value: 289 },
        { name: 'Social', value: 159 }
      ],
      chartType: 'pie' as const,
      trend: 'up' as const
    },
    {
      id: 'deals',
      title: 'Deals',
      value: '$187,500',
      change: '+8% from last month',
      icon: Target,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      insights: [
        "Average deal size increased to $12,500",
        "Sales cycle shortened by 3 days on average",
        "Win rate improved to 34% from 28%"
      ],
      recommendations: [
        "Focus on upselling existing clients",
        "Streamline proposal process to reduce cycle time",
        "Train team on new objection handling techniques"
      ],
      chartData: [
        { name: 'Q1', value: 145000 },
        { name: 'Q2', value: 162000 },
        { name: 'Q3', value: 174000 },
        { name: 'Q4', value: 187500 }
      ],
      chartType: 'bar' as const,
      trend: 'up' as const
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '68%',
      change: '+3% from last month',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      insights: [
        "Lead-to-customer conversion improved significantly",
        "Email sequences driving highest conversion rates",
        "Mobile users converting 15% better than desktop"
      ],
      recommendations: [
        "Optimize mobile experience further",
        "A/B test email sequence timing",
        "Implement chatbot for instant lead qualification"
      ],
      chartData: [
        { name: 'Week 1', value: 62 },
        { name: 'Week 2', value: 65 },
        { name: 'Week 3', value: 67 },
        { name: 'Week 4', value: 68 }
      ],
      chartType: 'line' as const,
      trend: 'up' as const
    }
  ];

  // Campaign Performance Data with insights
  const campaigns = [
    { 
      id: 'social',
      name: 'Social Media', 
      metric: '85% CTR', 
      bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
      insights: [
        "Instagram Stories generating 2x engagement",
        "Video content outperforming static posts by 340%",
        "Peak engagement times: 2-4 PM and 7-9 PM"
      ],
      recommendations: [
        "Increase video content production",
        "Schedule posts during peak hours",
        "Expand Instagram Stories budget by 50%"
      ]
    },
    { 
      id: 'ppc',
      name: 'Pay Per Click (PPC)', 
      metric: '$2.50 CPC', 
      bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
      insights: [
        "Google Ads performing better than Bing by 45%",
        "Long-tail keywords converting at higher rates",
        "Ad spend efficiency improved by 23%"
      ],
      recommendations: [
        "Reallocate budget from Bing to Google",
        "Expand long-tail keyword targeting",
        "Test automated bidding strategies"
      ]
    },
    { 
      id: 'email',
      name: 'Email Marketing', 
      metric: '42% Open Rate', 
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
      insights: [
        "Subject line A/B tests showing 18% improvement",
        "Segmented campaigns outperforming broadcast by 67%",
        "Mobile open rates at 78% of total opens"
      ],
      recommendations: [
        "Implement advanced segmentation",
        "Optimize for mobile-first design",
        "Expand A/B testing to email content"
      ]
    },
    { 
      id: 'content',
      name: 'Content Marketing', 
      metric: '15K Views', 
      bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
      insights: [
        "Blog posts generating 34% of organic traffic",
        "How-to content receiving highest engagement",
        "Content-to-lead conversion rate at 8.5%"
      ],
      recommendations: [
        "Create more educational how-to content",
        "Repurpose top blog posts into video format",
        "Optimize content for featured snippets"
      ]
    }
  ];

  // Team Performance Data
  const teamMembers = [
    {
      id: 'sarah',
      name: 'Sarah Johnson',
      title: 'Sales Manager', 
      avatar: 'SJ',
      deals: 23,
      target: 85,
      performance: 'excellent',
      insights: [
        "Consistently exceeding targets by 15-20%",
        "Strong relationship building with Enterprise clients",
        "Mentor to 3 junior sales reps"
      ],
      recommendations: [
        "Consider for senior management track",
        "Assign highest-value prospects",
        "Expand mentoring responsibilities"
      ]
    },
    {
      id: 'michael',
      name: 'Michael Chen',
      title: 'Marketing Lead',
      avatar: 'MC',
      campaigns: 12,
      roi: '320%',
      performance: 'good',
      insights: [
        "Digital campaigns showing strong ROI",
        "Innovative approach to social media strategy",
        "Collaboration with sales team improving"
      ],
      recommendations: [
        "Lead cross-functional campaign initiatives",
        "Expand budget for top-performing channels",
        "Consider advanced marketing automation tools"
      ]
    },
    {
      id: 'emily',
      name: 'Emily Rodriguez',
      title: 'Account Executive',
      avatar: 'ER',
      accounts: 45,
      retention: '92%',
      performance: 'excellent',
      insights: [
        "Highest client retention rate on the team",
        "Exceptional at identifying upsell opportunities",
        "Customer satisfaction scores consistently above 4.8/5"
      ],
      recommendations: [
        "Lead customer success initiatives",
        "Train team on retention strategies",
        "Consider for key account management role"
      ]
    }
  ];

  const handleCardClick = (cardData: any) => {
    setSelectedModal({
      ...cardData,
      subtitle: cardData.change || cardData.metric || 'Performance Analysis'
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        {/* Compact Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Manager Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">Executive overview and AI-powered insights</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-[1600px] mx-auto">
          {/* Main Dashboard Content - 4 columns */}
          <div className="lg:col-span-4 space-y-4">
            {/* Compact Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {topMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <Card 
                    key={index} 
                    className={`${metric.bgGradient} ${metric.borderColor} border cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
                    onClick={() => handleCardClick(metric)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <IconComponent className={`h-6 w-6 bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`} />
                        <div className="w-2 h-2 rounded-full bg-white/50"></div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          {metric.title}
                        </p>
                        <p className="text-xl font-bold text-slate-900 leading-tight">
                          {metric.value}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">
                          {metric.change}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Compact Monthly Forecast */}
            <Card className="bg-gradient-to-r from-white to-slate-50 border cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => handleCardClick({
                    id: 'forecast',
                    title: 'Monthly Forecast',
                    value: '$450,000',
                    subtitle: 'Projected Revenue - 112% of target',
                    insights: [
                      "On track to exceed monthly target by $50,000",
                      "Current pipeline value suggests strong Q4 finish",
                      "Team performance 12% above average pace"
                    ],
                    recommendations: [
                      "Maintain current sales velocity",
                      "Focus on closing high-value deals in pipeline",
                      "Prepare resource allocation for Q1 ramp-up"
                    ],
                    chartData: [
                      { name: 'Week 1', value: 112500 },
                      { name: 'Week 2', value: 225000 },
                      { name: 'Week 3', value: 337500 },
                      { name: 'Week 4', value: 450000 }
                    ],
                    chartType: 'line' as const,
                    trend: 'up' as const
                  })}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900">Monthly Forecast</CardTitle>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% above pace
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-bold text-slate-900">$450,000</span>
                    <p className="text-slate-600 text-xs">Projected Revenue</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">112%</div>
                    <div className="text-xs text-slate-500">Goal Completion</div>
                  </div>
                </div>
                <Progress value={112} className="h-2 bg-slate-200" />
              </CardContent>
            </Card>

            {/* Compact Campaign Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {campaigns.map((campaign, index) => (
                <Card 
                  key={index} 
                  className={`${campaign.bgColor} border cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
                  onClick={() => handleCardClick({
                    id: campaign.id,
                    title: campaign.name,
                    value: campaign.metric,
                    subtitle: 'Campaign Performance Analysis',
                    insights: campaign.insights,
                    recommendations: campaign.recommendations,
                    chartData: [
                      { name: 'Week 1', value: Math.floor(Math.random() * 100) + 50 },
                      { name: 'Week 2', value: Math.floor(Math.random() * 100) + 60 },
                      { name: 'Week 3', value: Math.floor(Math.random() * 100) + 70 },
                      { name: 'Week 4', value: Math.floor(Math.random() * 100) + 80 }
                    ],
                    chartType: 'bar' as const,
                    trend: 'up' as const
                  })}
                >
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm">{campaign.name}</h4>
                    <div className="text-lg font-bold text-slate-900">{campaign.metric}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compact Team Performance */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Team Performance</h2>
                    <p className="text-slate-600 text-xs">Individual performance metrics</p>
                  </div>
                </div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  3 Active Performers
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teamMembers.map((member, index) => (
                  <Card 
                    key={index} 
                    className="bg-gradient-to-br from-white to-slate-50 border cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    onClick={() => handleCardClick({
                      id: member.id,
                      title: member.name,
                      value: member.title,
                      subtitle: 'Team Member Performance Analysis',
                      insights: member.insights,
                      recommendations: member.recommendations,
                      chartData: [
                        { name: 'Q1', value: Math.floor(Math.random() * 50) + 50 },
                        { name: 'Q2', value: Math.floor(Math.random() * 50) + 60 },
                        { name: 'Q3', value: Math.floor(Math.random() * 50) + 70 },
                        { name: 'Q4', value: Math.floor(Math.random() * 50) + 80 }
                      ],
                      chartType: 'line' as const,
                      trend: 'up' as const
                    })}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white text-sm font-bold">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-sm font-bold text-slate-900">
                            {member.name}
                          </CardTitle>
                          <p className="text-xs text-slate-600 font-medium">{member.title}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div>
                          <p className="text-slate-600">Performance</p>
                          <p className="text-sm font-bold text-slate-900 capitalize">
                            {member.performance}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600">Status</p>
                          <p className="text-sm font-bold text-emerald-600">Active</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Compact AI Daily Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <AIDailySummary summary={aiSummary} isFullUser={true} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Modal */}
      {selectedModal && (
        <AIInsightsModal
          isOpen={!!selectedModal}
          onClose={() => setSelectedModal(null)}
          data={selectedModal}
        />
      )}

      {/* AI Chat Bubble */}
      <ChatBubble 
        assistantType="dashboard" 
        enabled={true}
        context={{
          workspace: 'dashboard',
          userRole: 'manager'
        }}
      />
    </div>
  );
};

export default ManagerDashboard;
