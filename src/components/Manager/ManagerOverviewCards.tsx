
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Brain, TrendingUp, AlertTriangle, Target, Award, DollarSign } from 'lucide-react';

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
  const totalRevenue = teamMembers.reduce((sum, member) => sum + (member.stats?.revenue_generated || 0), 0);
  const averageMood = teamMembers.length > 0 
    ? Math.round(teamMembers.reduce((sum, member) => sum + (member.stats?.mood_score || 0), 0) / teamMembers.length)
    : 0;
  const highRiskMembers = teamMembers.filter(member => (member.stats?.burnout_risk || 0) > 60).length;
  const criticalAlerts = recommendations.filter(rec => rec.priority === 'critical').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Team Size</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{teamMembers.length}</div>
          <p className="text-xs text-blue-700">
            Active sales representatives
          </p>
          <div className="mt-2 text-xs text-blue-600">
            {totalCalls} total calls • {totalWins} wins
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Revenue Generated</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            ${(totalRevenue / 1000).toFixed(0)}K
          </div>
          <p className="text-xs text-green-700">
            This quarter performance
          </p>
          <div className="mt-2 text-xs text-green-600">
            +15% vs last quarter
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">Team Mood</CardTitle>
          <Award className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{averageMood}%</div>
          <p className="text-xs text-purple-700">
            Average team satisfaction
          </p>
          <div className="mt-2 text-xs text-purple-600">
            {averageMood >= 80 ? '😁 Excellent' : averageMood >= 60 ? '🙂 Good' : '😐 Needs attention'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-800">AI Alerts</CardTitle>
          <Brain className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{recommendations.length}</div>
          <p className="text-xs text-orange-700">
            Active recommendations
          </p>
          <div className="mt-2 flex items-center gap-2">
            {criticalAlerts > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {criticalAlerts} critical
              </Badge>
            )}
            {highRiskMembers > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-0 border-orange-300 text-orange-700">
                {highRiskMembers} at risk
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerOverviewCards;
