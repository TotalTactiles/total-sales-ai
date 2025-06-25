
import React from 'react';
import { usePersonalizedProfile } from '@/hooks/usePersonalizedProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Mic, User, Building, Sparkles, Settings } from 'lucide-react';

const PersonalizedDashboard: React.FC = () => {
  const { profile, loading, error } = usePersonalizedProfile();

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

  const getVoiceStyleDescription = (style: string) => {
    switch (style) {
      case 'professional': return 'Formal and business-focused';
      case 'friendly': return 'Warm and approachable';
      case 'enthusiastic': return 'Energetic and motivating';
      case 'direct': return 'Straight to the point';
      default: return 'Balanced approach';
    }
  };

  const getRoleSpecificFeatures = () => {
    switch (profile.role) {
      case 'manager':
        return ['Team Analytics', 'Performance Reports', 'Lead Assignment', 'Goal Tracking'];
      case 'admin':
        return ['System Settings', 'User Management', 'Data Export', 'Integrations'];
      case 'developer':
        return ['API Logs', 'System Health', 'Error Monitoring', 'Debug Tools'];
      default:
        return ['Lead Management', 'Call Dialer', 'Email Templates', 'Pipeline Tracking'];
    }
  };

  const getIndustryInsights = () => {
    if (!profile.industry) return [];
    
    switch (profile.industry) {
      case 'technology':
        return ['Tech Stack Analysis', 'Software Demo Scripts', 'Developer Persona Insights'];
      case 'healthcare':
        return ['Compliance Guidelines', 'HIPAA-Safe Templates', 'Medical Industry Trends'];
      case 'finance':
        return ['Financial Regulations', 'Investment Talking Points', 'Market Analysis'];
      case 'real_estate':
        return ['Market Comparisons', 'Property Valuation Tools', 'Mortgage Calculators'];
      default:
        return ['Industry Best Practices', 'Market Research', 'Competitive Analysis'];
    }
  };

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
                Your personalized SalesOS is ready. Say "Hey {profile.assistant_name}" to get started.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Bot className="h-12 w-12 text-blue-200" />
              <div className="text-right">
                <p className="font-semibold">{profile.assistant_name}</p>
                <p className="text-sm text-blue-200">{profile.voice_style} style</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personalization Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{profile.role?.replace('_', ' ')}</div>
              <Badge variant="secondary" className="mt-2">
                {profile.role === 'sales_rep' ? 'Sales Representative' : profile.role}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Industry</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {profile.industry?.replace('_', ' ') || 'Not specified'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Tailored insights available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.assistant_name}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {getVoiceStyleDescription(profile.voice_style)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voice Commands</CardTitle>
              <Mic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground mt-2">
                Say "Hey {profile.assistant_name}"
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role-Specific Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5" />
              Features Tailored for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getRoleSpecificFeatures().map((feature, index) => (
                <Button
                  key={index}
                  variant="outline" 
                  className="h-auto p-4 text-left justify-start"
                >
                  {feature}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Industry Insights */}
        {profile.industry && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                {profile.industry.charAt(0).toUpperCase() + profile.industry.slice(1)} Industry Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getIndustryInsights().map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                    <p className="font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

        {/* Debug Info (for testing) */}
        <Card className="bg-gray-100">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info (Development)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
