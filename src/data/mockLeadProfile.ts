
export const mockLeadProfile = {
  id: 'mock-profile-1',
  name: 'John Smith',
  email: 'john.smith@techcorp.com',
  phone: '+1-555-0123',
  company: 'TechCorp Solutions',
  title: 'VP of Sales',
  status: 'qualified' as const,
  priority: 'high' as const,
  source: 'LinkedIn',
  score: 85,
  conversionLikelihood: 78,
  lastContact: '2024-01-15T10:00:00Z',
  speedToLead: 5,
  tags: ['enterprise', 'hot lead', 'decision maker'],
  createdAt: '2024-01-10T09:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  companyId: 'demo-company',
  isSensitive: false,
  sentiment: 'positive',
  objection: 'Budget concerns',
  doNotCall: false,
  notes: 'Very interested in our enterprise solution. Has budget approved for Q1. Key decision maker for the team.',
  value: 75000,
  
  // Extended profile information
  industry: 'Technology',
  employeeCount: 500,
  location: 'San Francisco, CA',
  timezone: 'PST',
  socialProfiles: {
    linkedin: 'https://linkedin.com/in/johnsmith',
    twitter: 'https://twitter.com/johnsmith'
  },
  customFields: {
    currentSolution: 'Salesforce',
    painPoints: ['Integration issues', 'High costs', 'Poor user adoption'],
    decisionCriteria: ['ROI', 'Ease of use', 'Integration capabilities'],
    budget: '$50,000 - $100,000',
    timeline: 'Q1 2024'
  },
  
  // Activity history
  recentActivities: [
    {
      id: 'activity-1',
      type: 'call',
      title: 'Discovery Call',
      description: 'Initial discovery call - very positive response',
      timestamp: '2024-01-15T10:00:00Z',
      duration: 45,
      outcome: 'positive'
    },
    {
      id: 'activity-2',
      type: 'email',
      title: 'Follow-up Email',
      description: 'Sent pricing information and next steps',
      timestamp: '2024-01-12T14:00:00Z',
      outcome: 'positive'
    },
    {
      id: 'activity-3',
      type: 'meeting',
      title: 'Demo Scheduled',
      description: 'Scheduled product demo for next week',
      timestamp: '2024-01-10T16:00:00Z',
      outcome: 'positive'
    }
  ],
  
  // Call history
  callHistory: [
    {
      id: 'call-1',
      type: 'outbound',
      status: 'completed',
      duration: 2700, // 45 minutes
      timestamp: '2024-01-15T10:00:00Z',
      notes: 'Excellent discovery call. John is very interested in our solution.',
      sentiment: 'positive',
      aiInsights: {
        summary: 'Lead is highly qualified and ready to move forward',
        keyPoints: ['Budget approved', 'Timeline: Q1 2024', 'Decision maker'],
        riskFactors: ['Currently evaluating competitors'],
        recommendations: ['Send proposal ASAP', 'Schedule technical demo']
      }
    }
  ]
};
