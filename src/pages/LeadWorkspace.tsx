
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Lead } from '@/types/lead';
import LeadWorkspaceLeft from '@/components/LeadWorkspace/LeadWorkspaceLeft';
import LeadWorkspaceCenter from '@/components/LeadWorkspace/LeadWorkspaceCenter';
import LeadWorkspaceRight from '@/components/LeadWorkspace/LeadWorkspaceRight';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { toast } from 'sonner';

const LeadWorkspace = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { trackEvent } = useUsageTracking();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(true);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Mock lead data - in real app this would come from API
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Michael Scott',
      company: 'Dunder Mifflin',
      source: 'LinkedIn',
      email: 'michael@dundermifflin.com',
      phone: '(570) 555-1234',
      status: 'new',
      priority: 'high',
      lastContact: '2 days ago',
      score: 87,
      tags: ['Budget Approved', 'Q1 Implementation'],
      isSensitive: false,
      conversionLikelihood: 78
    },
    {
      id: '2',
      name: 'Jim Halpert',
      company: 'Athlead',
      source: 'Website',
      email: 'jim@athlead.com',
      phone: '(570) 555-5678',
      status: 'contacted',
      priority: 'medium',
      lastContact: '5 days ago',
      score: 74,
      tags: ['Price Sensitive'],
      isSensitive: false,
      conversionLikelihood: 62
    }
  ];

  useEffect(() => {
    if (leadId) {
      const foundLead = mockLeads.find(l => l.id === leadId);
      if (foundLead) {
        setLead(foundLead);
        trackEvent({
          feature: 'lead_workspace',
          action: 'open',
          context: `lead_${leadId}`,
          metadata: { leadScore: foundLead.score, priority: foundLead.priority }
        });
      } else {
        toast.error('Lead not found');
        navigate('/leads');
      }
    }
  }, [leadId, navigate, trackEvent]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackEvent({
      feature: 'lead_workspace_tab',
      action: 'change',
      context: tab,
      metadata: { leadId }
    });
  };

  const handleQuickAction = (action: string) => {
    trackEvent({
      feature: 'lead_workspace_quick_action',
      action: action,
      context: 'workspace',
      metadata: { leadId }
    });

    switch (action) {
      case 'call':
        toast.success(`Initiating call to ${lead?.name}`);
        break;
      case 'email':
        setActiveTab('email');
        toast.success(`Opening email composer for ${lead?.name}`);
        break;
      case 'sms':
        setActiveTab('sms');
        toast.success(`Opening SMS for ${lead?.name}`);
        break;
      case 'meeting':
        setActiveTab('meetings');
        toast.success(`Opening meeting scheduler for ${lead?.name}`);
        break;
      default:
        break;
    }
  };

  if (!lead) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Loading lead...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Lead Snapshot */}
        <div className={`${leftCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 border-r bg-white flex-shrink-0`}>
          <LeadWorkspaceLeft 
            lead={lead}
            onQuickAction={handleQuickAction}
            collapsed={leftCollapsed}
            onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
          />
        </div>

        {/* Center Column - Main Content */}
        <div className="flex-1 flex flex-col">
          <LeadWorkspaceCenter
            lead={lead}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            aiSummaryEnabled={aiSummaryEnabled}
            onAiSummaryToggle={() => setAiSummaryEnabled(!aiSummaryEnabled)}
          />
        </div>

        {/* Right Column - AI & Actions */}
        <div className={`${rightCollapsed ? 'w-16' : 'w-96'} transition-all duration-300 border-l bg-white flex-shrink-0`}>
          <LeadWorkspaceRight
            lead={lead}
            activeTab={activeTab}
            collapsed={rightCollapsed}
            onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadWorkspace;
