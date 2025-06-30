
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Settings, 
  Play,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Shield,
  Eye
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface TSAMDialerLayoutProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

const TSAMDialerLayout: React.FC<TSAMDialerLayoutProps> = ({ leads, onLeadSelect }) => {
  const [dialerStatus, setDialerStatus] = useState('Stopped');
  const [complianceStatus, setComplianceStatus] = useState('As Issues');
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  const handleStartDialing = () => {
    if (complianceStatus === 'As Issues') {
      toast.error('Please resolve compliance issues before starting dialer');
      return;
    }
    setDialerStatus('Running');
    toast.success('Auto-dialer started');
  };

  const handleStopDialing = () => {
    setDialerStatus('Stopped');
    toast.info('Auto-dialer stopped');
  };

  const handleDemoMockCall = () => {
    if (leads.length > 0) {
      const demoLead = leads[0];
      setCurrentLead(demoLead);
      onLeadSelect(demoLead);
      toast.success(`Starting demo call with ${demoLead.name}`);
    } else {
      toast.error('No leads available for demo');
    }
  };

  const repQueue = leads.filter(lead => lead.priority === 'high').slice(0, 5);
  const aiQueue = leads.filter(lead => lead.priority !== 'high').slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Auto-Dialer System</h1>
            <p className="text-gray-600">AI-Augmented Legal Compliant Dialing</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleDemoMockCall}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Demo Mock Call
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Users className="h-3 w-3 mr-1" />
                Rep Queue: {repQueue.length}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                AI Queue: {aiQueue.length}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                Missed: 0/10
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                Stopped
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="px-6 py-4">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Legal Compliance - Australia</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">DNC Register</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="destructive">Required</Badge>
                  <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
                    Check Now
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Time Window</span>
                </div>
                <Badge variant="destructive">Outside Hours</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Audit Trail</span>
                </div>
                <Badge className="bg-blue-600 text-white">Active</Badge>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">Compliance Issues</span>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3 mr-1" />
                View Guidelines
              </Button>
            </div>

            <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <span className="font-medium">B2B Override Available</span>
                <Badge variant="outline" className="ml-auto">Admin Only</Badge>
              </div>
              <p className="text-xs text-yellow-700 mt-1">For business-to-business calls where applicable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Dialer Controls & Queue */}
          <div className="space-y-6">
            {/* Dialer Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Dialer Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="secondary">{dialerStatus}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance:</span>
                  <Badge variant="destructive">{complianceStatus}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleStartDialing}
                    disabled={complianceStatus === 'As Issues'}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Dialing
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Dialer Settings
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-gray-600">
                <p>• Auto-advance on no answer</p>
                <p>• AI reorders after 10 misses</p>
                <p>• Notes auto-save to profile</p>
              </CardContent>
            </Card>

            {/* Rep Queue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-blue-600" />
                  Rep Queue ({repQueue.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {repQueue.map((lead, index) => (
                  <div key={lead.id} className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                       onClick={() => onLeadSelect(lead)}>
                    <div>
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-gray-600">{lead.company}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-xs">📊 {lead.score || 61}% score</div>
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="text-xs">{lead.conversionLikelihood || 89}%</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={lead.priority === 'high' ? 'destructive' : 'secondary'}>
                        {lead.priority || 'high'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Active Call Area */}
          <div>
            <Card className="h-full">
              <CardContent className="flex flex-col items-center justify-center h-full text-center">
                <Phone className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Call</h3>
                <p className="text-gray-500 mb-4">Select a lead to start dialing</p>
                {currentLead && (
                  <div className="text-sm text-blue-600">
                    Ready to call: {currentLead.name}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - A/B Testing & Performance */}
          <div className="space-y-6">
            {/* A/B Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  A/B Testing
                  <Button size="sm" variant="outline" className="ml-auto text-xs">
                    + New A/B Test
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pricing Objection A/B</span>
                    <span className="text-xs text-blue-600">5 calls</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">"Totally fair — let me show you how this gets paid back in 3 months."</p>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">88%</div>
                      <div className="text-xs text-blue-600">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold">5:15</div>
                      <div className="text-xs text-gray-600">Avg Time</div>
                    </div>
                    <Badge variant="destructive" className="text-xs">high</Badge>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Opening Hook Test</span>
                    <span className="text-xs text-gray-600">8 calls</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">"Hi [Name], I know you're busy, this will take 30 seconds..."</p>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-600">24%</div>
                      <div className="text-xs text-gray-600">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold">8:2s</div>
                      <div className="text-xs text-gray-600">Avg Time</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">medium</Badge>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Top Performer</span>
                  </div>
                  <p className="text-sm font-medium">Pricing Objection Response</p>
                  <p className="text-xs text-green-700">"Let me show you the ROI in 30 seconds..."</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-green-800">42% success rate</span>
                    <span className="text-xs text-green-700">Industry-wide data</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View All
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    AI Suggest
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Auth OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>DS Issue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Route OK</span>
                  </div>
                  <div className="text-xs text-gray-600">22:19:24</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TSAMDialerLayout;
