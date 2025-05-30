
import { useState, useEffect } from 'react';
import { Lead, MockLead } from '@/types/lead';

const generateMockLeads = (): Lead[] => {
  const companies = ['TechCorp', 'InnovateCo', 'GlobalSoft', 'DataDriven', 'CloudFirst', 'AIVentures'];
  const sources = ['Website', 'LinkedIn', 'Referral', 'Cold Outreach', 'Event', 'Partner'];
  const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation'];
  const priorities: Lead['priority'][] = ['low', 'medium', 'high'];

  return Array.from({ length: 25 }, (_, i) => ({
    id: `mock-lead-${i + 1}`,
    name: `Contact ${i + 1}`,
    email: `contact${i + 1}@${companies[i % companies.length].toLowerCase()}.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    company: companies[i % companies.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    score: Math.floor(Math.random() * 100),
    conversionLikelihood: Math.floor(Math.random() * 100),
    lastContact: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : 'Never',
    speedToLead: Math.floor(Math.random() * 1440), // minutes
    tags: ['Demo Lead', 'High Value', 'Enterprise'].slice(0, Math.floor(Math.random() * 3) + 1),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    companyId: 'demo-company',
    isSensitive: Math.random() > 0.8,
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    objection: ['Price concern', 'Needs approval', 'Current provider', 'No budget'][Math.floor(Math.random() * 4)],
    doNotCall: Math.random() > 0.9,
    notes: 'Demo lead with sample data',
    value: Math.floor(Math.random() * 100000) + 10000
  }));
};

export const useMockData = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLeads(generateMockLeads());
      setIsLoading(false);
    }, 500);
  }, []);

  const getLeadById = (id: string): MockLead | undefined => {
    return leads.find(lead => lead.id === id);
  };

  const getLeadMetrics = () => ({
    totalLeads: leads.length,
    highPriorityLeads: leads.filter(l => l.priority === 'high').length,
    conversionRate: Math.round(leads.reduce((acc, l) => acc + l.conversionLikelihood, 0) / leads.length)
  });

  const getHighPriorityLeads = () => leads.filter(l => l.priority === 'high').slice(0, 5);

  const getRecentActivities = () => leads
    .filter(l => l.lastContact !== 'Never')
    .sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime())
    .slice(0, 5)
    .map(l => ({
      id: l.id,
      type: 'contact',
      description: `Contacted ${l.name}`,
      timestamp: l.lastContact
    }));

  return {
    leads,
    isLoading,
    getLeadById,
    getLeadMetrics,
    getHighPriorityLeads,
    getRecentActivities
  };
};
