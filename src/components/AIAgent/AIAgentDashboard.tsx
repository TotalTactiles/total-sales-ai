
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PhoneCall, Clock, Calendar, UserCheck, AlertTriangle, Headphones, ChevronRight, XCircle, CheckCircle } from 'lucide-react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AIAgentDashboard = () => {
  const { toast } = useToast();
  
  // Sample data for today's stats
  const todayStats = {
    callsMade: 42,
    connected: 18,
    meetingsBooked: 3,
    infoGathered: 7,
    callsInQueue: 24,
  };
  
  // Sample data for performance chart
  const performanceData = [
    { name: 'Mon', connected: 15, noAnswer: 10, rejected: 5 },
    { name: 'Tue', connected: 20, noAnswer: 8, rejected: 7 },
    { name: 'Wed', connected: 18, noAnswer: 12, rejected: 4 },
    { name: 'Thu', connected: 22, noAnswer: 9, rejected: 6 },
    { name: 'Fri', connected: 25, noAnswer: 11, rejected: 3 },
  ];
  
  // Sample data for outcome distribution
  const outcomeData = [
    { name: 'Connected', value: 42, color: '#3498db' },
    { name: 'No Answer', value: 28, color: '#e74c3c' },
    { name: 'Meeting Booked', value: 12, color: '#2ecc71' },
    { name: 'Info Gathered', value: 18, color: '#f39c12' },
  ];
  
  // Sample data for top objections
  const topObjections = [
    { objection: "Not the right time", count: 12, percentage: 28 },
    { objection: "Already using competitor", count: 9, percentage: 21 },
    { objection: "No budget currently", count: 7, percentage: 16 },
    { objection: "Need to speak with team", count: 5, percentage: 12 },
  ];

  const handleAgentStatusToggle = (status: string) => {
    toast({
      title: "AI Agent Status Changed",
      description: `AI calling agent is now ${status.toLowerCase()}.`,
    });
  };

  const handleListenToCall = () => {
    toast({
      title: "Sample Call Playing",
      description: "Now playing a sample of the AI agent's voice and conversation style.",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* AI Agent Status Card */}
      <Card className="border-l-4 border-l-salesCyan">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Headphones className="h-5 w-5 mr-2 text-salesCyan" />
            AI Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-3xl font-bold text-salesBlue">Active</p>
              <p className="text-sm text-slate-500">Last call: 14 minutes ago</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm" onClick={() => handleListenToCall()}>
                <Headphones className="h-4 w-4 mr-2" />
                Listen to Sample Call
              </Button>
              <Button 
                variant="outline" 
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
                size="sm"
                onClick={() => handleAgentStatusToggle("Paused")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Pause Agent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Today's Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Calls Made Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PhoneCall className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{todayStats.callsMade}</p>
                <p className="text-xs text-green-600">+12% vs. yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Connected Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{Math.round((todayStats.connected / todayStats.callsMade) * 100)}%</p>
                <p className="text-xs text-slate-500">{todayStats.connected} of {todayStats.callsMade} calls</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Meetings Booked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{todayStats.meetingsBooked}</p>
                <p className="text-xs text-green-600">+1 vs. yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Info Gathered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-salesBlue mr-3" />
              <div>
                <p className="text-2xl font-bold">{todayStats.infoGathered}</p>
                <p className="text-xs text-green-600">+3 vs. yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Call Performance</CardTitle>
            <CardDescription>Call outcomes over the past 5 business days</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="connected" stackId="a" name="Connected" fill="#3498db" />
                <Bar dataKey="noAnswer" stackId="a" name="No Answer" fill="#e74c3c" />
                <Bar dataKey="rejected" stackId="a" name="Rejected" fill="#f39c12" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Outcome Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Call Outcome Distribution</CardTitle>
            <CardDescription>Percentage breakdown of call results</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Objections Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Objections Encountered</CardTitle>
          <CardDescription>Common objections the AI agent is working to overcome</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topObjections.map((objection, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{objection.objection}</span>
                  <span className="text-sm text-slate-500">{objection.count} instances ({objection.percentage}%)</span>
                </div>
                <Progress value={objection.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="px-0 text-salesBlue">
            View Full Objection Library <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Agent Improvements Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            Recent AI Agent Improvements
          </CardTitle>
          <CardDescription>Automatic adjustments made in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Improved gatekeeper handling</p>
                <p className="text-sm text-slate-500">Added 3 new patterns for navigating receptionists based on 7 successful calls</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Voice tone adjustment</p>
                <p className="text-sm text-slate-500">Slightly increased warmth and reduced pace based on feedback analysis</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">New objection rebuttal</p>
                <p className="text-sm text-slate-500">Added response for "We're already using [competitor]" based on top performer scripts</p>
              </div>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="px-0 text-salesBlue">
            View All Improvements <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIAgentDashboard;
