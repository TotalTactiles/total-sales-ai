
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar,
  Target,
  Award,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  ChevronDown,
  Filter,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useDemoData } from '@/contexts/DemoDataContext';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { leads, activities } = useDemoData();

  const aiSummaryText = "Good morning! You have 12 high-priority leads requiring immediate attention. Your conversion rate improved by 23% this week. AI suggests focusing on Enterprise prospects between 2-4 PM for optimal engagement. Your pipeline value increased to $847K with 3 deals expected to close this week.";

  const pipelineData = [
    {
      id: "Contact 1",
      subId: "2025-06-02T12:48:00.507Z",
      status: "qualified",
      priority: "high",
      value: "$43,722",
      actions: ["phone", "email", "calendar"]
    },
    {
      id: "Contact 2", 
      subId: "2025-05-23T07:45:09.177Z",
      status: "contacted",
      priority: "medium",
      value: "$19,831",
      actions: ["phone", "email", "calendar"]
    },
    {
      id: "Contact 3",
      subId: "2025-06-10T22:48:33.250Z", 
      status: "negotiation",
      priority: "high",
      value: "$18,555",
      actions: ["phone", "email", "calendar"]
    },
    {
      id: "Contact 4",
      subId: "2025-05-29T23:18:07.855Z",
      status: "qualified", 
      priority: "high",
      value: "$19,717",
      actions: ["phone", "email", "calendar"]
    },
    {
      id: "Contact 5",
      subId: "Never",
      status: "negotiation",
      priority: "medium", 
      value: "$47,107",
      actions: ["phone", "email", "calendar"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') return '🔥';
    if (priority === 'medium') return '⚠️';
    return '🟢';
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* AI Daily Summary */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Daily Summary
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 leading-relaxed">{aiSummaryText}</p>
          <Button variant="ghost" size="sm" className="mt-3 text-white hover:bg-white/20 p-0">
            Read more <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Calls Made</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7].map((i) => (
                  <div key={i} className="w-2 h-6 bg-blue-500 rounded-sm"></div>
                ))}
              </div>
              <span className="text-sm text-green-600">↗ 8%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Deals Won</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-2 h-6 bg-green-500 rounded-sm"></div>
                ))}
              </div>
              <span className="text-sm text-green-600">↗ 23%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Win Streak</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="w-2 h-6 bg-purple-500 rounded-sm"></div>
                ))}
              </div>
              <span className="text-sm text-green-600">↗ 15%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Pulse */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pipeline Pulse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                  <span>Lead</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span>Value</span>
                  <span>Actions</span>
                </div>
                
                {pipelineData.map((lead, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 py-3 border-b border-gray-100 items-center hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{lead.id}</p>
                      <p className="text-xs text-muted-foreground">{lead.subId}</p>
                    </div>
                    <div>
                      <Badge className={getStatusColor(lead.status)} variant="secondary">
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <span className="text-lg">{getPriorityIcon(lead.priority)}</span>
                    </div>
                    <div className="font-medium">
                      {lead.value}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="p-1">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-1">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-1">
                        <Calendar className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Victory Archive */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Victory Archive
              </CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">TechCorp Inc.</p>
                    <Badge className="bg-green-100 text-green-700 text-xs">new</Badge>
                  </div>
                  <p className="font-bold text-green-600">$125,000</p>
                </div>
                <p className="text-xs text-green-600 mt-1">📅 2024-01-15</p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">Global Solutions</p>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">upsell</Badge>
                  </div>
                  <p className="font-bold text-blue-600">$85,000</p>
                </div>
                <p className="text-xs text-blue-600 mt-1">📅 2024-01-12</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant Summary */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Assistant Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Mail className="h-8 w-8 mx-auto mb-2 text-white/80" />
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-xs text-white/80">Emails Drafted</p>
                </div>
                <div>
                  <Phone className="h-8 w-8 mx-auto mb-2 text-white/80" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-white/80">Calls Scheduled</p>
                </div>
                <div>
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-white/80" />
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-white/80">Proposals Generated</p>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Performance Improvement</span>
                  <span className="text-green-300 font-bold">+34%</span>
                </div>
                <p className="text-xs text-white/70 mt-1">
                  AI optimization has increased your productivity by this amount
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
