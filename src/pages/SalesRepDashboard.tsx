
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
  BarChart
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
    // Set demo data
    setAiPersona({
      id: 'demo-1',
      name: 'Alex',
      level: 3,
      tone: 'confident',
      delivery_style: 'conversational'
    });
    
    setUserStats({
      call_count: 142,
      win_count: 37,
      current_streak: 4,
      best_time_start: '14:00',
      best_time_end: '16:00',
      mood_score: 85
    });
    
    setConfidenceCache([
      {
        id: 'demo-conf-1',
        win_description: 'Handled pricing objection with value-based approach',
        objection_handled: 'Too expensive',
        date_achieved: new Date().toISOString()
      },
      {
        id: 'demo-conf-2',
        win_description: 'Converted hesitant prospect with ROI demonstration',
        objection_handled: 'Need to think about it',
        date_achieved: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'demo-conf-3',
        win_description: 'Closed deal after addressing implementation concerns',
        objection_handled: 'Integration complexity',
        date_achieved: new Date(Date.now() - 172800000).toISOString()
      }
    ]);
    
    setLoading(false);
    
    // Show pro feature messages after timeout
    setTimeout(() => {
      toast.info("Unlock advanced AI coaching with Pro Plan", {
        action: {
          label: "Upgrade",
          onClick: () => toast.success("This would navigate to pricing page in a real app")
        }
      });
    }, 10000);
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
      
      <div className="flex-1 px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-salesBlue">Sales Rep Dashboard</h1>
                <p className="text-slate-500">
                  Welcome back, {demoMode ? 'Sam' : profile?.full_name || 'Sales Rep'}! 
                  {userStats?.current_streak ? 
                    ` You're on a ${userStats.current_streak} day winning streak! 🔥` : 
                    ' Ready to make some calls?'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={toggleFocusMode}
                  className={`flex items-center gap-2 ${
                    focusMode ? 'bg-salesGreen text-white hover:bg-salesGreen-dark' : 'border-salesGreen text-salesGreen hover:bg-salesGreen-light'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
                </Button>
                
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
            </div>
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <PhoneCall className="h-8 w-8 text-salesBlue mb-2" />
                  <p className="text-sm text-muted-foreground">Total Calls</p>
                  <p className="text-3xl font-bold">{userStats?.call_count || 0}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Trophy className="h-8 w-8 text-salesGreen mb-2" />
                  <p className="text-sm text-muted-foreground">Wins</p>
                  <p className="text-3xl font-bold">{userStats?.win_count || 0}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Zap className="h-8 w-8 text-salesCyan mb-2" />
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-3xl font-bold">{userStats?.current_streak || 0}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Heart className="h-8 w-8 text-salesRed mb-2" />
                  <p className="text-sm text-muted-foreground">Energy Level</p>
                  <p className="text-3xl font-bold">{userStats?.mood_score || 70}%</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Main content area */}
              <Card className="overflow-hidden border-salesCyan-light">
                <CardHeader className="bg-gradient-to-r from-salesBlue to-salesCyan text-white pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Sales Assistant
                  </CardTitle>
                  <CardDescription className="text-white text-opacity-90">
                    Your personalized AI coach is ready to help
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-salesBlue-light rounded-full p-3">
                      <Headphones className="h-8 w-8 text-salesBlue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{aiPersona?.name || 'AI Assistant'}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Badge variant="outline" className="bg-salesBlue-light text-salesBlue">Level {aiPersona?.level || 1}</Badge>
                        <span>|</span>
                        <span className="capitalize">{aiPersona?.tone || 'Professional'} Tone</span>
                        <span>|</span>
                        <span className="capitalize">{aiPersona?.delivery_style || 'Direct'} Style</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="mb-2 text-sm text-slate-600">AI Assistant Level</p>
                      <Progress value={(aiPersona?.level || 1) * 20} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-medium mb-3">Personalize Your AI Assistant</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                          Edit Voice & Tone
                        </Button>
                        <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                          Train With Your Calls
                        </Button>
                        <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                          Manage Knowledge Base
                        </Button>
                        <Button variant="outline" className="border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                          Set Goals & Targets
                        </Button>
                      </div>
                      
                      {demoMode && (
                        <div className="mt-4 bg-amber-50 border border-amber-200 p-3 rounded-md">
                          <p className="text-amber-700 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Unlock advanced AI personalization with Pro Plan
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recovery Mode Section */}
              {recoveryMode ? (
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
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-salesGreen" />
                      Confidence Cache
                    </CardTitle>
                    <CardDescription>
                      Your recent wins and successful objection handling
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
                            <Badge className="bg-salesBlue text-white ml-2">
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
                  <CardFooter className="bg-slate-50 px-6 py-3">
                    <Button variant="ghost" className="text-salesBlue">
                      View All Wins
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Voice Style Training (shown only when streak >= 3) */}
              {showVoiceTraining && (
                <Card className="border-salesGreen">
                  <CardHeader className="bg-salesGreen bg-opacity-10">
                    <CardTitle className="flex items-center gap-2 text-salesGreen">
                      <Trophy className="h-5 w-5" />
                      Voice Style Training
                    </CardTitle>
                    <CardDescription>
                      You're on a {userStats?.current_streak || 3}+ win streak! Let's analyze what's working.
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
            </div>
            
            <div className="space-y-6">
              {/* Sidebar content */}
              
              {/* Best Performance Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-salesCyan" />
                    Best Performance Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userStats?.best_time_start && userStats?.best_time_end ? (
                    <div className="text-center">
                      <div className="bg-salesBlue-light rounded-lg p-4 mb-3">
                        <p className="text-lg font-medium text-salesBlue">
                          {userStats.best_time_start} - {userStats.best_time_end}
                        </p>
                      </div>
                      <p className="text-sm text-slate-600">
                        You close 42% more deals during this time window
                      </p>
                      <Button variant="outline" className="mt-4 w-full border-salesCyan text-salesCyan hover:bg-salesCyan-light">
                        Schedule Calls During Peak Hours
                      </Button>
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
              
              {/* Recovery Mode Card (only shown when not in recovery mode) */}
              {!recoveryMode && (
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
              )}
              
              {/* Demo mode upsell if in demo */}
              {demoMode && (
                <Card className="bg-gradient-to-br from-salesBlue to-salesCyan text-white">
                  <CardHeader>
                    <CardTitle>Unlock Full Platform</CardTitle>
                    <CardDescription className="text-white text-opacity-90">
                      See how companies boost revenue by 27%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2">
                        <Badge className="bg-white text-salesBlue">✓</Badge>
                        <span>AI-powered call coaching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-white text-salesBlue">✓</Badge>
                        <span>Advanced performance analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-white text-salesBlue">✓</Badge>
                        <span>Smart lead management</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge className="bg-white text-salesBlue">✓</Badge>
                        <span>Custom sales brain training</span>
                      </li>
                    </ul>
                    <Button variant="secondary" className="w-full text-salesBlue">
                      Get Started Free
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRepDashboard;
