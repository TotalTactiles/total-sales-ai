
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
  speedToLead?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  companyId: string;
  isSensitive?: boolean;
  notes?: string;
  value?: number;
  sentiment?: string;
  objection?: string;
  doNotCall?: boolean;
  lastActivity?: string;
  aiPriority?: string;
  nextAction?: string;
  lastAIInsight?: string;
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
    speedToLead: mockLead.speedToLead || 0,
    tags: mockLead.tags,
    createdAt: mockLead.createdAt,
    updatedAt: mockLead.updatedAt,
    companyId: mockLead.companyId,
    isSensitive: mockLead.isSensitive || false,
    notes: mockLead.notes || '',
    value: mockLead.value || 0,
    sentiment: mockLead.sentiment || 'neutral',
    objection: mockLead.objection || '',
    doNotCall: mockLead.doNotCall || false,
    // Add required new properties with fallbacks
    lastActivity: mockLead.lastActivity || 'Recent activity',
    aiPriority: (mockLead.aiPriority as Lead['aiPriority']) || 'Medium',
    nextAction: mockLead.nextAction || 'Follow up',
    lastAIInsight: mockLead.lastAIInsight || 'AI analysis pending'
  };
};
