
import React from 'react';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SourceAnalysisTab = () => {
  const mockSources = [
    { source: 'LinkedIn Outreach', count: 67, quality: 85, cost: 45 },
    { source: 'Website Forms', count: 34, quality: 72, cost: 23 },
    { source: 'Referrals', count: 28, quality: 92, cost: 12 },
    { source: 'Trade Shows', count: 25, quality: 78, cost: 156 }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lead Source Performance</CardTitle>
          <CardDescription>Analysis of lead generation channels and their effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSources.map((source, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{source.source}</h4>
                  <p className="text-sm text-muted-foreground">Lead Source</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{source.count}</div>
                  <div className="text-xs text-muted-foreground">Leads Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{source.quality}%</div>
                  <div className="text-xs text-muted-foreground">Quality Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">${source.cost}</div>
                  <div className="text-xs text-muted-foreground">Cost per Lead</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Source ROI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">🎯 Best Performer</h4>
                <p className="text-green-700 text-sm">Referrals: 92% quality at $12/lead</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">📈 High Volume</h4>
                <p className="text-blue-700 text-sm">LinkedIn: 67 leads with 85% quality</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900">⚡ Needs Optimization</h4>
                <p className="text-yellow-700 text-sm">Trade Shows: High cost at $156/lead</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Increase referral program budget
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Optimize LinkedIn campaigns
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Review trade show ROI
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SourceAnalysisTab;
