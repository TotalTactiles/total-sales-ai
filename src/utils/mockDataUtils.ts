
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
    lastContact: mockLead.lastContact ? new Date(mockLead.lastContact).toLocaleDateString() : '',
    email: mockLead.email,
    phone: mockLead.phone,
    status: mockLead.status,
    tags: mockLead.tags,
    isSensitive: mockLead.isSensitive || false,
    conversionLikelihood: mockLead.conversionLikelihood || 0,
    speedToLead: mockLead.speedToLead || 0,
    notes: mockLead.notes || '',
    value: mockLead.value || 0
  };
};
