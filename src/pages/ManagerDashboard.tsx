import { logger } from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ManagerNavigation from '@/components/Navigation/ManagerNavigation';
import ManagerOverviewCards from '@/components/Manager/ManagerOverviewCards';
import ManagerTeamTable from '@/components/Manager/ManagerTeamTable';
import ManagerAIAssistant from '@/components/ManagerAI/ManagerAIAssistant';
import ManagerRecognitionEngine from '@/components/Manager/ManagerRecognitionEngine';
import ManagerEscalationCenter from '@/components/Manager/ManagerEscalationCenter';
import ManagerBookingSystem from '@/components/Manager/ManagerBookingSystem';

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
  const { user, profile, signOut } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedRep, setSelectedRep] = useState<TeamMember | null>(null);
  
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
        last_login: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
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
        last_login: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        role: 'sales_rep',
        stats: {
          call_count: 198,
          win_count: 57,
          current_streak: 7,
          burnout_risk: 20,
          last_active: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          mood_score: 90
        }
      },
      {
        id: 'demo-tm-4',
        full_name: 'David Rodriguez',
        last_login: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        role: 'sales_rep',
        stats: {
          call_count: 105,
          win_count: 23,
          current_streak: 0,
          burnout_risk: 50,
          last_active: new Date(Date.now() - 172800000).toISOString(),
          mood_score: 60
        }
      },
      {
        id: 'demo-tm-5',
        full_name: 'Alex Morgan',
        last_login: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        role: 'sales_rep',
        stats: {
          call_count: 128,
          win_count: 29,
          current_streak: 2,
          burnout_risk: 30,
          last_active: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          mood_score: 75
        }
      }
    ];
    
    // Mock AI recommendations
    const mockRecommendations: AIRecommendation[] = [
      {
        id: 'demo-rec-1',
        type: 'follow-up',
        rep_name: 'David Rodriguez',
        rep_id: 'demo-tm-4',
        message: 'David missed 3 follow-ups with Enterprise leads this week',
        action: 'Assign Recovery Mode'
      },
      {
        id: 'demo-rec-2',
        type: 'burnout',
        rep_name: 'Michael Chen',
        rep_id: 'demo-tm-2',
        message: 'Michael worked 12+ hours overtime this week and mood score is dropping',
        action: 'Schedule 1-on-1'
      },
      {
        id: 'demo-rec-3',
        type: 'trending-down',
        rep_name: 'Alex Morgan',
        rep_id: 'demo-tm-5',
        message: 'Alex is trending down on close rate past 5 days',
        action: 'Review Call Recordings'
      },
      {
        id: 'demo-rec-4',
        type: 'reward',
        rep_name: 'Jasmine Lee',
        rep_id: 'demo-tm-3',
        message: 'Jasmine closed 3 enterprise deals this week! Great performance.',
        action: 'Send Recognition'
      }
    ];
    
    setTeamMembers(mockTeamMembers);
    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, we would fetch all team members for the manager
      // and their associated stats
      
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
      
      // In a real implementation, AI recommendations would be generated based on team data
      // Here we'll just set empty recommendations for simplicity
      setRecommendations([]);
      
    } catch (error) {
      logger.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return 'Never';
    
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getBurnoutColor = (risk: number) => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getMoodEmoji = (score: number | null) => {
    if (!score) return '😐';
    if (score >= 80) return '😁';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    if (score >= 20) return '😕';
    return '😞';
  };

  const handleRecommendationAction = (recommendation: AIRecommendation) => {
    const rep = teamMembers.find(member => member.id === recommendation.rep_id);
    
    if (!rep) {
      toast.error(`Could not find team member information`);
      return;
    }
    
    switch (recommendation.type) {
      case 'follow-up':
        toast.success(`Recovery mode assigned to ${recommendation.rep_name}`);
        break;
      case 'burnout':
        setSelectedRep(rep);
        setShowSessionModal(true);
        break;
      case 'trending-down':
        toast.success(`Added ${recommendation.rep_name}'s calls to your review queue`);
        break;
      case 'reward':
        toast.success(`Recognition sent to ${recommendation.rep_name}`);
        break;
    }
  };

  const scheduleSession = (type: '1on1' | 'video' | 'silent') => {
    if (!selectedRep) return;
    
    toast.success(`${type === '1on1' ? 'One-on-one' : type === 'video' ? 'Video call' : 'Silent coaching'} session scheduled with ${selectedRep.full_name}`);
    setShowSessionModal(false);
  };

  const sendRecognition = (repId: string) => {
    const rep = teamMembers.find(member => member.id === repId);
    if (!rep) return;
    
    toast.success(`Recognition sent to ${rep.full_name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
            {/* Header section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-salesBlue">Manager Dashboard</h1>
                  <p className="text-slate-500">
                    Welcome back, {demoMode ? 'John' : profile?.full_name || 'Manager'}! 
                    You have {recommendations.length} team notifications today.
                  </p>
                </div>
                
                {demoMode && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      localStorage.removeItem('demoMode');
                      localStorage.removeItem('demoRole');
                      window.location.href = '/auth';
                    }}
                  >
                    Exit Demo
                  </Button>
                )}
              </div>
              
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Users className="h-8 w-8 text-salesBlue mb-2" />
                    <p className="text-sm text-muted-foreground">Team Members</p>
                    <p className="text-3xl font-bold">{teamMembers.length}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Award className="h-8 w-8 text-salesGreen mb-2" />
                    <p className="text-sm text-muted-foreground">Top Performer</p>
                    <p className="text-xl font-bold truncate max-w-full">
                      {teamMembers.length > 0 
                        ? teamMembers.sort((a, b) => (b.stats?.win_count || 0) - (a.stats?.win_count || 0))[0]?.full_name 
                        : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-8 w-8 text-salesRed mb-2" />
                    <p className="text-sm text-muted-foreground">Burnout Risk</p>
                    <p className="text-3xl font-bold">
                      {teamMembers.filter(member => (member.stats?.burnout_risk || 0) > 50).length}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="h-8 w-8 text-salesCyan mb-2" />
                    <p className="text-sm text-muted-foreground">Team Win Rate</p>
                    <p className="text-3xl font-bold">
                      {teamMembers.length > 0
                        ? `${Math.round((teamMembers.reduce((total, member) => total + (member.stats?.win_count || 0), 0) / 
                           teamMembers.reduce((total, member) => total + (member.stats?.call_count || 0), 0)) * 100)}%`
                        : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Overview Section - Takes 2/3 width on large screens */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Overview
                    </CardTitle>
                    <CardDescription>
                      Performance metrics and status for your sales representatives
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rep</TableHead>
                            <TableHead className="text-center">Mood</TableHead>
                            <TableHead className="text-right">Calls</TableHead>
                            <TableHead className="text-right">Wins</TableHead>
                            <TableHead className="text-center">Streak</TableHead>
                            <TableHead className="text-center">Burnout Risk</TableHead>
                            <TableHead className="text-right">Last Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-salesBlue-light text-salesBlue">
                                      {(member.full_name?.charAt(0) || 'U')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{member.full_name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">Last login: {formatDate(member.last_login)}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center text-xl">
                                {getMoodEmoji(member.stats.mood_score)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {member.stats.call_count}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {member.stats.win_count}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={`${member.stats.current_streak > 0 ? 'bg-salesGreen' : 'bg-slate-400'}`}>
                                  {member.stats.current_streak} {member.stats.current_streak === 1 ? 'day' : 'days'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-24 bg-slate-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${getBurnoutColor(member.stats.burnout_risk)}`}
                                      style={{ width: `${member.stats.burnout_risk}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-medium">
                                    {member.stats.burnout_risk}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatDate(member.stats.last_active)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                                        setSelectedRep(member);
                                        setShowSessionModal(true);
                                      }}>
                                        <Calendar className="h-4 w-4" />
                                        <span className="sr-only">Schedule</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Schedule a 1-on-1</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => sendRecognition(member.id)}>
                                        <Award className="h-4 w-4" />
                                        <span className="sr-only">Recognize</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Send recognition</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <LineChart className="h-4 w-4" />
                                        <span className="sr-only">Stats</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View detailed stats</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          
                          {teamMembers.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} className="h-24 text-center">
                                No team members found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 p-4 flex justify-between">
                    <Button variant="outline" className="border-salesBlue text-salesBlue">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Team Member
                    </Button>
                    <Button variant="outline">
                      Download Report
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Recognition Engine */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-salesGreen" />
                      Recognition Engine
                    </CardTitle>
                    <CardDescription>
                      Celebrate team wins and boost morale
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-slate-600">
                        Recognition has been shown to increase team productivity by up to 31%. Use the tools below to keep your team motivated.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Award className="h-8 w-8 text-salesCyan mx-auto mb-2" />
                            <h3 className="font-medium mb-1">Personal Achievements</h3>
                            <p className="text-sm text-slate-500 mb-3">
                              Celebrate individual milestones
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Create Award
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Trophy className="h-8 w-8 text-salesGreen mx-auto mb-2" />
                            <h3 className="font-medium mb-1">Team Challenges</h3>
                            <p className="text-sm text-slate-500 mb-3">
                              Launch team competitions
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Start Challenge
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Bell className="h-8 w-8 text-salesBlue mx-auto mb-2" />
                            <h3 className="font-medium mb-1">Public Recognition</h3>
                            <p className="text-sm text-slate-500 mb-3">
                              Share wins with the whole team
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Create Announcement
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {demoMode && (
                  <Card className="border-dashed border-2 border-salesCyan-light bg-salesCyan bg-opacity-5">
                    <CardHeader>
                      <CardTitle className="text-salesCyan flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        End-of-Day Reporting
                      </CardTitle>
                      <CardDescription>
                        Comprehensive team performance summaries delivered to your inbox
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-slate-200">
                        <p className="text-slate-600 mb-4">
                          End-of-day reports include:
                        </p>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-salesGreen shrink-0 mt-0.5" />
                            <span>Daily team performance & progress tracking</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-salesGreen shrink-0 mt-0.5" />
                            <span>Burnout risk alerts & overtime tracking</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-salesGreen shrink-0 mt-0.5" />
                            <span>Lead source effectiveness analysis</span>
                          </li>
                        </ul>
                        <p className="text-sm font-medium text-amber-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          This feature is available on the Pro Plan
                        </p>
                      </div>
                      
                      <Button className="w-full">
                        Upgrade to Pro Plan
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Sidebar Content - Takes 1/3 width on large screens */}
              <div className="space-y-6">
                {/* Manager AI Assistant */}
                <Card className="border-salesCyan">
                  <CardHeader className="bg-gradient-to-r from-salesBlue to-salesCyan text-white pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Manager AI Assistant
                    </CardTitle>
                    <CardDescription className="text-white text-opacity-90">
                      Smart recommendations for your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y divide-slate-100">
                      {recommendations.map((rec) => (
                        <li key={rec.id} className="p-4 hover:bg-slate-50">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {rec.type === 'follow-up' && <Clock className="h-4 w-4 text-amber-500" />}
                              {rec.type === 'burnout' && <Heart className="h-4 w-4 text-red-500" />}
                              {rec.type === 'trending-down' && <LineChart className="h-4 w-4 text-salesCyan" />}
                              {rec.type === 'reward' && <Award className="h-4 w-4 text-salesGreen" />}
                              <p className="font-medium">{rec.rep_name}</p>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">
                              {rec.message}
                            </p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full border-salesBlue text-salesBlue hover:bg-salesBlue-light"
                              onClick={() => handleRecommendationAction(rec)}
                            >
                              {rec.action}
                            </Button>
                          </div>
                        </li>
                      ))}
                      
                      {recommendations.length === 0 && (
                        <li className="p-6 text-center text-slate-500">
                          No recommendations at this time. Check back later.
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter className="bg-slate-50 px-4 py-3">
                    <Button variant="ghost" className="w-full text-salesBlue">
                      View All Recommendations
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* 1-on-1 Booking System */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-salesBlue" />
                      1-on-1 Booking System
                    </CardTitle>
                    <CardDescription>
                      Schedule coaching sessions with your team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-slate-600 mb-2">
                        Regular 1-on-1s improve retention by 41% and performance by 27%.
                      </p>
                      
                      <Card className="bg-slate-50">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Next Sessions</h4>
                          {demoMode ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-salesBlue-light text-salesBlue">SJ</AvatarFallback>
                                  </Avatar>
                                  <span>Sarah Johnson</span>
                                </div>
                                <Badge>Tomorrow, 10:00 AM</Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-salesBlue-light text-salesBlue">MC</AvatarFallback>
                                  </Avatar>
                                  <span>Michael Chen</span>
                                </div>
                                <Badge>Friday, 2:00 PM</Badge>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">No upcoming sessions scheduled.</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Button className="w-full" onClick={() => setShowSessionModal(true)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule New Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Escalation Logic Card */}
                <Card className="border border-salesRed-light">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-salesRed">
                      <AlertCircle className="h-5 w-5" />
                      Escalation Center
                    </CardTitle>
                    <CardDescription>
                      Issues requiring leadership attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {demoMode ? (
                      <div className="space-y-4">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                          <h4 className="font-medium flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            High Priority
                          </h4>
                          <p className="text-sm text-red-600 mt-1">
                            Michael Chen has missed 5 consecutive quota periods
                          </p>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">Create Plan</Button>
                            <Button size="sm" variant="outline" className="text-xs">Escalate</Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-500">
                          Issues are only escalated when they impact company performance or require leadership intervention.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle className="h-12 w-12 text-salesGreen mx-auto mb-2" />
                        <p className="font-medium text-salesGreen">No escalations needed</p>
                        <p className="text-sm text-slate-500 mt-1">All team metrics within expected ranges</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Manager AI Assistant - Fixed Position */}
      <ManagerAIAssistant />
      
      {/* 1-on-1 Booking Modal */}
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
