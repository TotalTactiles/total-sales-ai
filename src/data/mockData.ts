
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
  conversion_likelihood: number;
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

// Basic mock data
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
    conversion_likelihood: 80
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
    conversion_likelihood: 60
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
    nextAction: 'Send proposal'
  },
  {
    id: 'activity-2',
    leadId: 'lead-2',
    type: 'email',
    title: 'Follow-up Email',
    description: 'Sent follow-up with pricing information',
    timestamp: '2024-01-12T14:00:00Z',
    outcome: 'neutral',
    nextAction: 'Schedule demo'
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
    sentiment: 'positive'
  }
];
