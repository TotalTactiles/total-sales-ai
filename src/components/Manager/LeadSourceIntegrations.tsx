
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Zap, 
  Brain, 
  Activity,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface LeadSource {
  id: string;
  name: string;
  status: 'connected' | 'syncing' | 'error';
  lastSync: Date;
  totalLeads: number;
  aiRouting: {
    leadIntelligence: boolean;
    companyBrain: boolean;
    tsamBrain: boolean;
  };
}

const LeadSourceIntegrations: React.FC = () => {
  const [leadSources, setLeadSources] = useState<LeadSource[]>([
    {
      id: '1',
      name: 'LinkedIn Sales Navigator',
      status: 'connected',
      lastSync: new Date(),
      totalLeads: 142,
      aiRouting: {
        leadIntelligence: true,
        companyBrain: true,
        tsamBrain: true
      }
    },
    {
      id: '2',
      name: 'Website Contact Form',
      status: 'syncing',
      lastSync: new Date(Date.now() - 300000),
      totalLeads: 89,
      aiRouting: {
        leadIntelligence: true,
        companyBrain: true,
        tsamBrain: true
      }
    },
    {
      id: '3',
      name: 'HubSpot CRM',
      status: 'connected',
      lastSync: new Date(Date.now() - 900000),
      totalLeads: 267,
      aiRouting: {
        leadIntelligence: true,
        companyBrain: true,
        tsamBrain: true
      }
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing':
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'bg-green-100 text-green-800',
      syncing: 'bg-yellow-100 text-yellow-800', 
      error: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Source Integrations</h2>
          <p className="text-muted-foreground">All connected sources route through AI intelligence layers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {leadSources.map((source) => (
          <Card key={source.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {source.name}
                </CardTitle>
                {getStatusIcon(source.status)}
              </div>
              {getStatusBadge(source.status)}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Leads</span>
                <span className="font-medium">{source.totalLeads}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="font-medium">
                  {source.lastSync.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">AI Routing:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Brain className="h-3 w-3 text-blue-600" />
                    <span>Lead Intelligence Command</span>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Database className="h-3 w-3 text-purple-600" />
                    <span>Company Brain</span>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Zap className="h-3 w-3 text-orange-600" />
                    <span>TSAM Master Brain</span>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Activity className="h-3 w-3 mr-1" />
                  View Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Developer OS Audit Trails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm">LinkedIn leads → AI routing successful</span>
              <span className="text-xs text-muted-foreground">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span className="text-sm">Company Brain integration updated</span>
              <span className="text-xs text-muted-foreground">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span className="text-sm">TSAM Brain processing completed</span>
              <span className="text-xs text-muted-foreground">8 min ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadSourceIntegrations;
