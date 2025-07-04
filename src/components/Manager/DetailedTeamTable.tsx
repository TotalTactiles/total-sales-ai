
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Edit3, 
  Filter,
  ArrowUpDown,
  Info,
  Flame,
  AlertTriangle
} from 'lucide-react';

interface DetailedTeamMember {
  id: string;
  name: string;
  role: string;
  avgDailyDials: number;
  emailsSent: number;
  meetingsBooked: number;
  noShows: number;
  dealsClosed: number;
  revenue: number;
  leadSourceMajority: string;
  mainStageStuckIn: string;
  conversionRate: number;
  performanceTrend: 'rising' | 'slipping' | 'stable';
  coachNotes: string;
}

const DetailedTeamTable: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  // Mock detailed team data
  const [teamData, setTeamData] = useState<DetailedTeamMember[]>([
    {
      id: 'sj-001',
      name: 'Sarah Johnson',
      role: 'Senior Sales Rep',
      avgDailyDials: 45,
      emailsSent: 127,
      meetingsBooked: 23,
      noShows: 2,
      dealsClosed: 8,
      revenue: 145000,
      leadSourceMajority: 'Inbound',
      mainStageStuckIn: 'Proposal',
      conversionRate: 67.2,
      performanceTrend: 'rising',
      coachNotes: 'Excellent at discovery calls. Focus on closing techniques.'
    },
    {
      id: 'mc-002',
      name: 'Michael Chen',
      role: 'Sales Rep',
      avgDailyDials: 32,
      emailsSent: 89,
      meetingsBooked: 15,
      noShows: 5,
      dealsClosed: 4,
      revenue: 89000,
      leadSourceMajority: 'Cold Outreach',
      mainStageStuckIn: 'Qualification',
      conversionRate: 43.1,
      performanceTrend: 'slipping',
      coachNotes: 'Needs help with qualification framework. Schedule training.'
    },
    {
      id: 'er-003',
      name: 'Emily Rodriguez',
      role: 'Sales Rep',
      avgDailyDials: 38,
      emailsSent: 104,
      meetingsBooked: 19,
      noShows: 3,
      dealsClosed: 6,
      revenue: 112000,
      leadSourceMajority: 'Referrals',
      mainStageStuckIn: 'Demo',
      conversionRate: 58.9,
      performanceTrend: 'stable',
      coachNotes: 'Strong performer. Consider leadership development.'
    },
    {
      id: 'jw-004',
      name: 'James Wilson',
      role: 'Junior Sales Rep',
      avgDailyDials: 28,
      emailsSent: 76,
      meetingsBooked: 12,
      noShows: 4,
      dealsClosed: 2,
      revenue: 45000,
      leadSourceMajority: 'Social Media',
      mainStageStuckIn: 'Discovery',
      conversionRate: 34.5,
      performanceTrend: 'rising',
      coachNotes: 'New hire showing promise. Pair with senior mentor.'
    }
  ]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const updateCoachNotes = (id: string, notes: string) => {
    setTeamData(prev => prev.map(member => 
      member.id === id ? { ...member, coachNotes: notes } : member
    ));
    setEditingNotes(null);
  };

  const getPerformanceIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <Flame className="h-4 w-4 text-green-600" />;
      case 'slipping': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-400" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPerformanceText = (trend: string) => {
    switch (trend) {
      case 'rising': return '🔥 Rising';
      case 'slipping': return '⬇ Slipping';
      case 'stable': return '🟰 Stable';
      default: return '🟰 Stable';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'slipping': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <TooltipProvider>
      <Card className="rounded-lg shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Detailed Team Performance
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Enhanced Analytics
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select 
                  value={filterBy} 
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All Reps</option>
                  <option value="rising">Rising Only</option>
                  <option value="slipping">Needs Attention</option>
                  <option value="senior">Senior Reps</option>
                </select>
              </div>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Rep Name <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          Avg Daily Dials <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average number of calls made per day</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">Emails Sent</TableHead>
                  <TableHead className="text-right">Meetings Booked</TableHead>
                  <TableHead className="text-right">No Shows</TableHead>
                  <TableHead className="text-right">Deals Closed</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Lead Source Majority</TableHead>
                  <TableHead>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          Main Stage Stuck In <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pipeline stage with longest average time spent</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right">Conversion Rate</TableHead>
                  <TableHead className="text-center">Performance Trend</TableHead>
                  <TableHead>Coach Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamData.map((member) => (
                  <TableRow key={member.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {member.avgDailyDials}
                    </TableCell>
                    <TableCell className="text-right">{member.emailsSent}</TableCell>
                    <TableCell className="text-right">{member.meetingsBooked}</TableCell>
                    <TableCell className="text-right">
                      {member.noShows > 3 ? (
                        <span className="text-red-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {member.noShows}
                        </span>
                      ) : (
                        member.noShows
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {member.dealsClosed}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${member.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {member.leadSourceMajority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${member.mainStageStuckIn === 'Qualification' ? 'border-red-300 text-red-700' : ''}`}
                      >
                        {member.mainStageStuckIn}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={member.conversionRate < 50 ? 'text-red-600' : 'text-green-600'}>
                        {member.conversionRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`flex items-center justify-center gap-1 ${getTrendColor(member.performanceTrend)}`}>
                        {getPerformanceIcon(member.performanceTrend)}
                        <span className="text-xs font-medium">
                          {getPerformanceText(member.performanceTrend)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {editingNotes === member.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            defaultValue={member.coachNotes}
                            className="text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                updateCoachNotes(member.id, e.currentTarget.value);
                              } else if (e.key === 'Escape') {
                                setEditingNotes(null);
                              }
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 truncate">
                            {member.coachNotes}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setEditingNotes(member.id)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default DetailedTeamTable;
