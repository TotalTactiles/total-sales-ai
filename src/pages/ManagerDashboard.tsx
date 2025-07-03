import { logger } from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import ManagerOverviewCards from '@/components/Manager/ManagerOverviewCards';
import ManagerTeamTable from '@/components/Manager/ManagerTeamTable';
import ManagerAIAssistant from '@/components/ManagerAI/ManagerAIAssistant';
import ManagerRecognitionEngine from '@/components/Manager/ManagerRecognitionEngine';
import ManagerEscalationCenter from '@/components/Manager/ManagerEscalationCenter';
import ManagerBookingSystem from '@/components/Manager/ManagerBookingSystem';
import MetricModal from '@/components/Manager/MetricModal';
import TeamMemberModal from '@/components/Manager/TeamMemberModal';
import BusinessOpsSnapshot from '@/components/Manager/BusinessOpsSnapshot';
import { 
  Users, 
  Brain, 
  LineChart, 
  Calendar, 
  Award, 
  Heart, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  UserPlus, 
  MessageCircle, 
  Video,
  BarChart,
  Bell,
  AlertTriangle,
  Trophy,
  DollarSign,
  TrendingUp
} from 'lucide-react';

type TeamMember = {
  id: string;
  full_name: string | null;
  last_login: string | null;
  role: string;
  stats: {
    call_count: number;
    win_count: number;
    current_streak: number;
    burnout_risk: number;
    last_active: string | null;
    mood_score: number | null;
  }
};

type AIRecommendation = {
  id: string;
  type: 'follow-up' | 'burnout' | 'trending-down' | 'reward';
  rep_name: string;
  rep_id: string;
  message: string;
  action: string;
};

