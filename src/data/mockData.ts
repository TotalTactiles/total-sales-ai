// Base mock data types
export interface MockLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  status: 'qualified' | 'contacted' | 'new' | 'closed' | 'proposal' | 'negotiation';
  score: number;
  priority: 'high' | 'medium' | 'low';
  source: string;
  tags: string[];
  notes: string;
  lastContact: string;
  nextFollowUp?: string;
  value: number;
  conversionLikelihood: number;
  speedToLead?: number;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'very_positive';
  objection?: string;
  doNotCall?: boolean;
  isSensitive?: boolean;
  industry?: string;
  employeeCount?: number;
  location?: string;
  timezone?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
  };
  customFields?: {
    currentSolution?: string;
    painPoints?: string[];
    decisionCriteria?: string[];
    budget?: string;
    timeline?: string;
  };
}

export interface MockActivity {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'sms' | 'meeting' | 'note' | 'demo' | 'webinar';
  title: string;
  description: string;
  timestamp: string;
  duration?: number;
  outcome: 'positive' | 'neutral' | 'negative' | 'very_positive';
  nextAction?: string;
  recordingUrl?: string;
  participants?: string[];
  sentiment?: string;
  keyTopics?: string[];
  actionItems?: string[];
  emailSubject?: string;
  openRate?: boolean;
  clickRate?: boolean;
  attachments?: string[];
  presentationSlides?: string;
  keyDecisions?: string[];
  demoType?: string;
  featuresShown?: string[];
  questions?: string[];
  webinarTitle?: string;
  questionsAsked?: number;
  engagementScore?: number;
  downloadedResources?: string[];
}

export interface MockCall {
  id: string;
  leadId: string;
  type: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'busy' | 'no_answer';
  duration: number;
  timestamp: string;
  notes: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'very_positive';
  aiInsights?: {
    summary: string;
    keyPoints: string[];
    riskFactors: string[];
    recommendations: string[];
  };
}

// Basic mock data with consistent property names
export const mockLeads: MockLead[] = [
  {
    id: 'lead-1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+1-555-0123',
    company: 'Acme Corp',
    title: 'VP Sales',
    status: 'qualified',
    score: 85,
    priority: 'high',
    source: 'LinkedIn',
    tags: ['enterprise', 'hot'],
    notes: 'Very interested in our platform',
    lastContact: '2024-01-15T10:00:00Z',
    nextFollowUp: '2024-01-20T14:00:00Z',
    value: 50000,
    conversionLikelihood: 80,
    speedToLead: 5,
    sentiment: 'positive',
    doNotCall: false,
    isSensitive: false,
    industry: 'Technology',
    employeeCount: 500,
    location: 'San Francisco, CA'
  },
  {
    id: 'lead-2',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    phone: '+1-555-0124',
    company: 'TechCorp',
    title: 'CTO',
    status: 'contacted',
    score: 72,
    priority: 'medium',
    source: 'Website',
    tags: ['tech', 'saas'],
    notes: 'Needs technical demo',
    lastContact: '2024-01-12T09:30:00Z',
    value: 35000,
    conversionLikelihood: 60,
    speedToLead: 12,
    sentiment: 'neutral',
    doNotCall: false,
    isSensitive: false,
    industry: 'Software',
    employeeCount: 250,
    location: 'Austin, TX'
  },
  {
    id: 'lead-3',
    name: 'Mike Chen',
    email: 'mike@innovate.com',
    phone: '+1-555-0125',
    company: 'Innovate Inc',
    title: 'CEO',
    status: 'new',
    score: 90,
    priority: 'high',
    source: 'Referral',
    tags: ['enterprise', 'urgent'],
    notes: 'Hot lead - schedule call ASAP',
    lastContact: '2024-01-16T11:00:00Z',
    value: 75000,
    conversionLikelihood: 85,
    speedToLead: 2,
    sentiment: 'very_positive',
    doNotCall: false,
    isSensitive: true,
    industry: 'Manufacturing',
    employeeCount: 1000,
    location: 'Chicago, IL'
  }
];

export const mockActivities: MockActivity[] = [
  {
    id: 'activity-1',
    leadId: 'lead-1',
    type: 'call',
    title: 'Discovery Call',
    description: 'Initial discovery call to understand needs',
    timestamp: '2024-01-15T10:00:00Z',
    duration: 30,
    outcome: 'positive',
    nextAction: 'Send proposal',
    recordingUrl: '/recordings/call-1.mp3',
    participants: ['John Smith', 'Sales Rep']
  },
  {
    id: 'activity-2',
    leadId: 'lead-2',
    type: 'email',
    title: 'Follow-up Email',
    description: 'Sent follow-up with pricing information',
    timestamp: '2024-01-12T14:00:00Z',
    outcome: 'neutral',
    nextAction: 'Schedule demo',
    emailSubject: 'Pricing Information for TechCorp',
    openRate: true,
    clickRate: false
  }
];

export const mockCalls: MockCall[] = [
  {
    id: 'call-1',
    leadId: 'lead-1',
    type: 'outbound',
    status: 'completed',
    duration: 1800,
    timestamp: '2024-01-15T10:00:00Z',
    notes: 'Great conversation about their needs',
    sentiment: 'positive',
    recordingUrl: '/recordings/call-1.mp3',
    aiInsights: {
      summary: 'Lead is very interested in the enterprise package',
      keyPoints: ['Budget approved', 'Decision timeline: 2 weeks'],
      riskFactors: ['Competitor evaluation ongoing'],
      recommendations: ['Send proposal by Friday', 'Schedule technical demo']
    }
  }
];

// Add missing exports that are imported elsewhere
export const mockImportSessions = [
  {
    id: 'import-1',
    source: 'Zoho CRM',
    timestamp: '2024-01-16T10:00:00Z',
    recordsImported: 25,
    status: 'completed'
  },
  {
    id: 'import-2',
    source: 'ClickUp',
    timestamp: '2024-01-16T09:30:00Z',
    recordsImported: 12,
    status: 'completed'
  }
];

export const mockAIInsights = [
  {
    id: 'insight-1',
    type: 'performance',
    title: 'Call Success Rate Improvement',
    description: 'Your call success rate has improved by 15% this week',
    confidence: 0.89,
    timestamp: '2024-01-16T08:00:00Z'
  },
  {
    id: 'insight-2',
    type: 'opportunity',
    title: 'High-Value Lead Identified',
    description: 'Sarah Chen from TechStartup Inc shows strong buying signals',
    confidence: 0.92,
    timestamp: '2024-01-16T07:30:00Z'
  }
];

export const mockEmailTemplates = [
  {
    id: 'template-1',
    name: 'Initial Outreach',
    subject: 'Quick question about {{company}} growth',
    body: 'Hi {{name}}, I noticed {{company}} has been expanding rapidly...',
    category: 'outreach'
  },
  {
    id: 'template-2',
    name: 'Follow-up',
    subject: 'Following up on our conversation',
    body: 'Hi {{name}}, Thank you for taking the time to speak with me...',
    category: 'follow-up'
  }
];

export const mockKnowledgeBase = [
  {
    id: 'kb-1',
    title: 'Sales Methodology Guide',
    content: 'Complete guide to our proven sales methodology...',
    category: 'sales',
    tags: ['methodology', 'process', 'best-practices']
  },
  {
    id: 'kb-2',
    title: 'Product Feature Overview',
    content: 'Comprehensive overview of all product features...',
    category: 'product',
    tags: ['features', 'benefits', 'technical']
  }
];
