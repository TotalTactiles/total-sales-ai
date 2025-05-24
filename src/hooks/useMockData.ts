
import { useState, useEffect } from 'react';
import { 
  mockLeads, 
  mockActivities, 
  mockCalls, 
  mockImportSessions,
  mockAIInsights,
  mockEmailTemplates,
  mockKnowledgeBase,
  type MockLead,
  type MockActivity,
  type MockCall
} from '@/data/mockData';
import { toast } from 'sonner';

export const useMockData = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [activities, setActivities] = useState(mockActivities);
  const [calls, setCalls] = useState(mockCalls);
  const [importSessions] = useState(mockImportSessions);
  const [aiInsights] = useState(mockAIInsights);
  const [emailTemplates] = useState(mockEmailTemplates);
  const [knowledgeBase] = useState(mockKnowledgeBase);

  const getLeadById = (id: string): MockLead | undefined => {
    return leads.find(lead => lead.id === id);
  };

  const getActivitiesForLead = (leadId: string): MockActivity[] => {
    return activities.filter(activity => activity.leadId === leadId);
  };

  const getCallsForLead = (leadId: string): MockCall[] => {
    return calls.filter(call => call.leadId === leadId);
  };

  const getLeadsByStatus = (status: string) => {
    if (status === 'all') return leads;
    return leads.filter(lead => lead.status === status);
  };

  const getHighPriorityLeads = () => {
    return leads.filter(lead => lead.priority === 'high' && lead.status !== 'closed');
  };

  const getRecentActivities = (limit = 10) => {
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  };

  const getLeadMetrics = () => {
    const total = leads.length;
    const qualified = leads.filter(l => l.status === 'qualified').length;
    const closed = leads.filter(l => l.status === 'closed').length;
    const avgScore = Math.round(leads.reduce((sum, l) => sum + l.score, 0) / total);
    const avgConversion = Math.round(leads.reduce((sum, l) => sum + l.conversion_likelihood, 0) / total);

    return {
      total,
      qualified,
      closed,
      conversionRate: Math.round((closed / total) * 100),
      avgScore,
      avgConversion,
      highPriority: leads.filter(l => l.priority === 'high' && l.status !== 'closed').length
    };
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
    setActivities(prev => prev.filter(activity => activity.leadId !== id));
    setCalls(prev => prev.filter(call => call.leadId !== id));
    toast.success('Mock lead deleted successfully');
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    toast.success('Mock activity deleted successfully');
  };

  const deleteCall = (id: string) => {
    setCalls(prev => prev.filter(call => call.id !== id));
    toast.success('Mock call deleted successfully');
  };

  const clearAllMockData = () => {
    setLeads([]);
    setActivities([]);
    setCalls([]);
    toast.success('All mock data cleared successfully');
  };

  const resetMockData = () => {
    setLeads(mockLeads);
    setActivities(mockActivities);
    setCalls(mockCalls);
    toast.success('Mock data reset to original state');
  };

  return {
    leads,
    activities,
    calls,
    importSessions,
    aiInsights,
    emailTemplates,
    knowledgeBase,
    getLeadById,
    getActivitiesForLead,
    getCallsForLead,
    getLeadsByStatus,
    getHighPriorityLeads,
    getRecentActivities,
    getLeadMetrics,
    deleteLead,
    deleteActivity,
    deleteCall,
    clearAllMockData,
    resetMockData
  };
};
