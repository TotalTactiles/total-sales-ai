
// Mock data for demonstrations across all workspaces
export interface MockLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  priority: 'high' | 'medium' | 'low';
  score: number;
  conversion_likelihood: number;
  speed_to_lead: number;
  last_contact?: string;
  tags: string[];
  is_sensitive: boolean;
  industry: string;
  annual_revenue?: string;
  employee_count?: string;
}

export interface MockActivity {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'sms' | 'meeting' | 'note';
  title: string;
  description: string;
  timestamp: string;
  duration?: number;
  outcome?: string;
  nextAction?: string;
}

export interface MockCall {
  id: string;
  leadId: string;
  duration: number;
  timestamp: string;
  outcome: 'connected' | 'voicemail' | 'busy' | 'no_answer';
  notes: string;
  nextAction: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export const mockLeads: MockLead[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Industries',
    position: 'VP of Operations',
    source: 'LinkedIn Outreach',
    status: 'qualified',
    priority: 'high',
    score: 85,
    conversion_likelihood: 78,
    speed_to_lead: 2,
    last_contact: '2024-01-20T14:30:00Z',
    tags: ['Enterprise', 'Decision Maker', 'Budget Approved'],
    is_sensitive: false,
    industry: 'Technology',
    annual_revenue: '$50M - $100M',
    employee_count: '200-500'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'mrodriguez@manufacturing.com',
    phone: '+1 (555) 234-5678',
    company: 'Precision Manufacturing Co',
    position: 'Operations Director',
    source: 'Trade Show',
    status: 'contacted',
    priority: 'high',
    score: 72,
    conversion_likelihood: 65,
    speed_to_lead: 1,
    last_contact: '2024-01-18T10:15:00Z',
    tags: ['Manufacturing', 'ROI Focused', 'Q1 Timeline'],
    is_sensitive: false,
    industry: 'Manufacturing',
    annual_revenue: '$25M - $50M',
    employee_count: '100-200'
  },
  {
    id: '3',
    name: 'Jennifer Park',
    email: 'j.park@healthsolutions.com',
    phone: '+1 (555) 345-6789',
    company: 'HealthTech Solutions',
    position: 'Chief Information Officer',
    source: 'Referral',
    status: 'new',
    priority: 'medium',
    score: 68,
    conversion_likelihood: 55,
    speed_to_lead: 0,
    tags: ['Healthcare', 'Compliance Focused', 'New Contact'],
    is_sensitive: true,
    industry: 'Healthcare',
    annual_revenue: '$10M - $25M',
    employee_count: '50-100'
  },
  {
    id: '4',
    name: 'David Thompson',
    email: 'dthompson@retailchain.com',
    phone: '+1 (555) 456-7890',
    company: 'RetailChain Plus',
    position: 'IT Manager',
    source: 'Website Form',
    status: 'contacted',
    priority: 'medium',
    score: 45,
    conversion_likelihood: 35,
    speed_to_lead: 3,
    last_contact: '2024-01-15T16:45:00Z',
    tags: ['Retail', 'Price Sensitive', 'Multiple Vendors'],
    is_sensitive: false,
    industry: 'Retail',
    annual_revenue: '$5M - $10M',
    employee_count: '25-50'
  },
  {
    id: '5',
    name: 'Amanda Foster',
    email: 'afoster@financegroup.com',
    phone: '+1 (555) 567-8901',
    company: 'Foster Financial Group',
    position: 'Partner',
    source: 'Cold Email',
    status: 'closed',
    priority: 'low',
    score: 92,
    conversion_likelihood: 95,
    speed_to_lead: 1,
    last_contact: '2024-01-10T11:20:00Z',
    tags: ['Financial Services', 'Closed Won', 'Reference Customer'],
    is_sensitive: true,
    industry: 'Financial Services',
    annual_revenue: '$100M+',
    employee_count: '500+'
  }
];

export const mockActivities: MockActivity[] = [
  {
    id: 'act1',
    leadId: '1',
    type: 'call',
    title: 'Discovery Call Completed',
    description: 'Discussed current challenges with manual processes. Sarah mentioned they lose 20+ hours weekly on data entry. Strong interest in automation. Budget approved for Q1.',
    timestamp: '2024-01-20T14:30:00Z',
    duration: 45,
    outcome: 'positive',
    nextAction: 'Send ROI calculator and case studies'
  },
  {
    id: 'act2',
    leadId: '1',
    type: 'email',
    title: 'ROI Calculator Sent',
    description: 'Forwarded detailed ROI calculator showing potential $125K annual savings. Included 3 similar company case studies.',
    timestamp: '2024-01-20T15:15:00Z',
    nextAction: 'Follow up on calculator review'
  },
  {
    id: 'act3',
    leadId: '2',
    type: 'meeting',
    title: 'Product Demo Scheduled',
    description: 'Set up comprehensive product demo for Tuesday 2 PM EST. Michael wants to see automation workflows and reporting capabilities.',
    timestamp: '2024-01-18T10:15:00Z',
    nextAction: 'Prepare custom demo focusing on manufacturing use cases'
  },
  {
    id: 'act4',
    leadId: '2',
    type: 'sms',
    title: 'Demo Reminder Sent',
    description: 'Sent SMS reminder for upcoming demo with calendar link and prep materials.',
    timestamp: '2024-01-19T09:00:00Z'
  },
  {
    id: 'act5',
    leadId: '3',
    type: 'email',
    title: 'Initial Outreach',
    description: 'Sent personalized intro email highlighting healthcare compliance features and HIPAA readiness.',
    timestamp: '2024-01-21T08:30:00Z',
    nextAction: 'Follow up in 2 days if no response'
  }
];

