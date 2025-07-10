
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Brain, TrendingUp, AlertTriangle, Target, Award } from 'lucide-react';

interface ManagerOverviewCardsProps {
  teamMembers: any[];
  recommendations: any[];
  demoMode: boolean;
  profile: any;
}

const ManagerOverviewCards: React.FC<ManagerOverviewCardsProps> = ({ 
  teamMembers, 
  recommendations, 
  demoMode, 
  profile 
}) => {
  const totalCalls = teamMembers.reduce((sum, member) => sum + (member.stats?.call_count || 0), 0);
  const totalWins = teamMembers.reduce((sum, member) => sum + (member.stats?.win_count || 0), 0);
  const averageMood = teamMembers.length > 0 
    ? Math.round(teamMembers.reduce((sum, member) => sum + (member.stats?.mood_score || 0), 0) / teamMembers.length)
    : 0;
  const highRiskMembers = teamMembers.filter(member => (member.stats?.burnout_risk || 0) > 60).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Team Size</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{teamMembers.length}</div>
          <p className="text-xs text-blue-700">
            Active sales representatives
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Total Calls</CardTitle>
          <Target className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{totalCalls}</div>
          <p className="text-xs text-green-700">
            {totalWins} wins ({totalCalls > 0 ? Math.round((totalWins / totalCalls) * 100) : 0}% conversion)
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Team Mood</CardTitle>
          <Award className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{averageMood}%</div>
          <p className="text-xs text-purple-700">
            Average team satisfaction
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">AI Alerts</CardTitle>
          <Brain className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{recommendations.length}</div>
          <p className="text-xs text-orange-700">
            {highRiskMembers} high-risk members
          </p>
          {highRiskMembers > 0 && (
            <Badge variant="destructive" className="mt-1 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Attention needed
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerOverviewCards;
