
import React from 'react';
import { useManagerDemoData } from '@/hooks/useManagerDemoData';
import ManagerOverviewCards from '@/components/Manager/ManagerOverviewCards';
import ManagerTeamTable from '@/components/Manager/ManagerTeamTable';
import ManagerAIAssistant from '@/components/Manager/ManagerAIAssistant';
import ManagerRecognitionEngine from '@/components/Manager/ManagerRecognitionEngine';
import ManagerEscalationCenter from '@/components/Manager/ManagerEscalationCenter';
import ManagerBookingSystem from '@/components/Manager/ManagerBookingSystem';
import BusinessOpsSnapshot from '@/components/Manager/BusinessOpsSnapshot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { 
    isDemo, 
    loading, 
    teamMembers, 
    recommendations, 
    aiInsights, 
    teamMetrics,
    businessOpsData,
    mockAIFunctions
  } = useManagerDemoData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600 mt-1">Team performance and AI insights</p>
            </div>
            {isDemo && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Brain className="h-3 w-3 mr-1" />
                Demo Mode Active
              </Badge>
            )}
          </div>

          {/* Key Metrics Overview Cards */}
          <ManagerOverviewCards 
            teamMembers={teamMembers}
            recommendations={recommendations}
            demoMode={isDemo}
            profile={{ role: 'manager' }}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Team Management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Operations Snapshot */}
              <BusinessOpsSnapshot />
              
              {/* Team Performance Table */}
              <ManagerTeamTable teamMembers={teamMembers} />
              
              {/* AI Insights Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    AI Performance Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.map((insight) => (
                      <div 
                        key={insight.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          insight.severity === 'success' ? 'bg-green-50 border-green-400' :
                          insight.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                          'bg-blue-50 border-blue-400'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                            <p className="text-sm text-gray-700 mt-1">{insight.message}</p>
                          </div>
                          {insight.actionable && (
                            <Badge variant="outline" className="text-xs">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - AI Tools & Management */}
            <div className="space-y-6">
              <ManagerAIAssistant mockFunctions={mockAIFunctions} />
              <ManagerBookingSystem demoMode={isDemo} />
              <ManagerEscalationCenter demoMode={isDemo} />
              <ManagerRecognitionEngine />
            </div>
          </div>

          {/* Team Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Calls</p>
                    <p className="text-2xl font-bold text-gray-900">{teamMetrics.totalCalls}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${(teamMetrics.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Conversion</p>
                    <p className="text-2xl font-bold text-gray-900">{teamMetrics.averageConversion}%</p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Mood</p>
                    <p className="text-2xl font-bold text-gray-900">{teamMetrics.averageMood}%</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
