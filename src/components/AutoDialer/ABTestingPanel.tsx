
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube2, Plus, TrendingUp, BarChart3 } from 'lucide-react';

const ABTestingPanel: React.FC = () => {
  const tests = [
    {
      id: 1,
      title: 'Pricing Objection A/B',
      script: '"Totally fair — let me show you how this gets paid back in 3 months."',
      successRate: 88,
      avgTime: '5:15',
      calls: 5,
      impact: 'high'
    },
    {
      id: 2,
      title: 'Opening Hook Test',
      script: '"Hi [Name], I know you\'re busy, this will take 30 seconds..."',
      successRate: 24,
      avgTime: '8:2s',
      calls: 8,
      impact: 'medium'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* A/B Testing */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <TestTube2 className="h-4 w-4 text-purple-600" />
              A/B Testing
            </CardTitle>
            <Button size="sm" variant="outline" className="text-xs">
              <Plus className="h-3 w-3 mr-1" />
              New Test
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tests.map(test => (
            <div key={test.id} className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{test.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">{test.calls} calls</span>
                  <Badge className={`text-xs ${getImpactColor(test.impact)}`}>
                    {test.impact}
                  </Badge>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{test.script}</p>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-blue-600">{test.successRate}%</div>
                  <div className="text-xs text-blue-600">Success</div>
                </div>
                <div>
                  <div className="text-sm font-bold">{test.avgTime}</div>
                  <div className="text-xs text-gray-600">Avg Time</div>
                </div>
              </div>
            </div>
          ))}

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Top Performer</span>
            </div>
            <p className="text-sm font-medium">Pricing Objection Response</p>
            <p className="text-xs text-green-700">"Let me show you the ROI in 30 seconds..."</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold text-green-800">42% success rate</span>
              <span className="text-xs text-green-700">Industry-wide data</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Analytics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            Call Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Connected Today</span>
            <span className="font-bold">12/18</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Conversion Rate</span>
            <span className="font-bold text-green-600">22%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">AI Assist Usage</span>
            <span className="font-bold text-blue-600">85%</span>
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs mt-3">
            <BarChart3 className="h-3 w-3 mr-1" />
            View Full Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTestingPanel;
