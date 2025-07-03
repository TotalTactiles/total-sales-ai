
import { DatabaseLead } from '@/hooks/useLeads';
import { Lead } from '@/types/lead';

export const convertDatabaseLeadToLead = (dbLead: DatabaseLead): Lead => {
  return {
    id: dbLead.id,
    name: dbLead.name || 'Unknown',
    email: dbLead.email || '',
    phone: dbLead.phone || '',
    company: dbLead.company || '',
    source: dbLead.source || '',
    status: (dbLead.status as Lead['status']) || 'new',
    priority: (dbLead.priority as Lead['priority']) || 'medium',
    score: dbLead.score || 0,
    conversionLikelihood: dbLead.conversion_likelihood || 0,
    lastContact: dbLead.last_contact || '',
    speedToLead: dbLead.speed_to_lead || 0,
    tags: dbLead.tags || [],
    createdAt: dbLead.created_at || new Date().toISOString(),
    updatedAt: dbLead.updated_at || new Date().toISOString(),
    companyId: dbLead.company_id || '',
    isSensitive: dbLead.is_sensitive || false,
    notes: dbLead.notes || '',
    value: dbLead.value || 0,
    // Add required new properties with defaults
    lastActivity: 'Recent activity',
    aiPriority: 'Medium',
    nextAction: 'Follow up',
    lastAIInsight: 'AI analysis pending'
  };
};
