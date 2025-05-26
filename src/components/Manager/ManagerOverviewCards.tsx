
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, AlertCircle, CheckCircle } from 'lucide-react';

interface ManagerOverviewCardsProps {
  teamMembers: any[];
  recommendations: any[];
  demoMode: boolean;
  profile: any;
}

const ManagerOverviewCards: React.FC<ManagerOverviewCardsProps> = ({ 
  teamMembers, 
  recommendations, 
  demoMode, 
  profile 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-salesBlue">Executive Dashboard</h1>
          <p className="text-slate-500">
            Welcome back, {demoMode ? 'John' : profile?.full_name || 'Manager'}! 
            You have {recommendations.length} team notifications today.
          </p>
        </div>
        
        {demoMode && (
          <Button 
            variant="destructive"
            onClick={() => {
              localStorage.removeItem('demoMode');
              localStorage.removeItem('demoRole');
              window.location.href = '/auth';
            }}
          >
            Exit Demo
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Users className="h-8 w-8 text-salesBlue mb-2" />
            <p className="text-sm text-muted-foreground">Team Members</p>
            <p className="text-3xl font-bold">{teamMembers.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <Award className="h-8 w-8 text-salesGreen mb-2" />
            <p className="text-sm text-muted-foreground">Top Performer</p>
            <p className="text-xl font-bold truncate max-w-full">
              {teamMembers.length > 0 
                ? teamMembers.sort((a, b) => (b.stats?.win_count || 0) - (a.stats?.win_count || 0))[0]?.full_name 
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-salesRed mb-2" />
            <p className="text-sm text-muted-foreground">Burnout Risk</p>
            <p className="text-3xl font-bold">
              {teamMembers.filter(member => (member.stats?.burnout_risk || 0) > 50).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-8 w-8 text-salesCyan mb-2" />
            <p className="text-sm text-muted-foreground">Team Win Rate</p>
            <p className="text-3xl font-bold">
              {teamMembers.length > 0
                ? `${Math.round((teamMembers.reduce((total, member) => total + (member.stats?.win_count || 0), 0) / 
                   teamMembers.reduce((total, member) => total + (member.stats?.call_count || 0), 0)) * 100)}%`
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerOverviewCards;
