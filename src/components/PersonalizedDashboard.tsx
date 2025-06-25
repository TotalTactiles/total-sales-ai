
import React from 'react';
import { usePersonalizedProfile } from '@/hooks/usePersonalizedProfile';
import { useCompanyMasterAI } from '@/hooks/useCompanyMasterAI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Mic, User, Building, Sparkles, Settings, Target, Brain } from 'lucide-react';

const PersonalizedDashboard: React.FC = () => {
  const { profile, loading, error } = usePersonalizedProfile();
  const { masterAI } = useCompanyMasterAI();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-red-500">Failed to load profile: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalityInsights = () => {
    const insights = [];
    if (profile.sales_personality) insights.push(`${profile.sales_personality} personality`);
    if (profile.primary_goal) insights.push(`Focused on: ${profile.primary_goal}`);
    if (profile.motivation_trigger) insights.push(`Motivated by: ${profile.motivation_trigger}`);
    return insights;
  };

  const getManagementInsights = () => {
    const insights = [];
    if (profile.management_style) insights.push(`${profile.management_style} style`);
    if (profile.team_size) insights.push(`Managing ${profile.team_size} reps`);
    if (profile.preferred_team_personality) insights.push(`Building ${profile.preferred_team_personality}s`);
    return insights;
  };

  const aiAssistant = typeof profile.ai_assistant === 'object' && profile.ai_assistant !== null
    ? profile.ai_assistant as any
    : { name: profile.assistant_name || 'AI Assistant', tone: profile.voice_style || 'professional' };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Personalized Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {getGreeting()}, {profile.full_name || 'there'}!
              </h1>
              <p className="text-blue-100 mt-2">
                Your personalized {profile.role?.replace('_', ' ')} OS is ready. 
                Say "Hey {aiAssistant.name}" to get started.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Bot className="h-12 w-12 text-blue-200" />
              <div className="text-right">
                <p className="font-semibold">{aiAssistant.name}</p>
                <p className="text-sm text-blue-200">{aiAssistant.tone} style</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{profile.role?.replace('_', ' ')}</div>
              <Badge variant="secondary" className="mt-2">
                {profile.industry || 'Industry not set'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aiAssistant.name}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {aiAssistant.tone} • {aiAssistant.voice_style || 'standard'} voice
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Primary Focus</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {profile.primary_goal || profile.business_goal || 'Goals not set'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Company Brain</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground mt-2">
                {masterAI?.top_weaknesses?.length || 0} insights collected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Personality Insights */}
        {profile.role === 'sales_rep' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Your Sales Personality Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getPersonalityInsights().map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-blue-50">
                    <p className="font-medium text-blue-900">{insight}</p>
                  </div>
                ))}
              </div>
              {profile.weakness && (
                <div className="mt-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <p className="text-sm font-medium text-orange-800">Area to improve:</p>
                  <p className="text-orange-700">{profile.weakness}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Management Insights */}
        {profile.role === 'manager' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Your Management Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getManagementInsights().map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-green-50">
                    <p className="font-medium text-green-900">{insight}</p>
                  </div>
                ))}
              </div>
              {profile.team_obstacle && (
                <div className="mt-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <p className="text-sm font-medium text-orange-800">Team challenge:</p>
                  <p className="text-orange-700">{profile.team_obstacle}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Wishlist & Mental State */}
        {(profile.wishlist || profile.mental_state_trigger) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.wishlist && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Success Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{profile.wishlist}"</p>
                </CardContent>
              </Card>
            )}
            
            {profile.mental_state_trigger && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{profile.mental_state_trigger}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <Button size="lg" className="px-8">
            <Mic className="mr-2 h-4 w-4" />
            Start Voice Session
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="mr-2 h-4 w-4" />
            Customize Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
