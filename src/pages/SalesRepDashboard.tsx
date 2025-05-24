import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  Headphones, 
  Brain, 
  Zap, 
  Clock, 
  Mic, 
  LineChart, 
  Trophy, 
  Heart, 
  PhoneCall,
  Award,
  VideoIcon,
  MessageCircle,
  AlertCircle,
  ArrowUpRight,
  BarChart,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  Users,
  Mail,
  Calendar,
  Settings,
  Activity,
  Star
} from 'lucide-react';

type AIPersona = {
  id: string;
  name: string;
  level: number;
  tone: string;
  delivery_style: string;
};

type UserStats = {
  call_count: number;
  win_count: number;
  current_streak: number;
  best_time_start: string | null;
  best_time_end: string | null;
  mood_score: number | null;
};

type ConfidenceEntry = {
  id: string;
  win_description: string;
  objection_handled: string | null;
  date_achieved: string;
};

const SalesRepDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [aiPersona, setAiPersona] = useState<AIPersona | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [confidenceCache, setConfidenceCache] = useState<ConfidenceEntry[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const [showVoiceTraining, setShowVoiceTraining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [isFullUser, setIsFullUser] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(true);
  
  // Check if user is full user
  useEffect(() => {
    const userStatus = localStorage.getItem('userStatus');
    const planType = localStorage.getItem('planType');
    setIsFullUser(userStatus === 'full' && planType === 'pro');
    
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    if (isDemoMode || userStatus === 'full') {
      setDemoMode(isDemoMode && userStatus !== 'full');
      initializeFullUserData();
    } else {
      fetchData();
    }
  }, [user]);

  const initializeFullUserData = () => {
    // Set enhanced data for full user
    setAiPersona({
      id: 'full-user-1',
      name: 'Alex Pro',
      level: 5,
      tone: 'adaptive',
      delivery_style: 'personalized'
    });
    
    setUserStats({
      call_count: 347,
      win_count: 89,
      current_streak: 12,
      best_time_start: '14:00',
      best_time_end: '16:00',
      mood_score: 92
    });
    
    setConfidenceCache([
      {
        id: 'full-conf-1',
        win_description: 'Closed $50K enterprise deal using AI-powered objection handling',
        objection_handled: 'Budget constraints',
        date_achieved: new Date().toISOString()
      },
      {
        id: 'full-conf-2',
        win_description: 'Converted skeptical prospect with personalized ROI calculator',
        objection_handled: 'Competitor preference',
        date_achieved: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'full-conf-3',
        win_description: 'Upsold existing client 40% using AI conversation insights',
        objection_handled: 'Feature limitations',
        date_achieved: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'full-conf-4',
        win_description: 'Landed whale account after AI-coached persistence strategy',
        objection_handled: 'Long sales cycle',
        date_achieved: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 'full-conf-5',
        win_description: 'Recovered lost deal with AI sentiment analysis insights',
        objection_handled: 'Trust issues',
        date_achieved: new Date(Date.now() - 345600000).toISOString()
      }
    ]);
    
    setLoading(false);
    
    // Welcome message for full user
    setTimeout(() => {
      toast.success("Welcome back! All Pro features are active.", {
        description: "Your AI assistant is fully trained and ready to help.",
      });
    }, 2000);
  };

  const fetchData = async () => {
    if (!user) return;
    
    try {
      // Fetch AI persona
      const { data: personaData, error: personaError } = await supabase
        .from('ai_agent_personas')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (personaError) throw personaError;
      
      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError) throw statsError;
      
      // Fetch confidence cache entries
      const { data: confidenceData, error: confidenceError } = await supabase
        .from('confidence_cache')
        .select('*')
        .eq('user_id', user.id)
        .order('date_achieved', { ascending: false })
        .limit(5);
        
      if (confidenceError) throw confidenceError;
      
      setAiPersona(personaData as AIPersona);
      setUserStats(statsData as UserStats);
      setConfidenceCache(confidenceData as ConfidenceEntry[]);
      
      // Check if we should show voice training based on streak
      if (statsData.current_streak >= 3) {
        setShowVoiceTraining(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleFocusMode = async () => {
    setFocusMode(!focusMode);
    
    if (!focusMode) {
      toast.success("Focus Mode activated! Notifications silenced.");
      if (!demoMode && user) {
        // Update user stats to log focus mode usage
        const startTime = new Date().toISOString();
        localStorage.setItem('focusModeStart', startTime);
      }
    } else {
      toast.info("Focus Mode deactivated. Welcome back!");
      if (!demoMode && user) {
        // Calculate focus time and update stats
        const startTime = localStorage.getItem('focusModeStart');
        if (startTime) {
          const focusTimeMinutes = Math.round((Date.now() - new Date(startTime).getTime()) / 60000);
          toast.info(`You were focused for ${focusTimeMinutes} minutes`);
          
          // In a real implementation, you would update the database with this information
        }
        localStorage.removeItem('focusModeStart');
      }
    }
  };

  const activateRecoveryMode = () => {
    setRecoveryMode(true);
    toast.success("Recovery Mode activated. Let's rebuild your momentum!");
  };

  const startVoiceInput = () => {
    setShowVoiceInput(true);
  };

  const simulateVoiceRecording = () => {
    setVoiceInputActive(true);
    
    // Simulate voice recording and processing
    setTimeout(() => {
      setVoiceInputActive(false);
      toast.success("Voice journal saved! Your AI assistant will learn from this.");
      setShowVoiceInput(false);
    }, 3000);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-salesBlue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 flex">
        {/* Left Sidebar - Sales Rep Profile & Quick Actions */}
        <div className={`bg-white border-r transition-all duration-300 ${
          leftCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="h-full flex flex-col">
            {/* Collapse Toggle */}
            <div className="p-4 border-b flex justify-between items-center">
              {!leftCollapsed && (
                <h2 className="font-semibold text-lg">Sales Rep Profile</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftCollapsed(!leftCollapsed)}
                className="ml-auto"
              >
                {leftCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>

            {!leftCollapsed && (
              <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Profile Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-salesBlue text-white">
                          {isFullUser ? 'SP' : (profile?.full_name?.charAt(0) || 'SR')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{isFullUser ? 'Sam' : profile?.full_name || 'Sales Rep'}</h3>
                        <p className="text-sm text-slate-500">Sales Representative</p>
                        {isFullUser && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Pro User
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-salesBlue">{userStats?.call_count || 0}</p>
                        <p className="text-xs text-slate-600">Total Calls</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-2xl font-bold text-salesGreen">{userStats?.win_count || 0}</p>
                        <p className="text-xs text-slate-600">Wins</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Start Calling
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Emails
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start ${
                        focusMode ? 'bg-salesGreen text-white hover:bg-salesGreen-dark' : 'border-salesGreen text-salesGreen hover:bg-salesGreen-light'
                      }`}
                      onClick={toggleFocusMode}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Assistant Level */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-salesBlue" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{aiPersona?.name || 'AI Assistant'}</span>
                        <Badge variant="outline" className={`${isFullUser ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-salesBlue-light text-salesBlue'}`}>
                          Level {aiPersona?.level || 1}
                        </Badge>
                      </div>
                      <Progress value={(aiPersona?.level || 1) * 20} className="h-2" />
                      <div className="text-xs text-slate-500">
                        <span className="capitalize">{aiPersona?.tone || 'Professional'}</span> • <span className="capitalize">{aiPersona?.delivery_style || 'Direct'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Center Content - Main Dashboard */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with AI Summary */}
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-salesBlue">Sales Rep Dashboard</h1>
                <p className="text-slate-500">
                  Welcome back! 
                  {userStats?.current_streak ? 
                    ` You're on a ${userStats.current_streak} day winning streak! 🔥` : 
                    ' Ready to make some calls?'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">AI Summary</span>
                  <Switch 
                    checked={aiSummaryEnabled} 
                    onCheckedChange={setAiSummaryEnabled}
                  />
                </div>
                {!isFullUser && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      localStorage.removeItem('demoMode');
                      localStorage.removeItem('demoRole');
                      localStorage.removeItem('userStatus');
                      localStorage.removeItem('planType');
                      window.location.href = '/auth';
                    }}
                  >
                    Exit Demo
                  </Button>
                )}
              </div>
            </div>

            {/* AI Summary Banner */}
            {aiSummaryEnabled && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-900 mb-1">AI Summary - Your Performance Today</h3>
                    <p className="text-sm text-blue-700 mb-2">
                      You've made {userStats?.call_count || 0} calls with a {userStats?.win_count ? Math.round((userStats.win_count / userStats.call_count) * 100) : 0}% success rate. 
                      {userStats?.current_streak && userStats.current_streak > 0 && ` Your ${userStats.current_streak}-day streak shows consistent performance.`}
                    </p>
                    <p className="text-sm font-medium text-blue-800">
                      <strong>Next step:</strong> {userStats?.mood_score && userStats.mood_score < 70 ? 'Consider activating Recovery Mode to rebuild momentum' : 'Continue your current approach - it\'s working well!'} 
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-6 bg-white">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">🏠 Overview</TabsTrigger>
                <TabsTrigger value="performance">📊 Performance</TabsTrigger>
                <TabsTrigger value="training">🧠 AI Training</TabsTrigger>
                <TabsTrigger value="tools">⚡ Tools</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="h-full m-0 p-6">
                {/* Enhanced KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className={isFullUser ? "border-2 border-gradient-to-r from-yellow-400 to-orange-500" : ""}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <PhoneCall className="h-8 w-8 text-salesBlue mb-2" />
                      <p className="text-sm text-muted-foreground">Total Calls</p>
                      <p className="text-3xl font-bold">{userStats?.call_count || 0}</p>
                      {isFullUser && <Badge variant="outline" className="mt-1">+23% vs last month</Badge>}
                    </CardContent>
                  </Card>
                  
                  <Card className={isFullUser ? "border-2 border-gradient-to-r from-green-400 to-blue-500" : ""}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Trophy className="h-8 w-8 text-salesGreen mb-2" />
                      <p className="text-sm text-muted-foreground">Wins</p>
                      <p className="text-3xl font-bold">{userStats?.win_count || 0}</p>
                      {isFullUser && <Badge variant="outline" className="mt-1">25.7% conversion</Badge>}
                    </CardContent>
                  </Card>
                  
                  <Card className={isFullUser ? "border-2 border-gradient-to-r from-purple-400 to-pink-500" : ""}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Zap className="h-8 w-8 text-salesCyan mb-2" />
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-3xl font-bold">{userStats?.current_streak || 0}</p>
                      {isFullUser && <Badge variant="outline" className="mt-1">Personal best!</Badge>}
                    </CardContent>
                  </Card>
                  
                  <Card className={isFullUser ? "border-2 border-gradient-to-r from-red-400 to-yellow-500" : ""}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <Heart className="h-8 w-8 text-salesRed mb-2" />
                      <p className="text-sm text-muted-foreground">Energy Level</p>
                      <p className="text-3xl font-bold">{userStats?.mood_score || 70}%</p>
                      {isFullUser && <Badge variant="outline" className="mt-1">Optimized</Badge>}
                    </CardContent>
                  </Card>
                </div>

                {/* Victory Archive */}
                {!recoveryMode ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-salesGreen" />
                        {isFullUser ? 'Victory Archive' : 'Confidence Cache'}
                      </CardTitle>
                      <CardDescription>
                        {isFullUser ? 'Your most impactful wins and AI-powered strategies' : 'Your recent wins and successful objection handling'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y divide-slate-100">
                        {confidenceCache.map((entry) => (
                          <li key={entry.id} className="p-4 hover:bg-slate-50">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{entry.win_description}</p>
                                {entry.objection_handled && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    Objection Handled: {entry.objection_handled}
                                  </Badge>
                                )}
                              </div>
                              <Badge className={`${isFullUser ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-salesBlue'} text-white ml-2`}>
                                {formatDate(entry.date_achieved)}
                              </Badge>
                            </div>
                          </li>
                        ))}
                        
                        {confidenceCache.length === 0 && (
                          <li className="p-6 text-center text-slate-500">
                            No confidence entries yet. Your wins will appear here.
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-salesRed" />
                        Recovery Mode
                      </CardTitle>
                      <CardDescription>
                        Let's rebuild your momentum with these recovery activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="border border-salesBlue-light">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <VideoIcon className="h-4 w-4 text-salesBlue" />
                                Training Video
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <p className="text-sm text-slate-600 mb-4">Quick refresher on handling common objections</p>
                              <Button variant="outline" size="sm" className="w-full">
                                Watch Now (3 min)
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card className="border border-salesCyan-light">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <MessageCircle className="h-4 w-4 text-salesCyan" />
                                Warm Emails
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <p className="text-sm text-slate-600 mb-4">Re-engage 5 warm leads with AI-crafted emails</p>
                              <Button variant="outline" size="sm" className="w-full">
                                Start Email Campaign
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card className="border border-salesGreen-light">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Zap className="h-4 w-4 text-salesGreen" />
                                Mental Reset
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <p className="text-sm text-slate-600 mb-4">5-minute guided exercise to rebuild confidence</p>
                              <Button variant="outline" size="sm" className="w-full">
                                Start Session
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            variant="ghost" 
                            onClick={() => setRecoveryMode(false)}
                            className="text-slate-500 hover:text-slate-700"
                          >
                            Exit Recovery Mode
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="performance" className="h-full m-0 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-slate-500">
                        <BarChart className="h-16 w-16 mb-4" />
                        <p>Performance charts will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Goal Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Monthly Calls</span>
                            <span className="text-sm text-slate-500">{userStats?.call_count || 0}/200</span>
                          </div>
                          <Progress value={((userStats?.call_count || 0) / 200) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Win Target</span>
                            <span className="text-sm text-slate-500">{userStats?.win_count || 0}/50</span>
                          </div>
                          <Progress value={((userStats?.win_count || 0) / 50) * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="training" className="h-full m-0 p-6">
                {/* Enhanced AI Assistant Section */}
                <Card className={`overflow-hidden mb-6 ${isFullUser ? 'border-2 border-gradient-to-r from-blue-500 to-purple-600' : 'border-salesCyan-light'}`}>
                  <CardHeader className={`${isFullUser ? 'bg-gradient-to-r from-salesBlue via-purple-600 to-salesCyan' : 'bg-gradient-to-r from-salesBlue to-salesCyan'} text-white pb-2`}>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {isFullUser ? 'AI Sales Assistant Pro' : 'AI Sales Assistant'}
                      {isFullUser && <Sparkles className="h-4 w-4 ml-2" />}
                    </CardTitle>
                    <CardDescription className="text-white text-opacity-90">
                      {isFullUser ? 'Your fully personalized AI coach with advanced insights' : 'Your personalized AI coach is ready to help'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                        {isFullUser ? 'Advanced Voice Training' : 'Edit Voice & Tone'}
                      </Button>
                      <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                        {isFullUser ? 'Real-time Call Analysis' : 'Train With Your Calls'}
                      </Button>
                      <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                        {isFullUser ? 'Custom Knowledge Base' : 'Manage Knowledge Base'}
                      </Button>
                      <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                        {isFullUser ? 'AI Performance Coaching' : 'Set Goals & Targets'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Voice Training Section */}
                {showVoiceTraining && (
                  <Card className={`${isFullUser ? 'border-2 border-gradient-to-r from-green-400 to-blue-500' : 'border-salesGreen'}`}>
                    <CardHeader className={`${isFullUser ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-salesGreen bg-opacity-10'}`}>
                      <CardTitle className={`flex items-center gap-2 ${isFullUser ? 'text-white' : 'text-salesGreen'}`}>
                        <Trophy className="h-5 w-5" />
                        {isFullUser ? 'AI Voice Mastery Training' : 'Voice Style Training'}
                      </CardTitle>
                      <CardDescription className={isFullUser ? 'text-white text-opacity-90' : ''}>
                        {isFullUser ? 
                          `Your ${userStats?.current_streak || 3}+ win streak unlocked advanced voice analysis!` :
                          `You're on a ${userStats?.current_streak || 3}+ win streak! Let's analyze what's working.`
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <p className="text-slate-600">
                          Your AI assistant analyzed your most successful calls and found these winning patterns:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Tone Pattern</h4>
                              <p className="text-sm text-slate-600">
                                Confident, measured pace with strategic pauses
                              </p>
                              <Button size="sm" variant="ghost" className="mt-2 px-0">
                                <Headphones className="h-4 w-4 mr-1" /> Hear Example
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Key Phrases</h4>
                              <p className="text-sm text-slate-600">
                                "What I'm hearing is..." and "Let me show you how..."
                              </p>
                              <Button size="sm" variant="ghost" className="mt-2 px-0">
                                <Mic className="h-4 w-4 mr-1" /> Practice These
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">Closing Style</h4>
                              <p className="text-sm text-slate-600">
                                Direct ask with clear next steps and timeline
                              </p>
                              <Button size="sm" variant="ghost" className="mt-2 px-0">
                                <ArrowUpRight className="h-4 w-4 mr-1" /> Save This Style
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="pt-3">
                          <Button className="bg-salesGreen hover:bg-salesGreen-dark">
                            Start Voice Training Session
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="tools" className="h-full m-0 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PhoneCall className="h-5 w-5" />
                        Dialer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">Start making calls with AI assistance</p>
                      <Button className="w-full">Open Dialer</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Lead Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">Manage your lead pipeline</p>
                      <Button className="w-full" variant="outline">View Leads</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5" />
                        Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-4">View detailed performance analytics</p>
                      <Button className="w-full" variant="outline">View Analytics</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Sidebar - Insights & Tools */}
        <div className={`bg-white border-l transition-all duration-300 ${
          rightCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="h-full flex flex-col">
            {/* Collapse Toggle */}
            <div className="p-4 border-b flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightCollapsed(!rightCollapsed)}
              >
                {rightCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              {!rightCollapsed && (
                <h2 className="font-semibold text-lg">Insights & Tools</h2>
              )}
            </div>

            {!rightCollapsed && (
              <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Best Performance Time */}
                <Card className={isFullUser ? "border-2 border-gradient-to-r from-cyan-400 to-blue-500" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-salesCyan" />
                      {isFullUser ? 'AI-Optimized Call Times' : 'Best Performance Times'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userStats?.best_time_start && userStats?.best_time_end ? (
                      <div className="text-center">
                        <div className={`${isFullUser ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-salesBlue-light'} rounded-lg p-4 mb-3`}>
                          <p className={`text-lg font-medium ${isFullUser ? 'text-white' : 'text-salesBlue'}`}>
                            {userStats.best_time_start} - {userStats.best_time_end}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600">
                          {isFullUser ? 
                            'AI analysis shows 67% higher close rates during this window' :
                            'You close 42% more deals during this time window'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-slate-500">
                        <p>Not enough data to determine your best time yet.</p>
                        <p className="text-sm mt-2">Complete more calls to unlock this insight.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Talk It Out Feature */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="h-5 w-5 text-salesBlue" />
                      Talk It Out
                    </CardTitle>
                    <CardDescription>
                      Voice journal to process your day and learnings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {showVoiceInput ? (
                      <div className="text-center space-y-4">
                        {voiceInputActive ? (
                          <div className="relative mx-auto w-20 h-20 mb-4">
                            <div className="absolute inset-0 bg-salesCyan rounded-full opacity-25 animate-ping"></div>
                            <div className="relative flex items-center justify-center w-20 h-20 bg-salesCyan rounded-full">
                              <Mic className="h-10 w-10 text-white" />
                            </div>
                          </div>
                        ) : (
                          <Button 
                            onClick={simulateVoiceRecording}
                            className="bg-salesCyan hover:bg-salesCyan-dark w-full"
                          >
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                        )}
                        
                        <p className="text-sm text-slate-600">
                          Talk about your day, challenges, or victories. Your AI will learn from this but your recording stays private.
                        </p>
                        
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowVoiceInput(false)}
                          className="text-slate-500"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-600 mb-4">
                          Decompress after a challenging call or celebrate a win. Your voice journal helps you process emotions and trains your AI.
                        </p>
                        <Button 
                          onClick={startVoiceInput}
                          className="w-full"
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Record Voice Journal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recovery Mode or Pro Features */}
                {!isFullUser ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-salesRed" />
                        Feeling Stuck?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-slate-600 mb-4">
                        Had a rough day or hitting a wall? Recovery Mode helps rebuild momentum with targeted activities.
                      </p>
                      <Button 
                        onClick={activateRecoveryMode}
                        className="w-full bg-salesRed hover:bg-salesRed-dark"
                      >
                        Activate Recovery Mode
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        AI Insights Hub
                      </CardTitle>
                      <CardDescription className="text-white text-opacity-90">
                        Advanced analytics powered by your Pro subscription
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2">
                          <Badge className="bg-white text-purple-600">●</Badge>
                          <span>Real-time sentiment analysis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-white text-purple-600">●</Badge>
                          <span>Predictive lead scoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-white text-purple-600">●</Badge>
                          <span>Custom conversation playbooks</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-white text-purple-600">●</Badge>
                          <span>Advanced performance forecasting</span>
                        </li>
                      </ul>
                      <Button variant="secondary" className="w-full text-purple-600">
                        View Advanced Analytics
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
