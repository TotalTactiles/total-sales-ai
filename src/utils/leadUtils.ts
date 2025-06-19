
import { Lead } from '@/types/lead';
import { DatabaseLead } from '@/hooks/useLeads';

export const convertDatabaseLeadToLead = (dbLead: DatabaseLead): Lead => {
  return {
    id: dbLead.id,
    name: dbLead.name,
    email: dbLead.email || '',
    phone: dbLead.phone || '',
    company: dbLead.company || '',
    source: dbLead.source || 'Unknown',
    status: (dbLead.status as Lead['status']) || 'new',
    priority: (dbLead.priority as Lead['priority']) || 'medium',
    score: dbLead.score || 0,
    tags: dbLead.tags || [],
    lastContact: dbLead.last_contact || '',
    conversionLikelihood: dbLead.conversion_likelihood || 0,
    speedToLead: dbLead.speed_to_lead || 0,
    isSensitive: dbLead.is_sensitive || false,
    notes: dbLead.notes || '',
    value: dbLead.value || 0,
    createdAt: dbLead.created_at || new Date().toISOString(),
    updatedAt: dbLead.updated_at || new Date().toISOString(),
    companyId: dbLead.company_id || 'demo-company'
  };
};

export const convertLeadToDatabaseLead = (lead: Lead): DatabaseLead => {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email || '',
    phone: lead.phone || '',
    company: lead.company || '',
    source: lead.source || 'Unknown',
    status: lead.status || 'new',
    priority: lead.priority || 'medium',
    score: lead.score || 0,
    tags: lead.tags || [],
    company_id: lead.companyId || 'demo-company',
    last_contact: lead.lastContact || '',
    conversion_likelihood: lead.conversionLikelihood || 0,
    speed_to_lead: lead.speedToLead || 0,
    is_sensitive: lead.isSensitive || false,
    notes: lead.notes || '',
    value: lead.value || 0,
    created_at: lead.createdAt || new Date().toISOString(),
    updated_at: lead.updatedAt || new Date().toISOString()
  };
};
