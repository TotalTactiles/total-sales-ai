
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, DollarSign } from 'lucide-react';

interface RepStatus {
  id: string;
  name: string;
  initials: string;
  status: 'calling' | 'idle' | 'off';
  lastActivity: string;
  dailyRevenue: number;
}

const LiveRepTracker: React.FC = () => {
  const reps: RepStatus[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      initials: 'SJ',
      status: 'calling',
      lastActivity: '2 min ago',
      dailyRevenue: 12500
    },
    {
      id: '2',
      name: 'Michael Chen',
      initials: 'MC',
      status: 'idle',
      lastActivity: '15 min ago',
      dailyRevenue: 8300
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      initials: 'ER',
      status: 'calling',
      lastActivity: '1 min ago',
      dailyRevenue: 15700
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calling': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'off': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'calling': return <Phone className="h-3 w-3" />;
      case 'idle': return <Clock className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Rep Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {reps.map((rep) => (
            <div key={rep.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                    {rep.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{rep.name}</div>
                  <div className="text-xs text-gray-600">{rep.lastActivity}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">
                    ${rep.dailyRevenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Today</div>
                </div>
                <Badge className={`${getStatusColor(rep.status)} flex items-center gap-1`}>
                  {getStatusIcon(rep.status)}
                  {rep.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveRepTracker;
