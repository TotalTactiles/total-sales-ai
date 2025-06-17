
import { Lead } from '@/types/lead';

interface MockLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  priority: string;
  source: string;
  score: number;
  conversionLikelihood: number;
  lastContact: string;
  speedToLead?: number; // Made optional to match mock data
  tags: string[];
  createdAt: string;
  updatedAt: string;
  companyId: string;
  isSensitive: boolean;
  // Optional properties that might be missing
  notes?: string;
  value?: number;
  sentiment?: string;
  objection?: string;
  doNotCall?: boolean;
}

export const convertMockLeadToLead = (mockLead: MockLead): Lead => {
  return {
    id: mockLead.id,
    name: mockLead.name,
    email: mockLead.email,
    phone: mockLead.phone,
    company: mockLead.company,
    status: mockLead.status as Lead['status'],
    priority: mockLead.priority as Lead['priority'],
    source: mockLead.source,
    score: mockLead.score,
    conversionLikelihood: mockLead.conversionLikelihood,
    lastContact: mockLead.lastContact,
    speedToLead: mockLead.speedToLead || 0, // Provide default value if missing
    tags: mockLead.tags,
    createdAt: mockLead.createdAt,
    updatedAt: mockLead.updatedAt,
    companyId: mockLead.companyId,
    isSensitive: mockLead.isSensitive,
    notes: mockLead.notes || '',
    value: mockLead.value || 0,
    sentiment: mockLead.sentiment || 'neutral',
    objection: mockLead.objection || '',
    doNotCall: mockLead.doNotCall || false
  };
};