export const mockCalls: MockCall[] = [
  {
    id: 'call1',
    leadId: '1',
    duration: 2700, // 45 minutes
    timestamp: '2024-01-20T14:30:00Z',
    outcome: 'connected',
    notes: 'Excellent discovery call. Sarah is the decision maker with approved budget. Main pain: 20+ hours weekly on manual data entry. Strong ROI potential. Ready to move forward in Q1.',
    nextAction: 'Send ROI calculator within 24 hours',
    sentiment: 'positive'
  },
  {
    id: 'call2',
    leadId: '2',
    duration: 1200, // 20 minutes
    timestamp: '2024-01-18T10:15:00Z',
    outcome: 'connected',
    notes: 'Good initial conversation. Michael interested in automation for manufacturing processes. Wants to see demo before making decision. Competitive situation with 2 other vendors.',
    nextAction: 'Schedule product demo ASAP',
    sentiment: 'neutral'
  },
  {
    id: 'call3',
    leadId: '4',
    duration: 0,
    timestamp: '2024-01-15T16:45:00Z',
    outcome: 'voicemail',
    notes: 'Left detailed voicemail about retail-specific features. Mentioned case study from similar retailer.',
    nextAction: 'Follow up with email and case study',
    sentiment: 'neutral'
  }
];

export const mockImportSessions = [
  {
    id: 'import1',
    fileName: 'Q4_Leads_TechCorp.csv',
    status: 'completed',
    totalRecords: 247,
    successfulImports: 231,
    failedImports: 16,
    duplicatesFound: 12,
    timestamp: '2024-01-15T10:30:00Z',
    source: 'Trade Show'
  },
  {
    id: 'import2',
    fileName: 'LinkedIn_Prospects_Jan.csv',
    status: 'completed',
    totalRecords: 156,
    successfulImports: 142,
    failedImports: 14,
    duplicatesFound: 8,
    timestamp: '2024-01-10T14:20:00Z',
    source: 'LinkedIn Campaign'
  },
  {
    id: 'import3',
    fileName: 'Website_Leads_December.csv',
    status: 'in_progress',
    totalRecords: 89,
    successfulImports: 67,
    failedImports: 3,
    duplicatesFound: 5,
    timestamp: '2024-01-21T09:15:00Z',
    source: 'Website Forms'
  }
];

export const mockAIInsights = [
  {
    id: 'insight1',
    type: 'opportunity',
    title: 'High-Value Lead Ready for Demo',
    description: 'Sarah Chen from TechCorp shows 85% conversion likelihood. Budget approved, timeline confirmed. Recommend immediate demo scheduling.',
    confidence: 92,
    action: 'Schedule demo',
    timestamp: '2024-01-20T15:30:00Z'
  },
  {
    id: 'insight2',
    type: 'warning',
    title: 'Lead Going Cold',
    description: 'David Thompson hasn\'t responded in 6 days. Consider different approach or re-engagement campaign.',
    confidence: 78,
    action: 'Send re-engagement sequence',
    timestamp: '2024-01-21T08:00:00Z'
  },
  {
    id: 'insight3',
    type: 'recommendation',
    title: 'Optimal Contact Time Detected',
    description: 'Jennifer Park opens emails consistently at 8:30 AM EST. Schedule follow-up accordingly.',
    confidence: 85,
    action: 'Schedule 8:30 AM follow-up',
    timestamp: '2024-01-21T09:00:00Z'
  }
];

export const mockEmailTemplates = [
  {
    id: 'template1',
    name: 'Initial Outreach - Enterprise',
    subject: 'Reducing {{company}} operational costs by 40%',
    body: `Hi {{firstName}},

I noticed {{company}} is in rapid growth mode - congratulations! 

Companies like yours typically face challenges with manual processes eating up valuable time. We've helped similar {{industry}} companies reduce operational costs by 40% while improving accuracy.

{{companyName}} recently saved $250K annually after implementing our solution. I'd love to show you how we could deliver similar results for {{company}}.

Are you available for a brief 15-minute call this week?

Best,
{{senderName}}`,
    category: 'outreach',
    industry: 'enterprise'
  },
  {
    id: 'template2',
    name: 'Follow-up After Demo',
    subject: 'Next steps for {{company}}',
    body: `Hi {{firstName}},

Thank you for the great demo session yesterday. I could see the excitement when we showed how our automation could eliminate those 20+ hours of weekly manual work.

Based on our conversation, I'm attaching:
• ROI calculator with {{company}}-specific numbers
• Case study from {{similarCompany}}
• Implementation timeline for Q1 start

The numbers show {{projectedSavings}} in year one savings. When would be a good time to discuss moving forward?

Best,
{{senderName}}`,
    category: 'follow-up',
    industry: 'general'
  }
];

export const mockKnowledgeBase = [
  {
    id: 'kb1',
    title: 'Healthcare Compliance Guide',
    content: 'Complete guide to HIPAA compliance and healthcare data security requirements...',
    category: 'compliance',
    industry: 'healthcare',
    lastUpdated: '2024-01-15T10:00:00Z',
    usage: 23
  },
  {
    id: 'kb2',
    title: 'Manufacturing ROI Calculator',
    content: 'Interactive calculator for manufacturing efficiency gains and cost savings...',
    category: 'sales-tools',
    industry: 'manufacturing',
    lastUpdated: '2024-01-10T14:30:00Z',
    usage: 45
  },
  {
    id: 'kb3',
    title: 'Competitive Battle Cards',
    content: 'How to position against major competitors including key differentiators...',
    category: 'competitive',
    industry: 'general',
    lastUpdated: '2024-01-18T09:15:00Z',
    usage: 67
  }
];
