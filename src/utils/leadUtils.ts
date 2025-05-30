
import { DatabaseLead } from '@/hooks/useLeads';
import { Lead } from '@/types/lead';

export const convertDatabaseLeadToLead = (dbLead: DatabaseLead): Lead => {
  return {
    id: dbLead.id,
    name: dbLead.name,
    company: dbLead.company || '',
    source: dbLead.source || 'Unknown',
    score: dbLead.score,
    priority: dbLead.priority as 'high' | 'medium' | 'low',
    lastContact: dbLead.last_contact ? new Date(dbLead.last_contact).toLocaleDateString() : '',
    email: dbLead.email || '',
    phone: dbLead.phone || '',
    status: dbLead.status as 'new' | 'contacted' | 'qualified' | 'closed',
    tags: dbLead.tags,
    isSensitive: dbLead.is_sensitive,
    conversionLikelihood: dbLead.conversion_likelihood,
    speedToLead: dbLead.speed_to_lead,
    notes: dbLead.notes || '',
    value: dbLead.value || 0
  };
};

export const convertLeadToDatabaseLead = (lead: Partial<Lead>): Partial<DatabaseLead> => {
  return {
    name: lead.name || '',
    company: lead.company,
    source: lead.source,
    score: lead.score || 0,
    priority: lead.priority || 'medium',
    last_contact: lead.lastContact ? new Date(lead.lastContact).toISOString() : undefined,
    email: lead.email,
    phone: lead.phone,
    status: lead.status || 'new',
    tags: lead.tags || [],
    is_sensitive: lead.isSensitive || false,
    conversion_likelihood: lead.conversionLikelihood || 0,
    speed_to_lead: lead.speedToLead || 0,
    notes: lead.notes || '',
    value: lead.value || 0
  };
};
