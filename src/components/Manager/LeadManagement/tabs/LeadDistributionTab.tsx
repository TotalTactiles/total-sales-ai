
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeadDistributionTabProps {
  mockLeads: any[];
}

const LeadDistributionTab = ({ mockLeads }: LeadDistributionTabProps) => {
  const mockTeamData = [
    { rep: 'Sarah Johnson', total: 45, qualified: 23, closed: 8, conversion: 34.2 },
    { rep: 'Michael Chen', total: 38, qualified: 19, closed: 6, conversion: 28.1 },
    { rep: 'Jennifer Park', total: 42, qualified: 21, closed: 7, conversion: 25.8 },
    { rep: 'David Rodriguez', total: 29, qualified: 12, closed: 3, conversion: 22.3 }
  ];

  return (
    <>
      {/* Rep Distribution Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Lead Distribution</CardTitle>
          <CardDescription>Lead assignment and performance by sales representative</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTeamData.map((rep, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {rep.rep.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold">{rep.rep}</h4>
                    <p className="text-sm text-muted-foreground">Sales Representative</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-lg font-bold">{rep.total}</div>
                    <div className="text-xs text-muted-foreground">Total Leads</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{rep.qualified}</div>
                    <div className="text-xs text-muted-foreground">Qualified</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{rep.closed}</div>
                    <div className="text-xs text-muted-foreground">Closed</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">{rep.conversion}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  Manage Leads
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent High-Priority Leads</CardTitle>
          <CardDescription>Latest leads requiring manager attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLeads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{lead.name}</h4>
                  <p className="text-sm text-muted-foreground">{lead.company} • {lead.position}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={lead.priority === 'high' ? 'destructive' : 'secondary'}>
                      {lead.priority}
                    </Badge>
                    <Badge variant="outline">{lead.source}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{lead.score}</div>
                  <div className="text-xs text-muted-foreground">Lead Score</div>
                  <div className="text-xs text-green-600 mt-1">
                    {lead.conversion_likelihood}% conversion
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reassign
                  </Button>
                  <Button size="sm">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LeadDistributionTab;
