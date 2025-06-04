
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Phone, 
  PhoneOff, 
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DialerControlsProps {
  isDialing: boolean;
  isCallActive: boolean;
  onStartDialing: () => void;
  onPauseDialing: () => void;
  onEndCall: () => void;
  canStart: boolean;
}

const DialerControls: React.FC<DialerControlsProps> = ({
  isDialing,
  isCallActive,
  onStartDialing,
  onPauseDialing,
  onEndCall,
  canStart
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flat-heading-sm flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Dialer Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status Indicators */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge variant={isDialing ? "default" : "outline"}>
            {isDialing ? "Active" : "Stopped"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Compliance:</span>
          <Badge variant={canStart ? "default" : "destructive"} className="flex items-center gap-1">
            {canStart ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
            {canStart ? "Ready" : "Issues"}
          </Badge>
        </div>

        {/* Control Buttons */}
        <div className="space-y-2">
          {!isDialing ? (
            <Button 
              onClick={onStartDialing}
              disabled={!canStart}
              className="w-full"
              variant={canStart ? "default" : "outline"}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Dialing
            </Button>
          ) : (
            <Button 
              onClick={onPauseDialing}
              variant="outline"
              className="w-full"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause Dialing
            </Button>
          )}

          {isCallActive && (
            <Button 
              onClick={onEndCall}
              variant="destructive"
              className="w-full"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              End Call
            </Button>
          )}

          <Button variant="ghost" className="w-full text-xs">
            <Settings className="h-3 w-3 mr-2" />
            Dialer Settings
          </Button>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="flat-heading-sm text-blue-800 mb-1">Quick Tips</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Auto-advances on no answer</li>
            <li>• AI reorders after 10 misses</li>
            <li>• Notes auto-save to profile</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DialerControls;
