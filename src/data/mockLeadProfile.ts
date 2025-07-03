
import { Lead } from '@/types/lead';

export const mockLeadProfile: Lead = {
  id: 'lead-001',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1-555-123-4567',
  company: 'TechCorp',
  status: 'qualified',
  priority: 'high',
  source: 'Website',
  score: 72,
  conversionLikelihood: 86,
  lastContact: '2025-06-28T10:00:00Z',
  speedToLead: 12,
  tags: ['enterprise', 'technical buyer'],
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-07-01T15:20:00Z',
  companyId: 'demo-company',
  isSensitive: false,
  value: 64589,
  notes: 'Very interested in our enterprise solution. Technical buyer with decision-making authority.',
  sentiment: 'positive',
  objection: 'Price concerns',
  doNotCall: false,
  // Required new properties
  lastActivity: 'Opened proposal twice',
  aiPriority: 'high',
  nextAction: 'Follow up with email by Friday',
  lastAIInsight: 'Proposal opened twice, but no reply – follow up recommended'
};
