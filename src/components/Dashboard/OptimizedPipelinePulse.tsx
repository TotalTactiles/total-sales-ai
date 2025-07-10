
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp,
  Brain,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

interface OptimizedPipelinePulseProps {
  leads: Lead[];
  className?: string;
}

const OptimizedPipelinePulse: React.FC<OptimizedPipelinePulseProps> = ({ 
  leads, 
  className = '' 
}) => {
  const navigate = useNavigate();
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Mock high-priority leads with required properties
  const mockHighPriorityLeads: Lead[] = [
    {
      id: '1',
      name: 'Contact 1',
      email: 'contact1@techcorp.com',
      phone: '+1-555-0123',
      company: 'TechCorp',
      status: 'proposal',
      priority: 'high',
      source: 'LinkedIn',
      score: 94,
      conversionLikelihood: 86,
      lastContact: '2024-01-15T10:00:00Z',
      speedToLead: 2,
      tags: ['enterprise', 'hot lead'],
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      companyId: 'demo-company',
      isSensitive: false,
      value: 94760,
      lastActivity: 'No reply in 4 days',
      aiPriority: 'High',
      nextAction: 'Reschedule call',
      lastAIInsight: 'No reply in 4 days – reschedule now'
    },
    {
      id: '2',
      name: 'Contact 2',
      email: 'contact2@innovateco.com',
      phone: '+1-555-0124',
      company: 'InnovateCo',
      status: 'negotiation',
      priority: 'high',
      source: 'Referral',
      score: 87,
      conversionLikelihood: 82,
      lastContact: '2024-01-14T15:30:00Z',
      speedToLead: 1,
      tags: ['decision maker', 'budget approved'],
      createdAt: '2024-01-08T14:00:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      companyId: 'demo-company',
      isSensitive: false,
      value: 78500,
      lastActivity: 'Opened proposal twice',
      aiPriority: 'High',
      nextAction: 'Follow up on proposal',
      lastAIInsight: 'Opened proposal twice, no reply'
    },
    {
      id: '3',
      name: 'Contact 3',
      email: 'contact3@globalsoft.com',
      phone: '+1-555-0125',
      company: 'GlobalSoft',
      status: 'qualified',
      priority: 'high',
      source: 'Website',
      score: 76,
      conversionLikelihood: 74,
      lastContact: '2024-01-13T09:15:00Z',
      speedToLead: 3,
      tags: ['demo requested', 'technical buyer'],
      createdAt: '2024-01-09T11:00:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      companyId: 'demo-company',
      isSensitive: false,
      value: 65200,
      lastActivity: 'Last call 6 days ago',
      aiPriority: 'Medium',
      nextAction: 'Schedule demo',
      lastAIInsight: 'Last call 6 days ago – follow-up recommended'
    },
    {
      id: '4',
      name: 'Contact 4',
      email: 'contact4@datadriven.com',
      phone: '+1-555-0126',
      company: 'DataDriven',
      status: 'contacted',
      priority: 'medium',
      source: 'Cold Email',
      score: 71,
      conversionLikelihood: 68,
      lastContact: '2024-01-12T14:45:00Z',
      speedToLead: 4,
      tags: ['interested', 'budget questions'],
      createdAt: '2024-01-07T16:30:00Z',
      updatedAt: '2024-01-12T14:45:00Z',
      companyId: 'demo-company',
      isSensitive: false,
      value: 52300,
      lastActivity: 'Clicked demo link',
      aiPriority: 'Medium',
      nextAction: 'Book demo call',
      lastAIInsight: 'Clicked demo link, but didn\'t book'
    },
    {
      id: '5',
      name: 'Contact 5',
      email: 'contact5@cloudfirst.com',
      phone: '+1-555-0127',
      company: 'CloudFirst',
      status: 'new',
      priority: 'medium',
      source: 'Trade Show',
      score: 69,
      conversionLikelihood: 65,
      lastContact: '2024-01-11T11:20:00Z',
      speedToLead: 2,
      tags: ['new contact', 'interested'],
      createdAt: '2024-01-11T11:20:00Z',
      updatedAt: '2024-01-11T11:20:00Z',
      companyId: 'demo-company',
      isSensitive: false,
      value: 41800,
      lastActivity: 'Initial contact made',
      aiPriority: 'Low',
      nextAction: 'Qualification call',
      lastAIInsight: 'New lead, strong initial interest'
    }
  ];

  // Show top 5 AI-prioritized leads
  const displayLeads = (leads.length > 0 ? leads : mockHighPriorityLeads).slice(0, 5);

  // Helper function to format last contact date
  const formatLastContact = (lastContact: string) => {
    const date = new Date(lastContact);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Helper function to get stage display name
  const getStageDisplay = (status: string) => {
    const stageMap: Record<string, string> = {
      'new': 'New Lead',
      'contacted': 'Contacted',
      'qualified': 'Qualified',
      'proposal': 'Proposal',
      'negotiation': 'Negotiation',
      'closed_won': 'Won',
      'closed_lost': 'Lost'
    };
    return stageMap[status] || status;
  };

  // Helper function to get stage color
  const getStageColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'closed_won': 'bg-emerald-100 text-emerald-800',
      'closed_lost': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleCallClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setCallDialogOpen(true);
  };

  const handleEmailClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    navigate(`/sales/leads/${lead.id}?tab=email`);
  };

  const handleCalendarClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    navigate(`/sales/leads/${lead.id}?tab=meetings`);
  };

  const handleLeadClick = (lead: Lead) => {
    navigate(`/sales/leads/${lead.id}`);
  };

  const handleViewAllLeads = () => {
    navigate('/sales/leads');
  };

  const handleUseMyPhone = () => {
    if (selectedLead) {
      navigator.clipboard.writeText(selectedLead.phone);
      toast.success(`Phone number ${selectedLead.phone} copied to clipboard`);
      setCallDialogOpen(false);
    }
  };

  const handleCallInApp = () => {
    if (selectedLead) {
      navigate(`/sales/dialer?leadId=${selectedLead.id}`);
      setCallDialogOpen(false);
    }
  };

  return (
    <>
      <Card className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Pipeline Pulse
            <Badge className="bg-white/20 text-white text-xs">
              <Brain className="h-3 w-3 mr-1" />
              AI Prioritized
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {displayLeads.map((lead, index) => (
              <div
                key={lead.id}
                className={`grid grid-cols-6 gap-4 items-center p-4 border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer ${
                  index === 0 ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => handleLeadClick(lead)}
              >
                {/* Lead Info & Value */}
                <div className="flex items-center gap-3 col-span-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-gray-900">
                      ${lead.value?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-500">{lead.name} • {lead.company}</div>
                  </div>
                </div>

                {/* Last Contacted */}
                <div className="text-sm text-gray-600">
                  {formatLastContact(lead.lastContact)}
                </div>

                {/* Stage */}
                <div>
                  <Badge className={`text-xs ${getStageColor(lead.status)}`}>
                    {getStageDisplay(lead.status)}
                  </Badge>
                </div>

                {/* AI Insight Summary */}
                <div className="text-sm text-gray-700 italic">
                  "{lead.lastAIInsight}"
                </div>

                {/* Quick Action Icons */}
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    onClick={(e) => handleCallClick(e, lead)}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 hover:bg-green-100 hover:border-green-300 transition-colors"
                    onClick={(e) => handleEmailClick(e, lead)}
                  >
                    <Mail className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 hover:bg-purple-100 hover:border-purple-300 transition-colors"
                    onClick={(e) => handleCalendarClick(e, lead)}
                  >
                    <Calendar className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Leads Button */}
          <div className="p-4 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAllLeads}
              className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ExternalLink className="h-4 w-4" />
              View All Leads
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Call Options Dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call {selectedLead?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-900 mb-2">{selectedLead?.name}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{selectedLead?.company}</div>
                <div>{selectedLead?.phone}</div>
                <div className="font-medium">Value: ${selectedLead?.value?.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleUseMyPhone}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Use My Phone
              </Button>
              <Button
                onClick={handleCallInApp}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Phone className="h-4 w-4" />
                Call in App
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 text-center">
              "Use My Phone" will copy the number to your clipboard
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OptimizedPipelinePulse;
