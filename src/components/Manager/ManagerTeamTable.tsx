
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, TrendingUp, Phone, DollarSign, AlertTriangle } from 'lucide-react';

interface TeamMember {
  id: string;
  full_name: string;
  email?: string;
  stats: {
    call_count: number;
    win_count: number;
    current_streak: number;
    burnout_risk: number;
    mood_score: number;
    revenue_generated: number;
    conversion_rate: number;
  };
}

interface ManagerTeamTableProps {
  teamMembers: TeamMember[];
}

const ManagerTeamTable: React.FC<ManagerTeamTableProps> = ({ teamMembers }) => {
  const getBurnoutRiskColor = (risk: number) => {
    if (risk >= 70) return 'bg-red-100 text-red-800 border-red-200';
    if (risk >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 80) return 'text-green-600';
    if (mood >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No team members found. Loading demo data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Team Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rep</TableHead>
              <TableHead>Calls</TableHead>
              <TableHead>Wins</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Conversion</TableHead>
              <TableHead>Mood</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {member.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.full_name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {member.stats.call_count}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    {member.stats.win_count}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    ${(member.stats.revenue_generated / 1000).toFixed(0)}K
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {member.stats.conversion_rate}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${getMoodColor(member.stats.mood_score)}`}>
                    {member.stats.mood_score}%
                  </span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getBurnoutRiskColor(member.stats.burnout_risk)}
                  >
                    {member.stats.burnout_risk >= 70 && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {member.stats.burnout_risk}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManagerTeamTable;
