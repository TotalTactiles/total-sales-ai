
import { Lead } from '@/types/lead';
import { DatabaseLead } from '@/hooks/useLeads';
import { DEMO_CONFIG } from '@/config/constants';
import { AppErrorHandler, ERROR_CODES } from './errorHandler';

export const convertDatabaseLeadToLead = (dbLead: DatabaseLead): Lead => {
  try {
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
      companyId: dbLead.company_id || DEMO_CONFIG.companyId
    };
  } catch (error) {
    throw AppErrorHandler.createError(
      'Failed to convert database lead',
      ERROR_CODES.VALIDATION_ERROR,
      { dbLead, error }
    );
  }
};

export const convertLeadToDatabaseLead = (lead: Lead): DatabaseLead => {
  try {
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
      company_id: lead.companyId || DEMO_CONFIG.companyId,
      last_contact: lead.lastContact || '',
      conversion_likelihood: lead.conversionLikelihood || 0,
      speed_to_lead: lead.speedToLead || 0,
      is_sensitive: lead.isSensitive || false,
      notes: lead.notes || '',
      value: lead.value || 0,
      created_at: lead.createdAt || new Date().toISOString(),
      updated_at: lead.updatedAt || new Date().toISOString()
    };
  } catch (error) {
    throw AppErrorHandler.createError(
      'Failed to convert lead to database format',
      ERROR_CODES.VALIDATION_ERROR,
      { lead, error }
    );
  }
};

export const validateLeadData = (lead: Partial<Lead>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!lead.name?.trim()) {
    errors.push('Lead name is required');
  }
  
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    errors.push('Invalid email format');
  }
  
  if (lead.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(lead.phone)) {
    errors.push('Invalid phone format');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const getLeadPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getLeadStatusColor = (status: string): string => {
  switch (status) {
    case 'new': return 'bg-blue-500';
    case 'contacted': return 'bg-yellow-500';
    case 'qualified': return 'bg-green-500';
    case 'proposal': return 'bg-purple-500';
    case 'negotiation': return 'bg-orange-500';
    case 'closed_won': return 'bg-emerald-500';
    case 'closed_lost': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};
