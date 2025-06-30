
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Settings, Phone } from 'lucide-react';

interface DialerControlPanelProps {
  isDialing: boolean;
  complianceOK: boolean;
  queueCount: number;
  onStartDialing: () => void;
  onStopDialing: () => void;
}

const DialerControlPanel: React.FC<DialerControlPanelProps> = ({
  isDialing,
  complianceOK,
  queueCount,
  onStartDialing,
  onStopDialing
}) => {
  return (
    <div className="space-y-4">
      {/* Dialer Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            Dialer Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge variant={isDialing ? "default" : "secondary"}>
              {isDialing ? "Active" : "Stopped"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Compliance:</span>
            <Badge variant={complianceOK ? "default" : "destructive"}>
              {complianceOK ? "Ready" : "Issues"}
            </Badge>
          </div>

          <Button 
            onClick={isDialing ? onStopDialing : onStartDialing}
            disabled={!complianceOK && !isDialing}
            className="w-full"
            variant={isDialing ? "outline" : "default"}
          >
            <Play className="h-4 w-4 mr-2" />
            {isDialing ? "Stop Dialing" : "Start Dialing"}
          </Button>

          <Button variant="ghost" className="w-full text-sm">
            <Settings className="h-3 w-3 mr-2" />
            Dialer Settings
          </Button>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-700">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="text-xs text-gray-600 space-y-1">
            <div>✓ Auto-advance on no answer</div>
            <div>✓ AI reorders after 10 misses</div>
            <div>✓ Notes auto-save to profile</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DialerControlPanel;
