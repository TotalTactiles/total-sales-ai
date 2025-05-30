
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';
import { useLeads } from '@/hooks/useLeads';
import { Lead, MockLead } from '@/types/lead';
import { DatabaseLead } from '@/hooks/useLeads';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';
import LeadWorkspaceLeft from '@/components/LeadWorkspace/LeadWorkspaceLeft';
import LeadWorkspaceCenter from '@/components/LeadWorkspace/LeadWorkspaceCenter';
import LeadWorkspaceRight from '@/components/LeadWorkspace/LeadWorkspaceRight';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const LeadWorkspace: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const { isDemoMode } = useAuth();
  const { getLeadById: getMockLead } = useMockData();
  const { leads: databaseLeads } = useLeads();
  
  const [activeTab, setActiveTab] = useState('overview');

  // Find the lead from either mock data or database
  const lead: Lead | null = useMemo(() => {
    if (!leadId) return null;

    const isDemo = isDemoMode();
    
    if (isDemo) {
      const mockLead = getMockLead(leadId);
      return mockLead ? convertMockLeadToLead(mockLead) : null;
    }

    // If not in demo mode, try to find from database leads
    if (databaseLeads && databaseLeads.length > 0) {
      const dbLead = databaseLeads.find((l) => l.id === leadId);
      return dbLead ? convertDatabaseLeadToLead(dbLead) : null;
    }

    // Fallback to mock data if no database leads
    const mockLead = getMockLead(leadId);
    return mockLead ? convertMockLeadToLead(mockLead) : null;
  }, [leadId, isDemoMode, getMockLead, databaseLeads]);

  if (!leadId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Lead Selected</h2>
          <p className="text-gray-600">Please select a lead from the Lead Management page.</p>
        </Card>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lead Not Found</h2>
          <p className="text-gray-600">The requested lead could not be found.</p>
        </Card>
      </div>
    );
  }

  // Handle different lead types safely
  const getLeadProperty = (property: string) => {
    const leadData = lead as any;
    
    switch (property) {
      case 'lastContact':
        return leadData.lastContact || leadData.last_contact || '';
      case 'conversionLikelihood':
        return leadData.conversionLikelihood || leadData.conversion_likelihood || 0;
      case 'speedToLead':
        return leadData.speedToLead || leadData.speed_to_lead || 0;
      case 'isSensitive':
        return leadData.isSensitive ?? leadData.is_sensitive ?? false;
      case 'createdAt':
        return leadData.createdAt || leadData.created_at || '';
      case 'updatedAt':
        return leadData.updatedAt || leadData.updated_at || '';
      default:
        return leadData[property];
    }
  };

  // Convert Lead to DatabaseLead format for components that expect it
  const leadAsDbLead: DatabaseLead = lead ? {
    id: lead.id,
    name: lead.name,
    email: lead.email || '',
    phone: lead.phone || '',
    company: lead.company || '',
    source: lead.source || '',
    status: lead.status,
    priority: lead.priority,
    score: lead.score,
    tags: lead.tags || [],
    company_id: 'demo-company',
    last_contact: lead.lastContact || lead.last_contact || '',
    conversion_likelihood: lead.conversionLikelihood || lead.conversion_likelihood || 0,
    speed_to_lead: lead.speedToLead || lead.speed_to_lead || 0,
    is_sensitive: lead.isSensitive || lead.is_sensitive || false,
    notes: lead.notes || '',
    value: lead.value || 0,
    created_at: lead.created_at || new Date().toISOString(),
    updated_at: lead.updated_at || new Date().toISOString()
  } : {
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    status: 'new',
    priority: 'medium',
    score: 0,
    tags: [],
    company_id: '',
    last_contact: '',
    conversion_likelihood: 0,
    speed_to_lead: 0,
    is_sensitive: false,
    notes: '',
    value: 0,
    created_at: '',
    updated_at: ''
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Left Sidebar - Lead Info & Actions */}
        <div className="w-80 border-r border-gray-200 bg-white">
          <LeadWorkspaceLeft 
            lead={leadAsDbLead} 
            onQuickAction={(action: string) => console.log('Quick action:', action)}
            collapsed={false}
            onToggleCollapse={() => {}}
          />
        </div>

        {/* Center Content - Main Workspace */}
        <div className="flex-1">
          <LeadWorkspaceCenter 
            lead={leadAsDbLead}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            aiSummaryEnabled={true}
            onAiSummaryToggle={() => {}}
          />
        </div>

        {/* Right Sidebar - AI Assistant & Tools */}
        <div className="w-80 border-l border-gray-200 bg-white">
          <LeadWorkspaceRight 
            lead={leadAsDbLead}
            activeTab={activeTab}
            collapsed={false}
            onToggleCollapse={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadWorkspace;
