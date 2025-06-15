
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Phone, 
  Users,
  TrendingUp,
  BarChart3,
  Clock,
  Mic,
  MicOff,
  Pause,
  Volume2,
  PlayCircle,
  Settings
} from 'lucide-react';

const SalesAI = () => {
  const [isActive, setIsActive] = useState(true);

  const aiStats = {
    callsMadeToday: 42,
    connectRate: 43,
    meetingsBooked: 3,
    infoGathered: 7
  };

  const weeklyPerformance = [
    { day: 'Mon', connected: 15, noAnswer: 10, rejected: 5 },
    { day: 'Tue', connected: 20, noAnswer: 10, rejected: 5 },
    { day: 'Wed', connected: 20, noAnswer: 15, rejected: 3 },
    { day: 'Thu', connected: 25, noAnswer: 12, rejected: 3 },
    { day: 'Fri', connected: 25, noAnswer: 13, rejected: 2 }
  ];

  const callOutcomes = {
    connected: 42,
    noAnswer: 28,
    meetingBooked: 12,
    infoGathered: 18
  };

  const topObjections = [
    {
      objection: "Not the right time",
      instances: 12,
      percentage: 28
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Calling Agent</h1>
            <p className="text-muted-foreground">Autonomous AI agent for lead outreach, qualification & conversion</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {['Dashboard', 'Automation', 'Queue', 'History', 'Voice', 'Learning', 'Training'].map((tab, index) => (
          <Button
            key={tab}
            variant={index === 0 ? "default" : "ghost"}
            size="sm"
            className={index === 0 ? "bg-blue-600 text-white" : ""}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* AI Agent Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">AI Agent Status</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-2xl font-bold text-green-600">Active</span>
                <span className="text-muted-foreground">Last Call: 14 minutes ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                Listen to Sample Call
              </Button>
              <Button variant="destructive">
                <Pause className="h-4 w-4 mr-2" />
                Pause Agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Calls Made Today</p>
                <p className="text-3xl font-bold text-blue-600">{aiStats.callsMadeToday}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-green-600">+12% vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Connected Rate</p>
                <p className="text-3xl font-bold text-green-600">{aiStats.connectRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">18 of 42 calls</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Meetings Booked</p>
                <p className="text-3xl font-bold text-purple-600">{aiStats.meetingsBooked}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-green-600">+1 vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Info Gathered</p>
                <p className="text-3xl font-bold text-orange-600">{aiStats.infoGathered}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-green-600">+2 vs yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Call Performance</CardTitle>
            <CardDescription>Call outcomes over the past 5 business days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyPerformance.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-12 text-sm font-medium">{day.day}</span>
                  <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-blue-500"
                      style={{ width: `${(day.connected / 40) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute top-0 h-full bg-red-400"
                      style={{ 
                        left: `${(day.connected / 40) * 100}%`,
                        width: `${(day.noAnswer / 40) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="absolute top-0 h-full bg-orange-400"
                      style={{ 
                        left: `${((day.connected + day.noAnswer) / 40) * 100}%`,
                        width: `${(day.rejected / 40) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{day.connected + day.noAnswer + day.rejected}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>No Answer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>Rejected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Outcome Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Call Outcome Distribution</CardTitle>
            <CardDescription>Percentage breakdown of call results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="16"
                    strokeDasharray={`${(callOutcomes.connected / 100) * 502} 502`}
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="16"
                    strokeDasharray={`${(callOutcomes.noAnswer / 100) * 502} 502`}
                    strokeDashoffset={`-${(callOutcomes.connected / 100) * 502}`}
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="16"
                    strokeDasharray={`${(callOutcomes.meetingBooked / 100) * 502} 502`}
                    strokeDashoffset={`-${((callOutcomes.connected + callOutcomes.noAnswer) / 100) * 502}`}
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeDasharray={`${(callOutcomes.infoGathered / 100) * 502} 502`}
                    strokeDashoffset={`-${((callOutcomes.connected + callOutcomes.noAnswer + callOutcomes.meetingBooked) / 100) * 502}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">Connected: 42%</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Connected</span>
                  <span className="ml-auto font-medium">{callOutcomes.connected}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>No Answer</span>
                  <span className="ml-auto font-medium">{callOutcomes.noAnswer}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Meeting Booked</span>
                  <span className="ml-auto font-medium">{callOutcomes.meetingBooked}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Info Gathered</span>
                  <span className="ml-auto font-medium">{callOutcomes.infoGathered}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Objections */}
      <Card>
        <CardHeader>
          <CardTitle>Top Objections Encountered</CardTitle>
          <CardDescription>Common objections the AI agent is working to overcome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topObjections.map((objection, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{objection.objection}</h4>
                  <p className="text-sm text-muted-foreground">{objection.instances} instances ({objection.percentage}%)</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesAI;
