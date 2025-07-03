
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
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';
import AISummaryCard from '@/components/AI/AISummaryCard';
import AIRecommendations from '@/components/AI/AIRecommendations';
import AICoachingPanel from '@/components/AI/AICoachingPanel';
import VoiceBriefing from '@/components/AI/VoiceBriefing';
import UnifiedAIBubble from '@/components/UnifiedAI/UnifiedAIBubble';
import PerformanceCardsGrid from '@/components/Dashboard/PerformanceCardsGrid';

const SalesRepDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { leads } = useMockData();

  const recentLeads = leads.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return '🔥';
      case 'medium': return '📊';
      case 'low': return '🧊';
      default: return '📋';
    }
  };

  const handleActionClick = (actionType: string, leadId?: string) => {
    const actionMessages = {
      call: 'Initiating call with AI-suggested talking points...',
      email: 'Drafting AI-optimized email...',
      meeting: 'Scheduling optimal meeting time...',
      analysis: 'Running AI lead analysis...'
    };
    
    console.log(`Demo: ${actionType} action triggered${leadId ? ` for lead ${leadId}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Pulse Table */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pipeline Pulse
                  <Badge className="bg-white/20 text-white text-xs">
                    AI Optimized
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentLeads.map((lead, index) => (
                    <div key={lead.id} className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${index === 0 ? 'bg-blue-50/50' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {lead.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.company}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPriorityIcon(lead.priority)}</span>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">${lead.value?.toLocaleString() || '0'}</span>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                            onClick={() => handleActionClick('call', lead.id)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 transition-colors"
                            onClick={() => handleActionClick('email', lead.id)}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0 hover:bg-purple-100 hover:border-purple-300 transition-colors"
                            onClick={() => handleActionClick('meeting', lead.id)}
                          >
                            <Calendar className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant Summary */}
            <AISummaryCard />

            {/* AI-Optimized Schedule */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  AI-Optimized Schedule
                  <Badge className="bg-white/20 text-white text-xs">
                    <Brain className="h-3 w-3 mr-1" />
                    Smart
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">09:00 - Priority Lead Calls</div>
                      <div className="text-xs text-gray-500">2 hours • AI optimized</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">11:30 - Follow-up Emails</div>
                      <div className="text-xs text-gray-500">30 minutes • AI drafted</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">14:00 - Warm Lead Outreach</div>
                      <div className="text-xs text-gray-500">1.5 hours • AI scored</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">16:00 - Deal Review & Notes</div>
                      <div className="text-xs text-gray-500">45 minutes • AI insights</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Recommendations and Coaching - Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIRecommendations />
          <AICoachingPanel />
        </div>

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
