
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Activity,
  Filter
} from 'lucide-react';

const SalesProcessPerformanceMapping: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('30days');

  const stagePerformance = [
    {
      stage: 'Lead Generation',
      conversion: 72,
      avgTime: '2.3 days',
      volume: 1240,
      topPerformer: 'Sarah Johnson',
      bottleneck: false
    },
    {
      stage: 'Qualification',
      conversion: 45,
      avgTime: '4.7 days',
      volume: 892,
      topPerformer: 'Michael Chen',
      bottleneck: true
    },
    {
      stage: 'Proposal',
      conversion: 68,
      avgTime: '6.2 days',
      volume: 401,
      topPerformer: 'Emily Rodriguez',
      bottleneck: false
    },
    {
      stage: 'Negotiation',
      conversion: 78,
      avgTime: '8.1 days',
      volume: 273,
      topPerformer: 'David Kim',
      bottleneck: false
    },
    {
      stage: 'Closed Won',
      conversion: 89,
      avgTime: '1.2 days',
      volume: 213,
      topPerformer: 'Sarah Johnson',
      bottleneck: false
    }
  ];

  const teamMetrics = [
    { name: 'Sarah Johnson', stages: ['Lead Generation', 'Closed Won'], score: 94 },
    { name: 'Michael Chen', stages: ['Qualification'], score: 87 },
    { name: 'Emily Rodriguez', stages: ['Proposal'], score: 91 },
    { name: 'David Kim', stages: ['Negotiation'], score: 88 }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="team-a">Team A</SelectItem>
              <SelectItem value="team-b">Team B</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 Days</SelectItem>
            <SelectItem value="30days">30 Days</SelectItem>
            <SelectItem value="90days">90 Days</SelectItem>
            <SelectItem value="1year">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Overlay Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
              <div>
                <p className="text-sm font-medium text-blue-900">Bottleneck Detected</p>
                <p className="text-xs text-blue-700">Qualification stage showing 23% slower conversion. Consider additional training for qualification criteria.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="text-sm font-medium text-blue-900">Optimization Opportunity</p>
                <p className="text-xs text-blue-700">Sarah Johnson's lead generation techniques could be shared with team to improve overall conversion by ~15%.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Performance Mapping */}
      <div className="grid gap-4">
        {stagePerformance.map((stage, index) => (
          <Card key={index} className={`${stage.bottleneck ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                  {stage.bottleneck && (
                    <Badge variant="destructive" className="mt-1 text-xs">
                      Bottleneck
                    </Badge>
                  )}
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-lg">{stage.conversion}%</span>
                  </div>
                  <p className="text-xs text-gray-600">Conversion</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-lg">{stage.avgTime}</span>
                  </div>
                  <p className="text-xs text-gray-600">Avg Time</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <span className="font-bold text-lg">{stage.volume.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-600">Volume</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Target className="h-4 w-4 text-indigo-600" />
                    <span className="font-semibold text-sm">{stage.topPerformer}</span>
                  </div>
                  <p className="text-xs text-gray-600">Top Performer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Stage Specialization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMetrics.map((member, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{member.name}</h5>
                  <Badge variant="secondary">{member.score}% Score</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {member.stages.map((stage, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {stage}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesProcessPerformanceMapping;
