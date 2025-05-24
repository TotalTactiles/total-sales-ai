
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import LeadWorkspaceLeft from '@/components/LeadWorkspace/LeadWorkspaceLeft';
import LeadWorkspaceCenter from '@/components/LeadWorkspace/LeadWorkspaceCenter';
import LeadWorkspaceRight from '@/components/LeadWorkspace/LeadWorkspaceRight';
import DemoModeIndicator from '@/components/Demo/DemoModeIndicator';
import WorkspaceShowcase from '@/components/Demo/WorkspaceShowcase';
import { useLeads } from '@/hooks/useLeads';
import { useMockData } from '@/hooks/useMockData';
import { toast } from 'sonner';

const LeadWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [aiSummaryEnabled, setAiSummaryEnabled] = useState(true);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const { leads } = useLeads();
  const { getLeadById } = useMockData();

  // Try to find lead in real data first, then mock data
  const realLead = leads?.find(lead => lead.id === id);
  const mockLead = getLeadById(id || '1'); // Default to first mock lead
  const lead = realLead || mockLead;
  const hasRealData = !!realLead;

  useEffect(() => {
    // If no ID provided and we have mock data, redirect to first mock lead
    if (!id && mockLead) {
      navigate(`/workspace/${mockLead.id}`, { replace: true });
    }
  }, [id, mockLead, navigate]);

  const handleQuickAction = (action: string) => {
    if (!lead) return;
    
    switch (action) {
      case 'call':
        toast.success(`Initiating call to ${lead.name}`);
        setActiveTab('call');
        break;
      case 'email':
        toast.success(`Opening email composer for ${lead.name}`);
        setActiveTab('email');
        break;
      case 'sms':
        toast.success(`Opening SMS for ${lead.name}`);
        setActiveTab('sms');
        break;
      case 'meeting':
        toast.success(`Scheduling meeting with ${lead.name}`);
        setActiveTab('meetings');
        break;
      default:
        console.log('Quick action:', action);
    }
  };

  const handleStartDemo = () => {
    setShowDemo(true);
    if (mockLead) {
      navigate(`/workspace/${mockLead.id}`);
    }
    toast.success('Demo mode activated! Explore the full lead workspace experience.');
  };

  // Show workspace showcase if no real data and demo not started
  if (!hasRealData && !showDemo && !lead) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto py-12">
            <WorkspaceShowcase 
              workspace="Lead Workspace" 
              onStartDemo={handleStartDemo}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Lead not found</h2>
            <p className="text-slate-600 mb-4">The lead you're looking for doesn't exist.</p>
            <button 
              onClick={() => navigate('/leads')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Lead Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Convert mock lead to database lead format for components
  const dbLead = realLead || {
    id: lead.id,
    company_id: 'demo-company',
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company || '',
    source: lead.source || '',
    status: lead.status,
    priority: lead.priority,
    score: lead.score,
    tags: lead.tags || [],
    last_contact: lead.last_contact,
    conversion_likelihood: lead.conversion_likelihood,
    speed_to_lead: lead.speed_to_lead,
    is_sensitive: lead.is_sensitive,
    created_at: lead.created_at || new Date().toISOString(),
    updated_at: lead.updated_at || new Date().toISOString()
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className={`bg-white border-r transition-all duration-300 ${
          leftCollapsed ? 'w-16' : 'w-80'
        }`}>
          <LeadWorkspaceLeft
            lead={dbLead}
            onQuickAction={handleQuickAction}
            collapsed={leftCollapsed}
            onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
          />
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Demo Mode Indicator */}
          {!hasRealData && (
            <div className="p-4 pb-0">
              <DemoModeIndicator workspace="Lead Workspace" />
            </div>
          )}
          
          <LeadWorkspaceCenter
            lead={dbLead}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            aiSummaryEnabled={aiSummaryEnabled}
            onAiSummaryToggle={() => setAiSummaryEnabled(!aiSummaryEnabled)}
          />
        </div>

        {/* Right Sidebar */}
        <div className={`bg-white border-l transition-all duration-300 ${
          rightCollapsed ? 'w-16' : 'w-80'
        }`}>
          <LeadWorkspaceRight
            lead={dbLead}
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
