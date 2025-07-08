
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Phone, 
  Users,
  DollarSign,
  Calendar,
  Brain,
  Zap
} from 'lucide-react';
import SalesRepNavigation from '@/components/Navigation/SalesRepNavigation';
import PipelinePulse from '@/components/Dashboard/PipelinePulse';
import PerformanceOverview from '@/components/Dashboard/PerformanceOverview';

const SalesDashboard = () => {
  const upcomingTasks = [
    { id: 1, task: 'Call Sarah Chen at TechCorp', time: '10:00 AM', priority: 'high' },
    { id: 2, task: 'Demo for Mike Rodriguez', time: '2:00 PM', priority: 'high' },
    { id: 3, task: 'Follow up with Lisa Wang', time: '4:00 PM', priority: 'medium' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SalesRepNavigation />
      
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800 px-3 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              AI Active
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Performance Overview */}
          <div className="xl:col-span-2 space-y-6">
            {/* Performance Overview with Persistent Customization */}
            <PerformanceOverview />
            
            {/* Pipeline Pulse with New Columns */}
            <PipelinePulse />
          </div>

          {/* Right Column - Tasks and AI Recommendations */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                    <Badge className={task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                <Button className="w-full mt-4" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Tasks
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">High Priority</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Sarah Chen hasn't responded in 4 days. 89% chance she'll respond to a value-focused follow-up.
                  </p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Send AI Email
                  </Button>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Opportunity</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Mike Rodriguez opened your proposal twice. Perfect time for a follow-up call.
                  </p>
                  <Button size="sm" variant="outline">
                    Schedule Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Voice Assistant Tip */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Voice Assistant Active</span>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Say "Hey TSAM" anytime to get AI assistance, update leads, or get insights about your pipeline.
                </p>
                <div className="text-xs text-green-600 space-y-1">
                  <div>• "Hey TSAM, what's my top priority today?"</div>
                  <div>• "Hey TSAM, summarize my pipeline"</div>
                  <div>• "Hey TSAM, call Sarah Chen"</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
