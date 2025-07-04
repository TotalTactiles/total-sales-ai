
export interface MockLead {
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
  rep?: string;
  roas?: number;
  stage?: string;
  timeline?: Array<{
    date: string;
    activity: string;
    type: 'call' | 'email' | 'demo' | 'meeting';
    notes?: string;
  }>;
}

export const mockLeads: MockLead[] = [
  {
    id: "001",
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Solutions",
    status: "qualified",
    priority: "high",
    source: "Meta Ads",
    score: 85,
    conversionLikelihood: 78,
    lastContact: "2024-01-10",
    speedToLead: 5,
    tags: ["enterprise", "hot-lead"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-10",
    companyId: "comp_001",
    isSensitive: false,
    notes: "Highly interested in our enterprise solution. Decision maker confirmed.",
    value: 25000,
    sentiment: "positive",
    objection: "",
    doNotCall: false,
    lastActivity: "Demo booked for next week",
    aiPriority: "High",
    nextAction: "Follow up on demo",
    lastAIInsight: "Strong buying signals detected. Ready to move to proposal stage.",
    rep: "Mike Johnson",
    roas: 2.4,
    stage: "Demo Scheduled",
    timeline: [
      {
        date: "2024-01-08",
        activity: "Initial contact via form submission",
        type: "email",
        notes: "Submitted contact form showing interest in enterprise features"
      },
      {
        date: "2024-01-09",
        activity: "Qualification call completed",
        type: "call",
        notes: "Confirmed budget, timeline, and decision-making process"
      },
      {
        date: "2024-01-10",
        activity: "Demo scheduled",
        type: "demo",
        notes: "Scheduled product demo for January 15th at 2 PM EST"
      }
    ]
  },
  {
    id: "002",
    name: "Marcus Williams",
    email: "marcus@startup-inc.com",
    phone: "+1 (555) 234-5678",
    company: "Startup Inc",
    status: "new",
    priority: "medium",
    source: "Google Ads",
    score: 65,
    conversionLikelihood: 45,
    lastContact: "2024-01-09",
    speedToLead: 12,
    tags: ["smb", "warm-lead"],
    createdAt: "2024-01-09",
    updatedAt: "2024-01-09",
    companyId: "comp_002",
    isSensitive: false,
    notes: "Small business owner, price-sensitive but engaged.",
    value: 8000,
    sentiment: "neutral",
    objection: "pricing concerns",
    doNotCall: false,
    lastActivity: "Email follow-up sent",
    aiPriority: "Medium",
    nextAction: "Address pricing concerns",
    lastAIInsight: "Price sensitivity detected. Consider SMB package options.",
    rep: "Sarah Johnson",
    roas: 1.8,
    stage: "Qualification",
    timeline: [
      {
        date: "2024-01-09",
        activity: "Lead generated from Google Ads",
        type: "email",
        notes: "Clicked on 'small business solutions' ad campaign"
      },
      {
        date: "2024-01-09",
        activity: "Initial outreach email sent",
        type: "email",
        notes: "Sent personalized email with SMB case studies"
      }
    ]
  },
  {
    id: "003",
    name: "Jennifer Liu",
    email: "j.liu@globaltech.net",
    phone: "+1 (555) 345-6789",
    company: "GlobalTech Networks",
    status: "contacted",
    priority: "high",
    source: "LinkedIn",
    score: 90,
    conversionLikelihood: 82,
    lastContact: "2024-01-11",
    speedToLead: 3,
    tags: ["enterprise", "decision-maker"],
    createdAt: "2024-01-11",
    updatedAt: "2024-01-11",
    companyId: "comp_003",
    isSensitive: true,
    notes: "CTO at large enterprise. Urgent need for our solution.",
    value: 50000,
    sentiment: "very-positive",
    objection: "",
    doNotCall: false,
    lastActivity: "Meeting scheduled",
    aiPriority: "Very High",
    nextAction: "Prepare executive presentation",
    lastAIInsight: "Executive-level engagement. High probability of large deal closure.",
    rep: "Emily Rodriguez",
    roas: 3.2,
    stage: "Executive Review",
    timeline: [
      {
        date: "2024-01-11",
        activity: "LinkedIn connection and message",
        type: "email",
        notes: "Connected via LinkedIn, expressed urgent need"
      },
      {
        date: "2024-01-11",
        activity: "Executive meeting scheduled",
        type: "meeting",
        notes: "C-level meeting scheduled for strategic discussion"
      }
    ]
  }
];

export const getLeadById = (id: string): MockLead | undefined => {
  return mockLeads.find(lead => lead.id === id);
};

export const getLeadsByRep = (repName: string): MockLead[] => {
  return mockLeads.filter(lead => lead.rep === repName);
};

export const getLeadsBySource = (source: string): MockLead[] => {
  return mockLeads.filter(lead => lead.source === source);
};
