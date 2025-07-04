
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, TrendingDown, Clock } from 'lucide-react';

interface CoachingNudge {
  id: string;
  repName: string;
  initials: string;
  issue: string;
  suggestion: string;
  actionType: 'script' | 'reminder' | 'training';
}

const CoachingNudges: React.FC = () => {
  const nudges: CoachingNudge[] = [
    {
      id: '1',
      repName: 'Emily Rodriguez',
      initials: 'ER',
      issue: 'Struggling with Google Ads leads',
      suggestion: 'Suggest SMB objection handling script',
      actionType: 'script'
    },
    {
      id: '2',
      repName: 'Michael Chen',
      initials: 'MC',
      issue: 'No follow-ups in 4 days',
      suggestion: 'Send automated reminder sequence',
      actionType: 'reminder'
    }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'script': return <MessageSquare className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'training': return <TrendingDown className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <MessageSquare className="h-5 w-5" />
          1-Click Coaching Nudges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nudges.map((nudge) => (
          <div key={nudge.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                  {nudge.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{nudge.repName}</h4>
                <p className="text-xs text-gray-600">{nudge.issue}</p>
              </div>
            </div>
            <p className="text-sm text-blue-800 mb-3">{nudge.suggestion}</p>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <div className="flex items-center gap-2">
                {getActionIcon(nudge.actionType)}
                Send Coaching
              </div>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CoachingNudges;
