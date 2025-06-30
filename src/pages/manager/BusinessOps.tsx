
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Brain,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

const BusinessOps = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [aiAnalyticsActive, setAiAnalyticsActive] = useState(true);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Operations</h1>
          <p className="text-muted-foreground">Real-time team performance & revenue intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant="outline" 
            className={`${aiAnalyticsActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600'}`}
            onClick={() => setAiAnalyticsActive(!aiAnalyticsActive)}
          >
            <Brain className="h-3 w-3 mr-1" />
            AI Analytics {aiAnalyticsActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Business Operations Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales-reps">Sales Reps</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Business Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly ARR</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-green-600">
                  +18% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CAC</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,240</div>
                <p className="text-xs text-green-600">
                  -8% improvement
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">LTV</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$18,500</div>
                <p className="text-xs text-muted-foreground">
                  LTV:CAC ratio 14.9:1
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.3%</div>
                <p className="text-xs text-green-600">
                  +3.1% from last period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Interpretation Blocks */}
          {aiAnalyticsActive && (
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  AI Data Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Strong Performance Indicator</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Your team's LTV:CAC ratio of 14.9:1 exceeds industry standards (3:1), indicating highly efficient customer acquisition and strong unit economics.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Optimization Opportunity</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Email campaigns show 34% higher conversion than cold calls. Consider reallocating 20% of calling time to email sequences for improved ROI.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Attention Required</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Deal velocity has decreased by 12% this quarter. AI recommends implementing automated follow-up sequences and proposal templates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Forecast Toggle Section */}
          <Card className="rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Forecast & Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$3.1M</div>
                  <p className="text-sm text-blue-800">Projected ARR Next Month</p>
                  <p className="text-xs text-blue-600">Based on current velocity</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">18 days</div>
                  <p className="text-sm text-green-800">Avg Deal Velocity</p>
                  <p className="text-xs text-green-600">Qualified to close</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$45K</div>
                  <p className="text-sm text-purple-800">Avg Deal Size</p>
                  <p className="text-xs text-purple-600">This quarter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales-reps" className="space-y-6">
          <Card className="rounded-lg shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Individual Rep Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Chen', deals: 12, value: '$145K', conversion: '28%', status: 'exceeding', calls: 89, training: 92 },
                  { name: 'Mike Johnson', deals: 8, value: '$98K', conversion: '22%', status: 'on-track', calls: 67, training: 78 },
                  { name: 'Emma Davis', deals: 6, value: '$67K', conversion: '18%', status: 'needs-support', calls: 45, training: 56 },
                  { name: 'James Wilson', deals: 10, value: '$123K', conversion: '25%', status: 'on-track', calls: 78, training: 84 }
                ].map((rep, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{rep.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{rep.name}</h4>
                        <p className="text-sm text-muted-foreground">{rep.deals} deals • {rep.value} pipeline • {rep.calls} calls</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{rep.conversion} conversion</span>
                      <span className="text-sm text-muted-foreground">{rep.training}% training</span>
                      <Badge variant={
                        rep.status === 'exceeding' ? 'default' :
                        rep.status === 'on-track' ? 'secondary' :
                        'destructive'
                      }>
                        {rep.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          <Card className="rounded-lg shadow-md">
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 text-center">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,240</div>
                    <p className="text-sm text-muted-foreground">Leads</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-lg text-gray-400">→</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">186</div>
                    <p className="text-sm text-muted-foreground">Qualified</p>
                    <p className="text-xs text-green-600">15% conversion</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-lg text-gray-400">→</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">45</div>
                    <p className="text-sm text-muted-foreground">Closed</p>
                    <p className="text-xs text-green-600">24% close rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle>Customer Retention Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Churn Rate</span>
                    <Badge variant="secondary">2.3%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Annual Retention</span>
                    <Badge variant="default">94.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Expansion Revenue</span>
                    <Badge variant="secondary">$340K</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upsell Rate</span>
                    <Badge variant="default">28%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-md">
              <CardHeader>
                <CardTitle>Revenue Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800">Expansion Opportunities (12 accounts)</h4>
                    <p className="text-sm text-green-700">High usage, feature requests, growth indicators</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Medium Risk (7 accounts)</h4>
                    <p className="text-sm text-yellow-700">Reduced engagement, missed check-ins</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800">High Risk (3 accounts)</h4>
                    <p className="text-sm text-red-700">Decreased usage, support tickets, payment delays</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessOps;
