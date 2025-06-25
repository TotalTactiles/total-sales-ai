
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Phone, 
  TrendingUp, 
  Clock,
  Calendar,
  MessageCircle
} from 'lucide-react';

const RepPerformance: React.FC = () => {
  const reps = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      calls: 24,
      wins: 8,
      streak: 5,
      mood: 85,
      status: 'online',
      lastActive: '2 min ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      calls: 18,
      wins: 3,
      streak: 0,
      mood: 45,
      status: 'away',
      lastActive: '1 hour ago'
    },
    {
      id: 3,
      name: 'Jasmine Lee',
      avatar: 'JL',
      calls: 31,
      wins: 12,
      streak: 7,
      mood: 92,
      status: 'online',
      lastActive: 'Active now'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rep Performance</h1>
            <p className="text-gray-600">Monitor and coach your sales team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {reps.map((rep) => (
            <Card key={rep.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {rep.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{rep.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${rep.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-sm text-gray-600">{rep.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={rep.mood > 70 ? 'default' : 'destructive'}>
                    Mood: {rep.mood}%
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-blue-900">{rep.calls}</p>
                    <p className="text-xs text-blue-700">Calls</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-lg font-bold text-green-900">{rep.wins}</p>
                    <p className="text-xs text-green-700">Wins</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Streak</span>
                  </div>
                  <span className="text-lg font-bold text-purple-900">{rep.streak} days</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    1-on-1
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Coach
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RepPerformance;
