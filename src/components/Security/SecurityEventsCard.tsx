
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface SecurityEventsCardProps {
  securityEvents: SecurityEvent[];
  onResolveEvent: (eventId: string) => void;
}

const SecurityEventsCard: React.FC<SecurityEventsCardProps> = ({
  securityEvents,
  onResolveEvent
}) => {
  const unresolvedEvents = securityEvents.filter(e => !e.resolved);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Eye className="h-4 w-4 text-yellow-600" />;
      default: return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Security Events</span>
          <Badge variant="outline">
            {unresolvedEvents.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {unresolvedEvents.length > 0 ? (
            unresolvedEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(event.severity)}
                    <span className="font-medium">{event.type.replace('_', ' ').toUpperCase()}</span>
                    <Badge className="text-xs">{event.severity}</Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-700 mb-2">{event.message}</p>
                
                <Button
                  size="sm"
                  onClick={() => onResolveEvent(event.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Resolve
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-medium text-green-700">All Systems Secure</p>
              <p className="text-sm">No security events detected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityEventsCard;
