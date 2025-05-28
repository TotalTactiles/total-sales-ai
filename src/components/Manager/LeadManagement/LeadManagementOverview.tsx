
import React from 'react';
import { Users, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LeadManagementOverview = () => {
  const mockLeadQuality = {
    highQuality: 42,
    mediumQuality: 89,
    lowQuality: 23,
    needsAttention: 15,
    averageScore: 73.5
  };

  const totalLeads = mockLeadQuality.highQuality + mockLeadQuality.mediumQuality + mockLeadQuality.lowQuality;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLeads}</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Lead Score</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockLeadQuality.averageScore}</div>
          <p className="text-xs text-muted-foreground">+5.2 points vs last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">High Quality</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockLeadQuality.highQuality}</div>
          <p className="text-xs text-muted-foreground">Score 80+ leads</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{mockLeadQuality.needsAttention}</div>
          <p className="text-xs text-muted-foreground">Require immediate action</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadManagementOverview;
