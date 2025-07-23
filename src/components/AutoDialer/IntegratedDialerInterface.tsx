
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  Users, 
  BarChart3,
  Maximize2,
  Settings
} from 'lucide-react';
import { Lead } from '@/types/lead';
import PopOutCallWindow from '../Calling/PopOutCallWindow';
import VoiceTonalityComponent from '../Calling/VoiceTonalityComponent';
import LeadCommunicationPanel from '../Calling/LeadCommunicationPanel';
import EnhancedAutoDialerInterface from './EnhancedAutoDialerInterface';

interface IntegratedDialerInterfaceProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

const IntegratedDialerInterface: React.FC<IntegratedDialerInterfaceProps> = ({
  leads,
  onLeadSelect
}) => {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isPopOutOpen, setIsPopOutOpen] = useState(false);
  const [activeCallSession, setActiveCallSession] = useState<string | undefined>();
  const [isCallActive, setIsCallActive] = useState(false);

  const handleLeadSelect = (lead: Lead) => {
    setCurrentLead(lead);
    onLeadSelect(lead);
  };

  const handleIndividualCall = (lead: Lead) => {
    setCurrentLead(lead);
    setIsPopOutOpen(true);
    setIsCallActive(true);
  };

  const handleClosePopOut = () => {
    setIsPopOutOpen(false);
    setIsCallActive(false);
    setActiveCallSession(undefined);
  };

  const stats = {
    totalLeads: leads.length,
    highPriority: leads.filter(l => l.priority === 'high').length,
    callsToday: 47,
    connectRate: 78
  };

  return (
    <div className="h-full space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <Badge variant="destructive" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                !
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calls Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.callsToday}</p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connect Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.connectRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        {/* Left Panel - Auto Dialer */}
        <div className="col-span-7">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <PhoneCall className="h-5 w-5" />
                  Power Dialer
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => currentLead && handleIndividualCall(currentLead)}
                    disabled={!currentLead}
                  >
                    <Maximize2 className="h-4 w-4 mr-1" />
                    Pop Out
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-hidden">
              <EnhancedAutoDialerInterface
                leads={leads}
                currentLead={currentLead}
                onLeadSelect={handleLeadSelect}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Voice & Communications */}
        <div className="col-span-5 space-y-4">
          {/* Voice Tonality */}
          <div className="h-1/2">
            <VoiceTonalityComponent 
              sessionId={activeCallSession}
              isActive={isCallActive}
            />
          </div>

          {/* Communications */}
          <div className="h-1/2">
            {currentLead ? (
              <LeadCommunicationPanel 
                lead={currentLead}
                sessionId={activeCallSession}
              />
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a lead to view communications</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Pop-out Call Window */}
      {isPopOutOpen && currentLead && (
        <PopOutCallWindow
          lead={currentLead}
          isOpen={isPopOutOpen}
          onClose={handleClosePopOut}
          callSessionId={activeCallSession}
        />
      )}
    </div>
  );
};

export default IntegratedDialerInterface;
