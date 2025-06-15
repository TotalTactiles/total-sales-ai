import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Play, 
  Pause, 
  SkipForward,
  Clock,
  Users,
  Target,
  TrendingUp,
  Mic,
  MicOff,
  Volume2,
  Settings,
  AlertTriangle,
  Plus,
  Star
} from 'lucide-react';
import { useDemoData } from '@/contexts/DemoDataContext';

const SalesDialer = () => {
  const { leads } = useDemoData();
  const [isDialing, setIsDialing] = useState(false);
  const [currentCallIndex, setCurrentCallIndex] = useState(0);

  const dialerStats = {
    repQueue: 5,
    aiQueue: 10,
    missed: 0,
    stopped: 10
  };

  const complianceStatus = {
    dncRegister: 'Required',
    timeWindow: '9AM-8PM ✓',
    auditTrail: 'Active'
  };

  const dialerControls = {
    status: 'Stopped',
    compliance: 'Issues'
  };

  const b2bOverride = {
    available: true,
    description: 'For business-to-business calls where applicable'
  };

  const repQueue = [
    { id: "Contact 1", status: "pending", priority: "high" }
  ];

  const quickTips = [
    "Auto-advance on no answer",
    "AI reroutes after 10 misses", 
    "Notes auto-save to profile"
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Demo Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white">Demo Mode</Badge>
              <div>
                <h3 className="font-semibold text-blue-800">Exploring the AI Auto-Dialer System Workspace</h3>
                <p className="text-blue-600 text-sm">This is mock data showing how your AI auto-dialer system workflow would look with real leads and activities.</p>
              </div>
            </div>
            <Button variant="outline" className="text-blue-600 border-blue-300">
              Interactive Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auto-Dialer System</h1>
          <p className="text-muted-foreground">AI-Augmented Legal Compliant Dialing</p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Demo Mock Call
          </Button>
          <div className="flex items-center gap-6 text-sm">
            <span><strong>Rep Queue:</strong> {dialerStats.repQueue}</span>
            <span><strong>AI Queue:</strong> {dialerStats.aiQueue}</span>
            <span><strong>Missed:</strong> {dialerStats.missed}/10</span>
            <span><strong>Stopped:</strong> {dialerStats.stopped}</span>
          </div>
        </div>
      </div>

      {/* Legal Compliance Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Legal Compliance - Australia
            </h3>
            <Button variant="link" className="text-blue-600">
              View Guidelines
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium">DNC Register</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Required</Badge>
                <Button size="sm" variant="outline">Check Now</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">Time Window</span>
              </div>
              <Badge className="bg-green-500 text-white">9AM-8PM ✓</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Audit Trail</span>
              </div>
              <Badge className="bg-blue-500 text-white">Active</Badge>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Compliance Issues</h4>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <h5 className="font-medium text-yellow-800">B2B Override Available</h5>
              <p className="text-sm text-yellow-700 mb-2">For business-to-business calls where applicable</p>
              <p className="text-xs text-yellow-600">Admin Only</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialer Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Dialer Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="text-muted-foreground">Stopped</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Compliance:</span>
                <Badge variant="destructive">Issues</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full" disabled>
                <Play className="h-4 w-4 mr-2" />
                Start Dialing
              </Button>
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Dialer Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              A/B Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New A/B Test
            </Button>
            
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Pricing Objection A/B</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  "Today Eli — let me show you how this gets paid back in 3 months."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Success: 38%</span>
                  <Badge>5 calls</Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">Avg Time: 5.1s</span>
                  <span className="text-sm text-green-600">high</span>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Opening Hook Test</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  "Hi [Name], I know you're busy, this will take 30 seconds."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Success: 24%</span>
                  <Badge>8 calls</Badge>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">Avg Time: 8.2s</span>
                  <span className="text-sm text-yellow-600">medium</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Top Performer</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rep Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Rep Queue (5)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {repQueue.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{contact.id}</span>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDialer;
