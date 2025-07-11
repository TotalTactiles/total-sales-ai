
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Award, 
  TrendingUp, 
  AlertCircle,
  Gift,
  Star,
  Target
} from 'lucide-react';
import { useManagerAI } from '@/hooks/useManagerAI';
import ChatBubble from './ChatBubble';
import AIChartRenderer from './AIChartRenderer';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  performance: number;
  quotaAchievement: number;
  rewardEligible: boolean;
  rewardType?: string;
  heatmapScore: number;
}

interface RewardSuggestion {
  id: string;
  repId: string;
  repName: string;
  type: 'recognition' | 'bonus' | 'perk' | 'development';
  reason: string;
  impact: 'low' | 'medium' | 'high';
  cost: number;
  approved: boolean;
}

const TeamAI: React.FC = () => {
  const { askJarvis, isGenerating } = useManagerAI();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [rewardSuggestions, setRewardSuggestions] = useState<RewardSuggestion[]>([]);
  const [performanceChart, setPerformanceChart] = useState<any>(null);

  useEffect(() => {
    // Load team data
    setTeamMembers([
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Senior Sales Rep',
        performance: 92,
        quotaAchievement: 115,
        rewardEligible: true,
        rewardType: 'Top Performer',
        heatmapScore: 95
      },
      {
        id: '2',
        name: 'Mike Chen',
        role: 'Sales Rep',
        performance: 78,
        quotaAchievement: 88,
        rewardEligible: false,
        heatmapScore: 82
      },
      {
        id: '3',
        name: 'Lisa Park',
        role: 'Sales Rep',
        performance: 65,
        quotaAchievement: 72,
        rewardEligible: false,
        heatmapScore: 68
      }
    ]);

    // Load reward suggestions
    setRewardSuggestions([
      {
        id: '1',
        repId: '1',
        repName: 'Sarah Johnson',
        type: 'recognition',
        reason: 'Exceeded quota by 15% for 3 consecutive months',
        impact: 'high',
        cost: 0,
        approved: false
      },
      {
        id: '2',
        repId: '3',
        repName: 'Lisa Park',
        type: 'development',
        reason: 'Would benefit from advanced sales training',
        impact: 'medium',
        cost: 500,
        approved: false
      }
    ]);

    // Set performance chart
    setPerformanceChart({
      type: 'bar' as const,
      data: [
        { name: 'Sarah Johnson', performance: 115, quota: 100 },
        { name: 'Mike Chen', performance: 88, quota: 100 },
        { name: 'Lisa Park', performance: 72, quota: 100 }
      ]
    });
  }, []);

  const generateTeamAnalysis = async () => {
    try {
      const response = await askJarvis('Analyze team performance and suggest improvements', {
        includeChart: true,
        includeRewards: true,
        teamData: teamMembers
      });

      if (response.chartData) {
        setPerformanceChart(response.chartData);
      }
    } catch (error) {
      console.error('Team analysis failed:', error);
    }
  };

  const approveReward = async (rewardId: string) => {
    setRewardSuggestions(prev => 
      prev.map(r => r.id === rewardId ? { ...r, approved: true } : r)
    );
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHeatmapColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Performance Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Team Performance
            </CardTitle>
            <Button 
              onClick={generateTeamAnalysis}
              disabled={isGenerating}
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Analyze Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {performanceChart && (
            <AIChartRenderer 
              chartData={performanceChart.data} 
              chartType={performanceChart.type}
              config={{ title: 'Team Quota Achievement' }}
            />
          )}
        </CardContent>
      </Card>

      {/* Reward Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Reward Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${getHeatmapColor(member.heatmapScore)}`}
                  />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance:</span>
                    <span className={`font-medium ${getPerformanceColor(member.performance)}`}>
                      {member.performance}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quota:</span>
                    <span className={`font-medium ${getPerformanceColor(member.quotaAchievement)}`}>
                      {member.quotaAchievement}%
                    </span>
                  </div>
                  {member.rewardEligible && (
                    <Badge className="bg-green-100 text-green-800 w-full justify-center">
                      <Gift className="h-3 w-3 mr-1" />
                      {member.rewardType}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reward Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            AI Reward Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rewardSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 border rounded-lg bg-yellow-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">{suggestion.repName}</span>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{suggestion.reason}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getImpactColor(suggestion.impact)}>
                      {suggestion.impact} impact
                    </Badge>
                    {suggestion.cost > 0 && (
                      <span className="text-sm text-gray-500">
                        Cost: ${suggestion.cost}
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => approveReward(suggestion.id)}
                  disabled={suggestion.approved}
                  variant={suggestion.approved ? "outline" : "default"}
                >
                  {suggestion.approved ? 'Approved' : 'Approve'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team AI Chat Bubble */}
      <ChatBubble 
        assistantType="team"
        enabled={true}
        className="team-ai-chat"
      />
    </div>
  );
};

export default TeamAI;
