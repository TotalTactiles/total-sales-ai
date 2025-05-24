
import { MockLead } from '@/data/mockData';
import { Lead } from '@/types/lead';

export const convertMockLeadToLead = (mockLead: MockLead): Lead => {
  return {
    id: mockLead.id,
    name: mockLead.name,
    company: mockLead.company,
    source: mockLead.source,
    score: mockLead.score,
    priority: mockLead.priority,
    lastContact: mockLead.last_contact ? new Date(mockLead.last_contact).toLocaleDateString() : undefined,
    email: mockLead.email,
    phone: mockLead.phone,
    status: mockLead.status,
    tags: mockLead.tags,
    isSensitive: mockLead.is_sensitive,
    conversionLikelihood: mockLead.conversion_likelihood,
    speedToLead: mockLead.speed_to_lead,
    created_at: mockLead.created_at,
    updated_at: mockLead.updated_at
  };
};
