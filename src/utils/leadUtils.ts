
import { Lead } from '@/types/lead';

export interface DatabaseLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  priority?: string;
  source?: string;
  score?: number;
  conversion_likelihood?: number;
  last_contact?: string;
  speed_to_lead?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  company_id?: string;
  is_sensitive?: boolean;
}

export const convertDatabaseLeadToLead = (dbLead: DatabaseLead): Lead => {
  return {
    id: dbLead.id,
    name: dbLead.name,
    email: dbLead.email || '',
    phone: dbLead.phone || '',
    company: dbLead.company || '',
    status: dbLead.status as Lead['status'] || 'new',
    priority: dbLead.priority as Lead['priority'] || 'medium',
    source: dbLead.source || 'unknown',
    score: dbLead.score || 0,
    conversionLikelihood: dbLead.conversion_likelihood || 0,
    lastContact: dbLead.last_contact || 'Never',
    speedToLead: dbLead.speed_to_lead || 0,
    tags: dbLead.tags || [],
    createdAt: dbLead.created_at || new Date().toISOString(),
    updatedAt: dbLead.updated_at || new Date().toISOString(),
    companyId: dbLead.company_id || '',
    isSensitive: dbLead.is_sensitive || false
  };
};

export const convertLeadToDatabase = (lead: Lead): Partial<DatabaseLead> => {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    status: lead.status,
    priority: lead.priority,
    source: lead.source,
    score: lead.score,
    conversion_likelihood: lead.conversionLikelihood,
    last_contact: lead.lastContact === 'Never' ? null : lead.lastContact,
    speed_to_lead: lead.speedToLead,
    tags: lead.tags,
    updated_at: new Date().toISOString(),
    is_sensitive: lead.isSensitive
  };
};

export const calculateLeadScore = (lead: Lead): number => {
  let score = 0;
  
  // Email engagement
  if (lead.email) score += 10;
  
  // Phone availability
  if (lead.phone) score += 15;
  
  // Company information
  if (lead.company) score += 20;
  
  // Recent contact
  if (lead.lastContact && lead.lastContact !== 'Never') {
    const lastContactDate = new Date(lead.lastContact);
    const daysSince = Math.floor((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 7) score += 25;
    else if (daysSince < 30) score += 15;
    else if (daysSince < 90) score += 5;
  }
  
  // Speed to lead
  if (lead.speedToLead < 5) score += 30;
  else if (lead.speedToLead < 60) score += 20;
  else if (lead.speedToLead < 1440) score += 10;
  
  // Priority multiplier
  switch (lead.priority) {
    case 'high':
      score *= 1.3;
      break;
    case 'medium':
      score *= 1.1;
      break;
    case 'low':
      score *= 0.9;
      break;
  }
  
  return Math.min(Math.round(score), 100);
};
