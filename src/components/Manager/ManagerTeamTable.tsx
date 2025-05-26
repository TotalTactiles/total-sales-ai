
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Calendar, Award, LineChart, UserPlus } from 'lucide-react';

interface ManagerTeamTableProps {
  teamMembers: any[];
}

const ManagerTeamTable: React.FC<ManagerTeamTableProps> = ({ teamMembers }) => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedRep, setSelectedRep] = useState<any>(null);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return 'Never';
    
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getBurnoutColor = (risk: number) => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getMoodEmoji = (score: number | null) => {
    if (!score) return '😐';
    if (score >= 80) return '😁';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    if (score >= 20) return '😕';
    return '😞';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Performance
        </CardTitle>
        <CardDescription>
          Real-time performance metrics and team member status
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Representative</TableHead>
                <TableHead className="text-center">Mood</TableHead>
                <TableHead className="text-right">Calls</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-center">Streak</TableHead>
                <TableHead className="text-center">Burnout Risk</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-salesBlue-light text-salesBlue">
                          {(member.full_name?.charAt(0) || 'U')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.full_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">Last login: {formatDate(member.last_login)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xl">
                    {getMoodEmoji(member.stats.mood_score)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {member.stats.call_count}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {member.stats.win_count}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${member.stats.current_streak > 0 ? 'bg-salesGreen' : 'bg-slate-400'}`}>
                      {member.stats.current_streak} {member.stats.current_streak === 1 ? 'day' : 'days'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getBurnoutColor(member.stats.burnout_risk)}`}
                          style={{ width: `${member.stats.burnout_risk}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">
                        {member.stats.burnout_risk}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(member.stats.last_active)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Schedule 1-on-1</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Award className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send recognition</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <LineChart className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View analytics</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {teamMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No team members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 p-4 flex justify-between">
        <Button variant="outline" className="border-salesBlue text-salesBlue">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
        <Button variant="outline">
          Download Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManagerTeamTable;