const ManagerDashboard = () => {
  const { user, profile } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedRep, setSelectedRep] = useState<TeamMember | null>(null);
  
  // Modal states
  const [activeMetricModal, setActiveMetricModal] = useState<string | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  
  // Check if in demo mode
  useEffect(() => {
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    if (isDemoMode) {
      setDemoMode(true);
      initializeDemoData();
    } else {
      fetchData();
    }
  }, [user]);

  const initializeDemoData = () => {
    // Mock team members data
    const mockTeamMembers: TeamMember[] = [
      {
        id: 'demo-tm-1',
        full_name: 'Sarah Johnson',
        last_login: new Date().toISOString(),
        role: 'sales_rep',
        stats: {
          call_count: 172,
          win_count: 45,
          current_streak: 5,
          burnout_risk: 10,
          last_active: new Date().toISOString(),
          mood_score: 85
        }
      },
      {
        id: 'demo-tm-2',
        full_name: 'Michael Chen',
        last_login: new Date(Date.now() - 3600000).toISOString(),
        role: 'sales_rep',
        stats: {
          call_count: 143,
          win_count: 32,
          current_streak: 0,
          burnout_risk: 75,
          last_active: new Date(Date.now() - 3600000).toISOString(),
          mood_score: 45
        }
      },
      {
        id: 'demo-tm-3',
        full_name: 'Jasmine Lee',
        last_login: new Date(Date.now() - 86400000).toISOString(),
        role: 'sales_rep',
        stats: {
          call_count: 198,
          win_count: 57,
          current_streak: 7,
          burnout_risk: 20,
          last_active: new Date(Date.now() - 43200000).toISOString(),
          mood_score: 90
        }
      }
    ];
    
    const mockRecommendations: AIRecommendation[] = [
      {
        id: 'demo-rec-1',
        type: 'follow-up',
        rep_name: 'Sarah Johnson',
        rep_id: 'demo-tm-1',
        message: 'Sarah missed 3 follow-ups with Enterprise leads this week',
        action: 'Assign Recovery Mode'
      },
      {
        id: 'demo-rec-2',
        type: 'burnout',
        rep_name: 'Michael Chen',
        rep_id: 'demo-tm-2',
        message: 'Michael worked 12+ hours overtime this week and mood score is dropping',
        action: 'Schedule 1-on-1'
      }
    ];
    
    setTeamMembers(mockTeamMembers);
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch all profiles that are sales reps
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'sales_rep');
      
      if (profilesError) throw profilesError;
      
      // Get stats for each sales rep
      const teamData: TeamMember[] = [];
      
      for (const profile of profilesData) {
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', profile.id)
          .single();
          
        if (statsError && statsError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          logger.error('Error fetching stats for user', { userId: profile.id, error: statsError.message });
          continue;
        }
        
        teamData.push({
          id: profile.id,
          full_name: profile.full_name,
          last_login: profile.last_login,
          role: profile.role,
          stats: statsData || {
            call_count: 0,
            win_count: 0,
            current_streak: 0,
            burnout_risk: 0,
            last_active: null,
            mood_score: null
          }
        });
      }
      
      setTeamMembers(teamData);
      setRecommendations([]);
      
    } catch (error) {
      logger.error('Error fetching data:', { error });
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const scheduleSession = (type: '1on1' | 'video' | 'silent') => {
    if (!selectedRep) return;
    
    toast.success(`${type === '1on1' ? 'One-on-one' : type === 'video' ? 'Video call' : 'Silent coaching'} session scheduled with ${selectedRep.full_name}`);
    setShowSessionModal(false);
  };

  // Metric modal configurations
  const getMetricModalConfig = (metricType: string) => {
    switch (metricType) {
      case 'revenue':
        return {
          title: 'Forecasted Revenue',
          metric: '$340,320',
          change: '+15% projected growth',
          insights: [
            'Q4 trending 23% above target based on current pipeline velocity',
            'Enterprise segment driving 67% of growth',
            'SMB conversion rates improving by 12% month-over-month'
          ],
          recommendations: [
            'Focus enterprise team on closing Q4 deals',
            'Increase SMB marketing spend while conversion is high',
            'Schedule revenue forecast review with leadership'
          ],
          deepDiveLink: '/manager/reports',
          deepDiveLinkText: 'View Revenue Analytics'
        };
      case 'risk':
        return {
          title: 'Risk Flagged Reps',
          metric: '1 Rep',
          change: 'Needs immediate attention',
          insights: [
            'Michael Chen showing 75% burnout risk indicators',
            'Performance declining 18% over past 2 weeks',
            'Mood score dropped from 78% to 45%'
          ],
          recommendations: [
            'Schedule immediate 1-on-1 with Michael',
            'Review workload distribution',
            'Consider temporary support assignment'
          ],
          deepDiveLink: '/manager/team',
          deepDiveLinkText: 'View Team Health'
        };
      case 'pipeline':
        return {
          title: 'Pipeline Movement',
          metric: '+$137,700',
          change: 'Net positive this week',
          insights: [
            'Strong activity in enterprise segment',
            '12 deals advanced to negotiation stage',
            'Average deal size increased by 23%'
          ],
          recommendations: [
            'Accelerate negotiation training for team',
            'Focus on enterprise deal coaching',
            'Review pricing strategies for optimal close rates'
          ],
          deepDiveLink: '/manager/leads',
          deepDiveLinkText: 'View Pipeline Details'
        };
      case 'alerts':
        return {
          title: 'AI Alerts',
          metric: '3 Active',
          change: '2 require action',
          insights: [
            'Hot leads going cold in pipeline',
            'Rep burnout indicators detected',
            'Follow-up delays impacting conversion'
          ],
          recommendations: [
            'Assign hot leads to available reps',
            'Implement automated follow-up sequences',
            'Review team capacity and workload'
          ],
          deepDiveLink: '/manager/ai',
          deepDiveLinkText: 'View AI Alert Center'
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesBlue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ManagerNavigation />
      
      <main className="pt-[60px]">
        <div className="flex-1 px-4 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Top Cards - Now Clickable */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Forecasted Revenue Card */}
              <div 
                onClick={() => setActiveMetricModal('revenue')}
                className="cursor-pointer transform hover:scale-105 transition-all duration-200"
              >
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Forecasted Revenue</p>
                        <p className="text-3xl font-bold text-green-700">$340,320</p>
                        <p className="text-green-600 text-sm mt-1">+15% projected growth</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Flagged Reps Card */}
              <div 
                onClick={() => setActiveMetricModal('risk')}
                className="cursor-pointer transform hover:scale-105 transition-all duration-200"
              >
                <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">Risk Flagged Reps</p>
                        <p className="text-3xl font-bold text-red-700">1</p>
                        <p className="text-red-600 text-sm mt-1">Need immediate attention</p>
                      </div>
                      <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pipeline Movement Card */}
              <div 
                onClick={() => setActiveMetricModal('pipeline')}
                className="cursor-pointer transform hover:scale-105 transition-all duration-200"
              >
                <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Pipeline Movement</p>
                        <p className="text-3xl font-bold text-blue-700">+$137,700</p>
                        <p className="text-blue-600 text-sm mt-1">Net positive this week</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Alerts Card */}
              <div 
                onClick={() => setActiveMetricModal('alerts')}
                className="cursor-pointer transform hover:scale-105 transition-all duration-200"
              >
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 border-2 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">AI Alerts</p>
                        <p className="text-3xl font-bold text-purple-700">3</p>
                        <p className="text-purple-600 text-sm mt-1">2 require action</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Brain className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Enhanced Team Table with Click Handlers */}
                <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Performance Grid
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedTeamMember(member)}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                                {member.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{member.full_name}</h3>
                              <p className="text-sm text-gray-600">{member.stats.last_active ? 'Active' : 'Offline'}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Revenue:</span>
                              <span className="font-semibold text-green-600">${(Math.random() * 100000).toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Calls:</span>
                              <span className="font-semibold">{member.stats.call_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Conversion:</span>
                              <span className="font-semibold text-blue-600">{Math.floor(Math.random() * 40 + 20)}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Business Operations Snapshot */}
                <BusinessOpsSnapshot />
                
                <ManagerRecognitionEngine />
              </div>
              
              <div className="space-y-6">
                <ManagerAIAssistant />
                <ManagerBookingSystem demoMode={demoMode} />
                <ManagerEscalationCenter demoMode={demoMode} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Metric Modals */}
      {activeMetricModal && (
        <MetricModal
          isOpen={true}
          onClose={() => setActiveMetricModal(null)}
          type={activeMetricModal as any}
          {...getMetricModalConfig(activeMetricModal)!}
        />
      )}

      {/* Team Member Modal */}
      {selectedTeamMember && (
        <TeamMemberModal
          isOpen={true}
          onClose={() => setSelectedTeamMember(null)}
          member={selectedTeamMember}
        />
      )}
      
      {/* Legacy 1-on-1 Booking Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Schedule Session with {selectedRep?.full_name || 'Team Member'}
            </h3>
            
            <div className="space-y-4 mb-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <button 
                    onClick={() => scheduleSession('1on1')}
                    className="w-full flex items-center p-4 hover:bg-slate-50 border-b"
                  >
                    <Calendar className="h-10 w-10 text-salesBlue mr-4" />
                    <div className="text-left">
                      <h4 className="font-medium">Calendar-Based 1-on-1</h4>
                      <p className="text-sm text-slate-500">
                        Schedule a formal meeting with calendar invite
                      </p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => scheduleSession('video')}
                    className="w-full flex items-center p-4 hover:bg-slate-50 border-b"
                  >
                    <Video className="h-10 w-10 text-salesCyan mr-4" />
                    <div className="text-left">
                      <h4 className="font-medium">Video Coaching</h4>
                      <p className="text-sm text-slate-500">
                        Immediate video call with recording feature
                      </p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => scheduleSession('silent')}
                    className="w-full flex items-center p-4 hover:bg-slate-50"
                  >
                    <MessageCircle className="h-10 w-10 text-salesGreen mr-4" />
                    <div className="text-left">
                      <h4 className="font-medium">Silent Coaching Session</h4>
                      <p className="text-sm text-slate-500">
                        Listen in on live calls with feedback channel
                      </p>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowSessionModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
