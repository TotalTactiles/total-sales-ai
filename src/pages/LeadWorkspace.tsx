
import { logger } from '@/utils/logger';

import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMockData } from '@/hooks/useMockData';
import { useLeads } from '@/hooks/useLeads';
import { Lead, MockLead } from '@/types/lead';
import { DatabaseLead } from '@/hooks/useLeads';
import { convertMockLeadToLead } from '@/utils/mockDataUtils';
import { convertDatabaseLeadToLead } from '@/utils/leadUtils';
import { mockLeadProfile } from '@/data/mockLeadProfile';
import LeadWorkspaceLeft from '@/components/LeadWorkspace/LeadWorkspaceLeft';
import LeadWorkspaceCenter from '@/components/LeadWorkspace/LeadWorkspaceCenter';
import LeadWorkspaceRight from '@/components/LeadWorkspace/LeadWorkspaceRight';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const LeadWorkspace: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { getLeadById: getMockLead } = useMockData();
  const { leads: databaseLeads } = useLeads();
  
  const [activeTab, setActiveTab] = useState('overview');

  logger.info('LeadWorkspace rendering with leadId:', leadId);

  // Find the lead from either mock data or database
  const lead: Lead | null = useMemo(() => {
    if (!leadId) {
      logger.info('No leadId provided');
      return null;
    }

    // Try to find from database leads first
    if (databaseLeads && databaseLeads.length > 0) {
      const dbLead = databaseLeads.find((l) => l.id === leadId);
      if (dbLead) {
        logger.info('Found database lead:', dbLead.name);
        return convertDatabaseLeadToLead(dbLead);
      }
    }

    // Fallback to mock profile for any lead when no database leads exist
    logger.info('Fallback to mock lead profile');
    return {
      ...mockLeadProfile,
      id: leadId
    };
  }, [leadId, databaseLeads]);

  const handleClose = () => {
    navigate('/lead-management');
  };

  if (!leadId || !lead) {
    // If no lead, redirect back to lead management
    navigate('/lead-management');
    return null;
  }

  // Convert Lead to DatabaseLead format for components that expect it
  const leadAsDbLead: DatabaseLead = {
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
    last_contact: lead.lastContact || '',
    conversion_likelihood: lead.conversionLikelihood || 0,
    speed_to_lead: lead.speedToLead || 0,
    is_sensitive: lead.isSensitive || false,
    notes: lead.notes || '',
    value: lead.value || 0,
    created_at: lead.createdAt || new Date().toISOString(),
    updated_at: lead.updatedAt || new Date().toISOString()
  };

  return (
    <>
      {/* Custom backdrop with blur effect */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Lead workspace overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-lg w-full max-w-[85vw] h-[85vh] overflow-hidden">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Scrollable content */}
          <div className="h-full overflow-y-auto">
            <div className="h-full flex bg-slate-50">
              {/* Left Sidebar - Lead Info & Actions */}
              <div className="w-80 border-r border-gray-200 bg-white">
                <LeadWorkspaceLeft 
                  lead={leadAsDbLead} 
                  onQuickAction={(action: string) => logger.info('Quick action:', action)}
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
        </div>
      </div>
    </>
  );
};

export default LeadWorkspace;
