
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Play, 
  Pause, 
  SkipForward,
  Clock,
  Users,
  Target,
  TrendingUp,
  Mic,
  MicOff,
  Volume2,
  Settings
} from 'lucide-react';
import { useDemoData } from '@/contexts/DemoDataContext';

const SalesDialer = () => {
  const { leads } = useDemoData();
  const [isDialing, setIsDialing] = useState(false);
  const [currentCallIndex, setCurrentCallIndex] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const callQueue = leads.slice(0, 8).map((lead, index) => ({
    id: lead.id,
    name: lead.name,
    company: lead.company,
    phone: lead.phone,
    priority: lead.priority,
    lastContact: lead.lastContact,
    status: index === currentCallIndex ? 'current' : index < currentCallIndex ? 'completed' : 'pending'
  }));

  const dailyStats = {
    callsMade: 23,
    callsAnswered: 15,
    meetingsBooked: 4,
    connectRate: 65,
    targetCalls: 50,
    timeSpent: 145 // minutes
  };

  const handleStartDialing = () => {
    setIsDialing(true);
    setCallDuration(0);
  };

  const handleEndCall = () => {
    setIsDialing(false);
    setCurrentCallIndex(prev => prev + 1);
  };

  const handleSkipCall = () => {
    setCurrentCallIndex(prev => prev + 1);
  };

  const currentLead = callQueue[currentCallIndex];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Smart Dialer</h1>
          <p className="text-muted-foreground">AI-optimized calling sequence</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-500 text-white">
            Queue: {callQueue.filter(c => c.status === 'pending').length} leads
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calls Made</p>
                <p className="text-2xl font-bold">{dailyStats.callsMade}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Answered</p>
                <p className="text-2xl font-bold">{dailyStats.callsAnswered}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Meetings</p>
                <p className="text-2xl font-bold">{dailyStats.meetingsBooked}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connect Rate</p>
                <p className="text-2xl font-bold">{dailyStats.connectRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                <p className="text-2xl font-bold">{Math.floor(dailyStats.timeSpent / 60)}h {dailyStats.timeSpent % 60}m</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Controls */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5" />
                Current Call
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentLead ? (
                <>
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-12 w-12 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{currentLead.name}</h3>
                      <p className="text-lg text-muted-foreground">{currentLead.company}</p>
                      <p className="text-muted-foreground">{currentLead.phone}</p>
                    </div>
                    
                    {isDialing && (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">Call Duration: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}</p>
                        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <PhoneCall className="h-16 w-16 text-green-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center gap-4">
                    {!isDialing ? (
                      <Button 
                        onClick={handleStartDialing}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                      >
                        <PhoneCall className="h-6 w-6 mr-2" />
                        Start Call
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => setIsMuted(!isMuted)}
                          className="px-4 py-4"
                        >
                          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                        </Button>
                        
                        <Button 
                          onClick={handleEndCall}
                          className="bg-red-600 hover:bg-red-700 text-white px-8 py-4"
                        >
                          <PhoneOff className="h-6 w-6 mr-2" />
                          End Call
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="px-4 py-4"
                        >
                          <Volume2 className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="outline"
                      onClick={handleSkipCall}
                      className="px-4 py-4"
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Call Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Call Notes</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg resize-none" 
                      rows={4}
                      placeholder="Take notes during the call..."
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">Schedule Follow-up</Button>
                    <Button variant="outline">Send Email</Button>
                    <Button variant="outline">Book Meeting</Button>
                    <Button variant="outline">Mark as Interested</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <PhoneOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Call Queue Complete</h3>
                  <p className="text-muted-foreground">Great job! You've completed all calls in your queue.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Call Queue
            </CardTitle>
            <CardDescription>
              {callQueue.filter(c => c.status === 'pending').length} leads remaining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {callQueue.map((lead, index) => (
                <div 
                  key={lead.id}
                  className={`p-3 rounded-lg border ${
                    lead.status === 'current' ? 'bg-blue-50 border-blue-200' :
                    lead.status === 'completed' ? 'bg-green-50 border-green-200' :
                    'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{lead.name}</h4>
                      <p className="text-xs text-muted-foreground">{lead.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          lead.priority === 'high' ? 'border-red-200 text-red-600' :
                          lead.priority === 'medium' ? 'border-yellow-200 text-yellow-600' :
                          'border-green-200 text-green-600'
                        }`}
                      >
                        {lead.priority}
                      </Badge>
                      {lead.status === 'current' && (
                        <PhoneCall className="h-4 w-4 text-blue-500" />
                      )}
                      {lead.status === 'completed' && (
                        <Badge className="bg-green-500 text-white text-xs">Done</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Daily Progress
          </CardTitle>
          <CardDescription>Track your calling goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Calls Made</span>
              <span className="text-sm text-muted-foreground">{dailyStats.callsMade}/{dailyStats.targetCalls}</span>
            </div>
            <Progress value={(dailyStats.callsMade / dailyStats.targetCalls) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round((dailyStats.callsMade / dailyStats.targetCalls) * 100)}% of daily target completed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDialer;
