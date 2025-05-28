
import React, { useState } from 'react';
import { Phone, PhoneCall, Users, Clock, Play, Pause, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMockData } from '@/hooks/useMockData';
import { useAuth } from '@/contexts/AuthContext';
import { useLeads } from '@/hooks/useLeads';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const SalesDialer = () => {
  const { leads } = useLeads();
  const { leads: mockLeads } = useMockData();
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [isDialing, setIsDialing] = useState(false);
  const [currentLead, setCurrentLead] = useState(0);

  const hasRealData = leads && leads.length > 0;
  const shouldShowMockData = isDemoMode() || showDemo || !hasRealData;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Experience the AI-powered dialer with mock data.');
  };

  const handleStartDialing = () => {
    setIsDialing(true);
    toast.success('Auto dialer started with AI optimization');
  };

  const handlePauseDialing = () => {
    setIsDialing(false);
    toast.info('Auto dialer paused');
  };

  // Mock dialer stats
  const mockStats = {
    callsToday: 47,
    connectRate: 68,
    avgCallTime: '4:32',
    queueSize: mockLeads.length,
    answered: 32,
    voicemail: 12,
    busy: 3,
    conversion: 15
  };

  // Mock call queue with high-priority leads
  const callQueue = mockLeads.slice(0, 5).map((lead, index) => ({
    ...lead,
    position: index + 1,
    estimatedCallTime: '2:30 PM',
    aiScore: Math.floor(Math.random() * 40) + 60
  }));

  // Show workspace showcase if no data and demo not started
  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="AI Dialer" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Demo Mode Indicator */}
      {shouldShowMockData && (
        <DemoModeIndicator workspace="AI-Powered Auto Dialer" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Auto Dialer</h1>
          <p className="text-muted-foreground mt-2">
            Streamline your calling process with AI-powered automation and optimization
          </p>
        </div>
        <div className="flex gap-2">
          {!isDialing ? (
            <Button onClick={handleStartDialing} size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Campaign
            </Button>
          ) : (
            <Button onClick={handlePauseDialing} variant="outline" size="lg">
              <Pause className="h-4 w-4 mr-2" />
              Pause Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.callsToday}</div>
            <p className="text-xs text-muted-foreground">
              +12 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connect Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.connectRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Call Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgCallTime}</div>
            <p className="text-xs text-muted-foreground">
              Minutes per call
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.queueSize}</div>
            <p className="text-xs text-muted-foreground">
              Leads waiting
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dialer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Progress & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Dialer Controls
                {isDialing && <Badge variant="default" className="bg-green-600">ACTIVE</Badge>}
              </CardTitle>
              <CardDescription>
                AI-optimized calling sequence with real-time analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Call Status */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Current Campaign Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {currentLead + 1} of {mockStats.queueSize}
                  </span>
                </div>
                <Progress value={(currentLead / mockStats.queueSize) * 100} className="mb-4" />
                
                {isDialing && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{callQueue[currentLead]?.name}</h4>
                    <p className="text-sm text-muted-foreground">{callQueue[currentLead]?.company}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">AI Score: {callQueue[currentLead]?.aiScore}%</Badge>
                      <span className="text-sm">Est. Call Time: {callQueue[currentLead]?.estimatedCallTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Outcome Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mockStats.answered}</div>
                  <div className="text-xs text-green-700">Answered</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{mockStats.voicemail}</div>
                  <div className="text-xs text-yellow-700">Voicemail</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{mockStats.busy}</div>
                  <div className="text-xs text-red-700">Busy/No Answer</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mockStats.conversion}</div>
                  <div className="text-xs text-blue-700">Conversions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Campaign Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    🎯 Optimal Call Window Detected
                  </p>
                  <p className="text-xs text-blue-700">
                    Current time (2:30 PM) shows 23% higher connect rates for Enterprise leads
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">
                    📈 Performance Above Average
                  </p>
                  <p className="text-xs text-green-700">
                    Your connect rate is 15% higher than team average today
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">
                    🤖 AI Recommendation
                  </p>
                  <p className="text-xs text-yellow-700">
                    Focus on Technology sector leads - showing 34% higher conversion potential
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Queue & History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Queue</CardTitle>
              <CardDescription>
                AI-prioritized calling sequence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callQueue.map((lead, index) => (
                  <div 
                    key={lead.id}
                    className={`p-3 rounded-lg border ${
                      index === currentLead && isDialing 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{lead.name}</span>
                      <Badge variant="outline" className="text-xs">
                        #{lead.position}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{lead.company}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge 
                        variant={lead.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {lead.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        AI: {lead.aiScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>
                Today's calling activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">2:15 PM • 4:30</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <div>
                    <p className="text-sm font-medium">Michael Rodriguez</p>
                    <p className="text-xs text-muted-foreground">2:10 PM • 0:45</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                    Voicemail
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <div>
                    <p className="text-sm font-medium">David Thompson</p>
                    <p className="text-xs text-muted-foreground">2:05 PM • 0:20</p>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    No Answer
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesDialer;
