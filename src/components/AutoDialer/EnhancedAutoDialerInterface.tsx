
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  Zap,
  Brain,
  Play,
  Pause,
  SkipForward,
  Settings,
  Target
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import { useAIContext } from '@/contexts/AIContext';

import LeadPriorityQueue from './LeadPriorityQueue';
import CallFeedback from './CallFeedback';
import DialerOverlay from './DialerOverlay';
import SpeedToLeadAlert from './SpeedToLeadAlert';
import AIAutopilotToggle from './AIAutopilotToggle';

interface EnhancedAutoDialerInterfaceProps {
  leads: Lead[];
  currentLead?: Lead | null;
  onLeadSelect: (lead: Lead) => void;
}

const EnhancedAutoDialerInterface: React.FC<EnhancedAutoDialerInterfaceProps> = ({
  leads,
  currentLead,
  onLeadSelect
}) => {
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [currentCallIndex, setCurrentCallIndex] = useState(0);
  const [callProgress, setCallProgress] = useState(0);
  const [autopilotLeads, setAutopilotLeads] = useState<Set<string>>(new Set());

  const { setCallActive, setCallDuration } = useAIContext();

  // Stats
  const totalLeads = leads.length;
  const freshLeads = leads.filter(lead => (lead.speedToLead || 0) < 15);
  const highPriorityLeads = leads.filter(lead => lead.priority === 'high');
  const completedCalls = Math.floor(totalLeads * 0.23);

  // Auto-select next lead based on priority algorithm
  useEffect(() => {
    if (!currentLead && leads.length > 0) {
      const scoredLeads = leads
        .filter(lead => !autopilotLeads.has(lead.id))
        .map(lead => {
          let score = 0;
          
          if ((lead.speedToLead || 0) < 5) score += 100;
          else if ((lead.speedToLead || 0) < 15) score += 50;
          else if ((lead.speedToLead || 0) < 60) score += 20;
          
          score += (lead.conversionLikelihood || 0);
          
          if (lead.priority === 'high') score *= 1.5;
          else if (lead.priority === 'medium') score *= 1.2;
          
          return { lead, score };
        })
        .sort((a, b) => b.score - a.score);

      if (scoredLeads.length > 0) {
        onLeadSelect(scoredLeads[0].lead);
      }
    }
  }, [leads, currentLead, onLeadSelect, autopilotLeads]);

  const handleStartCalling = () => {
    if (currentLead) {
      setIsDialerOpen(true);
      setCallActive(true);
      setCallDuration(0);
      toast.success(`Initiating call to ${currentLead.name}`);
    } else {
      toast.warning('Please select a lead first');
    }
  };

  const handleAutoMode = () => {
    setIsAutoMode(!isAutoMode);
    if (!isAutoMode) {
      toast.success('Auto-dialer mode activated. AI will manage the calling sequence.');
    } else {
      toast.info('Auto-dialer mode deactivated. Manual control restored.');
    }
  };

  const handleNextLead = () => {
    const currentIndex = leads.findIndex(lead => lead.id === currentLead?.id);
    const nextIndex = (currentIndex + 1) % leads.length;
    onLeadSelect(leads[nextIndex]);
    setCurrentCallIndex(nextIndex);
  };

  const handlePreviousLead = () => {
    const currentIndex = leads.findIndex(lead => lead.id === currentLead?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : leads.length - 1;
    onLeadSelect(leads[prevIndex]);
    setCurrentCallIndex(prevIndex);
  };

  const handleAutopilotToggle = (leadId: string, enabled: boolean) => {
    setAutopilotLeads(prev => {
      const newSet = new Set(prev);
      if (enabled) {
        newSet.add(leadId);
      } else {
        newSet.delete(leadId);
      }
      return newSet;
    });
  };

  const handleEndCall = () => {
    setIsDialerOpen(false);
    setCallActive(false);
    setCallDuration(0);
    handleNextLead();
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fresh Leads</p>
                <p className="text-2xl font-bold text-orange-600">{freshLeads.length}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityLeads.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calls Today</p>
                <p className="text-2xl font-bold text-green-600">{completedCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Speed-to-Lead Alerts */}
        <div className="col-span-4 space-y-4 overflow-y-auto">
          <SpeedToLeadAlert
            freshLeads={freshLeads}
            onCallLead={(lead) => {
              onLeadSelect(lead);
              setIsDialerOpen(true);
              setCallActive(true);
            }}
            onSelectLead={onLeadSelect}
          />
          
          {/* AI Autopilot Section */}
          {currentLead && (
            <AIAutopilotToggle
              lead={currentLead}
              isAutopilotEnabled={autopilotLeads.has(currentLead.id)}
              onToggle={(enabled) => handleAutopilotToggle(currentLead.id, enabled)}
            />
          )}
        </div>

        {/* Center Panel - Lead Queue & Controls */}
        <div className="col-span-5 space-y-4">
          {/* Dialer Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Power Dialer
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isAutoMode ? "destructive" : "outline"}
                    size="sm"
                    onClick={handleAutoMode}
                  >
                    {isAutoMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isAutoMode ? 'Stop Auto' : 'Auto Mode'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentLead ? (
                <div className="p-4 bg-blue-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{currentLead.name}</h3>
                      <p className="text-sm text-gray-600">{currentLead.company}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={currentLead.priority === 'high' ? 'destructive' : 'secondary'}>
                        {currentLead.priority}
                      </Badge>
                      <Badge variant="outline">
                        {currentLead.conversionLikelihood}% likely
                      </Badge>
                      {autopilotLeads.has(currentLead.id) && (
                        <Badge className="bg-purple-600">
                          <Brain className="h-3 w-3 mr-1" />
                          Autopilot
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleStartCalling}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call {currentLead.name}
                    </Button>
                    <Button variant="outline" onClick={handlePreviousLead}>
                      ←
                    </Button>
                    <Button variant="outline" onClick={handleNextLead}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No leads selected</p>
                  <p className="text-sm">AI will auto-select optimal leads</p>
                </div>
              )}

              {/* Progress Indicators */}
              {isAutoMode && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Auto-dialer Progress</span>
                    <span>{Math.round(callProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${callProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Priority Queue */}
          <LeadPriorityQueue
            leads={leads.filter(lead => !autopilotLeads.has(lead.id))}
            onLeadSelect={onLeadSelect}
            currentLead={currentLead}
          />
        </div>

        {/* Right Panel - Performance */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">78%</div>
                  <div className="text-xs text-gray-500">Connect Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">3</div>
                  <div className="text-xs text-gray-500">Qualified</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">1</div>
                  <div className="text-xs text-gray-500">Closed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                AI Coaching Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 Your close rate improves 34% when you mention ROI within first 3 minutes
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🎯 Manufacturing leads respond 2x better to efficiency messaging
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ⏰ Best call window: Next 2 hours (67% connect rate)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialer Overlay */}
      {isDialerOpen && currentLead && (
        <DialerOverlay
          lead={currentLead}
          isOpen={isDialerOpen}
          onClose={() => setIsDialerOpen(false)}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
};

export default EnhancedAutoDialerInterface;
