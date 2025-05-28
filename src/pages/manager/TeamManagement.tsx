
import React, { useState } from 'react';
import { Users, Plus, Settings, Award, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { toast } from 'sonner';

const ManagerTeamManagement = () => {
  const { isDemoMode } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const shouldShowMockData = isDemoMode() || showDemo;

  const handleStartDemo = () => {
    setShowDemo(true);
    toast.success('Demo mode activated! Explore team management capabilities.');
  };

  const mockTeamData = {
    teamMembers: [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Senior Sales Rep',
        email: 'sarah@company.com',
        performance: 'Excellent',
        quota: 150000,
        achieved: 187500,
        streak: 5,
        status: 'Active'
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Sales Rep',
        email: 'michael@company.com',
        performance: 'Good',
        quota: 120000,
        achieved: 95000,
        streak: 0,
        status: 'Needs Support'
      }
    ]
  };

  if (!shouldShowMockData && !showDemo) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto py-12">
          <WorkspaceShowcase 
            workspace="Team Management" 
            onStartDemo={handleStartDemo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {shouldShowMockData && (
        <DemoModeIndicator workspace="Team Management & Performance Dashboard" />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your sales team performance and development
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockTeamData.teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
                <Badge variant={member.status === 'Active' ? 'default' : 'destructive'}>
                  {member.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Quota Achievement</span>
                  <div className="font-bold">{((member.achieved / member.quota) * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                  <div className="font-bold">{member.streak} wins</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3 mr-1" />
                  Manage
                </Button>
                <Button variant="outline" size="sm">
                  <Award className="h-3 w-3 mr-1" />
                  Recognize
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManagerTeamManagement;
