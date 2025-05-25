
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Users, Phone, Mail, MessageSquare, Download, Filter } from 'lucide-react';

const Reports = () => {
  const reportData = {
    totalLeads: 1247,
    conversionRate: 23.4,
    avgDealSize: 45600,
    callsMade: 2891,
    emailsSent: 5647,
    smssSent: 1203
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track performance and optimize your sales process</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalLeads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.4%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${reportData.avgDealSize.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Calls Made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{reportData.callsMade.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">This Month</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Emails Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{reportData.emailsSent.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">This Month</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{reportData.smssSent.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">This Month</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { source: 'Website', leads: 456, conversion: 28.5 },
                  { source: 'LinkedIn', leads: 234, conversion: 31.2 },
                  { source: 'Referrals', leads: 189, conversion: 45.6 },
                  { source: 'Cold Outreach', leads: 368, conversion: 15.3 }
                ].map((item) => (
                  <div key={item.source} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.source}</div>
                      <div className="text-sm text-muted-foreground">{item.leads} leads</div>
                    </div>
                    <Badge variant={item.conversion > 30 ? "default" : "secondary"}>
                      {item.conversion}% conversion
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Lead converted', time: '2 minutes ago', type: 'success' },
                  { action: 'Email campaign sent', time: '15 minutes ago', type: 'info' },
                  { action: 'Demo scheduled', time: '1 hour ago', type: 'success' },
                  { action: 'Follow-up call completed', time: '2 hours ago', type: 'info' },
                  { action: 'Proposal sent', time: '3 hours ago', type: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
