
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  User, 
  Calendar, 
  AlertTriangle, 
  Bell,
  Eye,
  MessageSquare,
  Phone,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const TeamOverviewActions: React.FC = () => {
  const [selectedRep, setSelectedRep] = useState<string | null>(null);

  const teamReps = [
    {
      id: 'rep-001',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      performance: 145,
      calls: 45,
      wins: 12,
      revenue: '$25K',
      coachingAlerts: 2,
      lastActivity: '2 hours ago',
      status: 'Active',
      email: 'sarah.johnson@company.com',
      phone: '+1-555-0123'
    },
    {
      id: 'rep-002',
      name: 'Michael Chen',
      avatar: 'MC',
      performance: 75,
      calls: 32,
      wins: 6,
      revenue: '$18K',
      coachingAlerts: 5,
      lastActivity: '30 min ago',
      status: 'Needs Support',
      email: 'michael.chen@company.com',
      phone: '+1-555-0456'
    },
    {
      id: 'rep-003',
      name: 'Emma Rodriguez',
      avatar: 'ER',
      performance: 120,
      calls: 38,
      wins: 9,
      revenue: '$22K',
      coachingAlerts: 1,
      lastActivity: '1 hour ago',
      status: 'Good',
      email: 'emma.rodriguez@company.com',
      phone: '+1-555-0789'
    }
  ];

  const handleExportPDF = () => {
    toast.success('Exporting Team Overview PDF with data and charts');
  };

  const handleRepProfileClick = (rep: any) => {
    setSelectedRep(rep.id);
    toast.success(`Opening ${rep.name} profile - matches Lead Profile layout`);
  };

  const handleCoachingAlert = (rep: any) => {
    toast.success(`Coaching alert for ${rep.name} - integrated with calendar and EM tracking`);
  };

  const handleScheduleCoaching = (rep: any) => {
    toast.success(`Calendar integration: Scheduling coaching session with ${rep.name}`);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 120) return 'bg-green-100 text-green-800';
    if (performance >= 90) return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Needs Support': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Team Overview</h2>
        <Button onClick={handleExportPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Reps</p>
                <p className="text-2xl font-bold">{teamReps.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Avg Performance</p>
                <p className="text-2xl font-bold">113%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Coaching Alerts</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{teamReps.filter(r => r.status === 'Active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rep Profiles - Fully Clickable */}
      <div className="grid gap-4">
        {teamReps.map((rep) => (
          <Card 
            key={rep.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleRepProfileClick(rep)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {rep.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{rep.name}</h3>
                    <p className="text-sm text-gray-600">{rep.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPerformanceColor(rep.performance)}>
                    {rep.performance}% Performance
                  </Badge>
                  <Badge className={getStatusColor(rep.status)}>
                    {rep.status}
                  </Badge>
                  {rep.coachingAlerts > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCoachingAlert(rep);
                      }}
                      className="gap-1"
                    >
                      <Bell className="h-4 w-4 text-orange-600" />
                      {rep.coachingAlerts}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="font-semibold">{rep.revenue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Calls</p>
                  <p className="font-semibold">{rep.calls}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wins</p>
                  <p className="font-semibold">{rep.wins}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-semibold text-xs">{rep.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScheduleCoaching(rep);
                  }}
                  className="gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Coaching
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Messaging ${rep.name}`);
                  }}
                  className="gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${rep.phone}`;
                  }}
                  className="gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Opening full details for ${rep.name}`);
                  }}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Full Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamOverviewActions;
