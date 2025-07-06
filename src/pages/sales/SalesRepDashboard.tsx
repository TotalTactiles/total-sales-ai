
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Clock,
  DollarSign,
  Zap,
  Brain,
  Headphones,
  Settings,
  CheckCircle,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';
import AISummaryCard from '@/components/AI/AISummaryCard';
import AIRecommendations from '@/components/AI/AIRecommendations';
import AICoachingPanel from '@/components/AI/AICoachingPanel';
import VoiceBriefing from '@/components/AI/VoiceBriefing';
import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import PerformanceCardsGrid from '@/components/Dashboard/PerformanceCardsGrid';
import OptimizedPipelinePulse from '@/components/Dashboard/OptimizedPipelinePulse';
import RewardsProgress from '@/components/Dashboard/RewardsProgress';
import AIOptimizedSchedule from '@/components/Dashboard/AIOptimizedSchedule';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads } = useMockData();

  // Calculate dashboard metrics from leads data
  const totalLeads = leads.length;
  const hotLeads = leads.filter(lead => lead.priority === 'high').length;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  const closedWon = leads.filter(lead => lead.status === 'closed_won').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Quick Stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales OS Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || 'Sales Rep'}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
              <div className="text-sm text-gray-500">Total Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{hotLeads}</div>
              <div className="text-sm text-gray-500">Hot Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Pipeline Value</div>
            </div>
          </div>
        </div>

        {/* Top Section with Performance Cards and Voice Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Cards Grid - Now in top-left */}
          <div className="lg:col-span-2">
            <PerformanceCardsGrid />
          </div>
          
          {/* Voice Briefing - Right side */}
          <div>
            <VoiceBriefing userName={profile?.full_name || 'Sales Rep'} />
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Make Calls</div>
              <div className="text-sm text-gray-500">Auto Dialer Ready</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Send Emails</div>
              <div className="text-sm text-gray-500">AI Drafts Available</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Schedule</div>
              <div className="text-sm text-gray-500">Book Meetings</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">AI Coach</div>
              <div className="text-sm text-gray-500">Get Insights</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Optimized Pipeline Pulse */}
          <div className="lg:col-span-2">
            <OptimizedPipelinePulse leads={leads} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Summary */}
            <AISummaryCard />

            {/* AI-Optimized Schedule */}
            <AIOptimizedSchedule />

            {/* Today's Priority Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Priority Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Follow up with Sarah Johnson</div>
                      <div className="text-xs text-gray-500">Due in 2 hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Send proposal to Michael Chen</div>
                      <div className="text-xs text-gray-500">Due today</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Close David Kim deal</div>
                      <div className="text-xs text-gray-500">Ready to close</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rewards Progress Section */}
        <div className="mt-6">
          <RewardsProgress />
        </div>

        {/* AI Recommendations and Coaching - Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRecommendations />
          <AICoachingPanel />
        </div>

        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border-l-4 border-green-500 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Deal closed with Jennifer Adams</div>
                  <div className="text-sm text-gray-500">$95,000 • 1 day ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium">Email sent to Emily Rodriguez</div>
                  <div className="text-sm text-gray-500">Proposal follow-up • 3 days ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium">Call completed with David Kim</div>
                  <div className="text-sm text-gray-500">22 minutes • 12 hours ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Contextual Bubble */}
        <UnifiedAIBubble 
          context={{
            workspace: 'dashboard',
            currentLead: undefined,
            isCallActive: false
          }}
        />
      </div>
    </div>
  );
};

export default SalesRepDashboard;
