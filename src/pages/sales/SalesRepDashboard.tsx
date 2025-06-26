
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Users, 
  Phone, 
  Calendar,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';

const SalesRepDashboard = () => {
  const { profile } = useAuth();
  const [currentMood, setCurrentMood] = useState<'fire' | 'neutral' | 'cold' | null>(null);

  // Mock data for sales rep dashboard
  const dailyStats = {
    callsMade: 23,
    dealsBooked: 3,
    pipelineValue: 125000,
    conversionRate: 18.5
  };

  const todaysLeads = [
    { id: 1, name: 'John Smith', company: 'Tech Corp', priority: 'high', likelihood: 85, nextAction: 'Demo scheduled' },
    { id: 2, name: 'Sarah Wilson', company: 'StartupXYZ', priority: 'medium', likelihood: 65, nextAction: 'Follow-up call' },
    { id: 3, name: 'Mike Johnson', company: 'Enterprise Inc', priority: 'high', likelihood: 90, nextAction: 'Proposal review' }
  ];

  const aiInsights = [
    { type: 'success', message: 'Your objection handling improved 25% this week!' },
    { type: 'tip', message: 'Best time to call Tech Corp leads: 2-4 PM EST' },
    { type: 'alert', message: 'Follow up with John Smith - 48 hours since last contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SalesRepNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600">Ready to crush your goals, {profile?.full_name}!</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Brain className="h-3 w-3 mr-1" />
              AI Coach Active
            </Badge>
          </div>
        </div>

        {/* Mood Check-in */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {[
                { mood: 'fire', emoji: '🔥', label: 'On Fire!' },
                { mood: 'neutral', emoji: '😐', label: 'Steady' },
                { mood: 'cold', emoji: '🥶', label: 'Cold Call Mode' }
              ].map((option) => (
                <Button
                  key={option.mood}
                  variant={currentMood === option.mood ? 'default' : 'outline'}
                  onClick={() => setCurrentMood(option.mood as any)}
                  className="flex items-center gap-2"
                >
                  <span className="text-lg">{option.emoji}</span>
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Calls Made</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{dailyStats.callsMade}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Demos Booked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">{dailyStats.dealsBooked}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold">${(dailyStats.pipelineValue / 1000).toFixed(0)}K</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold">{dailyStats.conversionRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Priorities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Kill List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                      <p className="text-xs text-gray-500">{lead.nextAction}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={lead.priority === 'high' ? 'destructive' : 'secondary'}
                        className="mb-1"
                      >
                        {lead.priority}
                      </Badge>
                      <p className="text-sm font-medium">{lead.likelihood}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Insights & Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    insight.type === 'success' ? 'bg-green-50 border-green-500' :
                    insight.type === 'tip' ? 'bg-blue-50 border-blue-500' :
                    'bg-yellow-50 border-yellow-500'
                  }`}>
                    <div className="flex items-start gap-2">
                      {insight.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" /> :
                       insight.type === 'tip' ? <Brain className="h-4 w-4 text-blue-600 mt-0.5" /> :
                       <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                      <p className="text-sm">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
