
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Filter, Calendar } from 'lucide-react';

interface Victory {
  id: string;
  clientName: string;
  dealValue: string;
  dateClosed: string;
  type: 'new' | 'upsell' | 'renewal';
}

interface VictoryArchiveProps {
  victories: Victory[];
  isFullUser: boolean;
}

const VictoryArchive: React.FC<VictoryArchiveProps> = ({ victories, isFullUser }) => {
  const [filterPeriod, setFilterPeriod] = useState('all');

  const getVictoryBadgeColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'upsell': return 'bg-blue-100 text-blue-800';
      case 'renewal': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`w-full ${isFullUser ? 'border-2 border-gradient-to-r from-yellow-400 to-orange-500' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>{isFullUser ? 'Victory Archive' : 'Recent Wins'}</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {victories.slice(0, 5).map((victory) => (
            <div key={victory.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium">{victory.clientName}</p>
                  <Badge className={getVictoryBadgeColor(victory.type)}>
                    {victory.type}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{victory.dateClosed}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{victory.dealValue}</p>
              </div>
            </div>
          ))}
          
          {victories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No victories recorded yet.</p>
              <p className="text-sm">Your wins will appear here once you close deals.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VictoryArchive;
