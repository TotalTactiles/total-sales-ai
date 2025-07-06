
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, PhoneCall, PhoneOff, Clock, Users, TrendingUp } from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';

const Dialer: React.FC = () => {
  const { leads } = useMockData();
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);

  const priorityLeads = leads.filter(lead => lead.priority === 'high').slice(0, 5);

  const startCall = (lead: any) => {
    setCurrentCall(lead);
    setIsCallActive(true);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCurrentCall(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auto Dialer</h1>
          <p className="text-gray-600">Smart calling system with AI assistance</p>
        </div>
        <Badge className={isCallActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          <Phone className="h-3 w-3 mr-1" />
          {isCallActive ? 'Call Active' : 'Ready'}
        </Badge>
      </div>

      {/* Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PhoneCall className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Calls Today</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Talk Time</p>
                <p className="text-2xl font-bold">2.4h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connected</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Connect Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Call Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.company}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={lead.priority === 'high' ? 'destructive' : 'default'}>
                      {lead.priority}
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => startCall(lead)}
                      disabled={isCallActive}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Call Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Call Controls</CardTitle>
          </CardHeader>
          <CardContent>
            {isCallActive && currentCall ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneCall className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{currentCall.name}</h3>
                  <p className="text-gray-600">{currentCall.company}</p>
                  <p className="text-sm text-gray-500">{currentCall.phone}</p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="destructive" onClick={endCall}>
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">AI Coaching Tips:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Ask about their current solution</li>
                    <li>• Focus on ROI benefits</li>
                    <li>• Schedule a demo if interested</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Phone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active call</p>
                <p className="text-sm text-gray-400">Select a lead from the queue to start calling</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dialer;
