
import { MockLead, MockActivity, MockCall } from './mockData';

// Enhanced lead data with more realistic scenarios
export const enhancedMockLeads: MockLead[] = [
  {
    id: 'lead-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@techstartup.com',
    phone: '+1-555-0101',
    company: 'TechStartup Inc',
    title: 'VP of Engineering',
    status: 'qualified',
    score: 85,
    priority: 'high',
    source: 'LinkedIn',
    tags: ['enterprise', 'saas', 'technical'],
    notes: 'Very interested in our enterprise solution. Has budget approval and decision-making authority.',
    lastContact: '2024-01-15T10:30:00Z',
    nextFollowUp: '2024-01-20T14:00:00Z',
    value: 75000,
    conversion_likelihood: 85,
    industry: 'Technology',
    employeeCount: 150,
    location: 'San Francisco, CA',
    timezone: 'PST',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      twitter: '@sarahchen_vp'
    },
    customFields: {
      currentSolution: 'Salesforce',
      painPoints: ['Integration complexity', 'High costs', 'Poor user adoption'],
      decisionCriteria: ['ROI', 'Ease of use', 'Integration capabilities'],
      budget: '$50k-100k',
      timeline: 'Q1 2024'
    }
  },
  {
    id: 'lead-002',
    name: 'Marcus Rodriguez',
    email: 'marcus.r@retailcorp.com',
    phone: '+1-555-0102',
    company: 'RetailCorp',
    title: 'Operations Director',
    status: 'contacted',
    score: 72,
    priority: 'medium',
    source: 'Cold Email',
    tags: ['retail', 'operations', 'mid-market'],
    notes: 'Showed interest in automation features. Wants to see ROI calculations.',
    lastContact: '2024-01-12T15:45:00Z',
    nextFollowUp: '2024-01-18T09:00:00Z',
    value: 45000,
    conversion_likelihood: 60,
    industry: 'Retail',
    employeeCount: 500,
    location: 'Chicago, IL',
    timezone: 'CST',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/marcusrodriguez'
    },
    customFields: {
      currentSolution: 'Manual processes',
      painPoints: ['Time-consuming tasks', 'Human errors', 'Scalability issues'],
      decisionCriteria: ['Cost savings', 'Time efficiency', 'Reliability'],
      budget: '$30k-60k',
      timeline: 'Q2 2024'
    }
  },
  {
    id: 'lead-003',
    name: 'Dr. Emily Watson',
    email: 'e.watson@healthplus.com',
    phone: '+1-555-0103',
    company: 'HealthPlus Medical',
    title: 'Chief Medical Officer',
    status: 'proposal',
    score: 91,
    priority: 'high',
    source: 'Referral',
    tags: ['healthcare', 'enterprise', 'compliance'],
    notes: 'Ready to move forward. Needs HIPAA compliance documentation.',
    lastContact: '2024-01-14T11:20:00Z',
    nextFollowUp: '2024-01-17T16:30:00Z',
    value: 120000,
    conversion_likelihood: 90,
    industry: 'Healthcare',
    employeeCount: 1200,
    location: 'Boston, MA',
    timezone: 'EST',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/emilywatonmd'
    },
    customFields: {
      currentSolution: 'Epic Systems',
      painPoints: ['Data silos', 'Reporting delays', 'Integration challenges'],
      decisionCriteria: ['HIPAA compliance', 'Integration capabilities', 'Support quality'],
      budget: '$100k-150k',
      timeline: 'Immediate'
    }
  },
  {
    id: 'lead-004',
    name: 'James Thompson',
    email: 'j.thompson@financefirm.com',
    phone: '+1-555-0104',
    company: 'Premier Finance',
    title: 'Technology Director',
    status: 'negotiation',
    score: 88,
    priority: 'high',
    source: 'Trade Show',
    tags: ['finance', 'security', 'enterprise'],
    notes: 'Price negotiation in progress. Very interested in security features.',
    lastContact: '2024-01-16T14:15:00Z',
    nextFollowUp: '2024-01-19T10:00:00Z',
    value: 95000,
    conversion_likelihood: 85,
    industry: 'Financial Services',
    employeeCount: 800,
    location: 'New York, NY',
    timezone: 'EST',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/jamesthompsontech'
    },
    customFields: {
      currentSolution: 'Custom built system',
      painPoints: ['Maintenance costs', 'Limited features', 'Security concerns'],
      decisionCriteria: ['Security', 'Compliance', 'Cost effectiveness'],
      budget: '$80k-120k',
      timeline: 'End of Q1'
    }
  },
  {
    id: 'lead-005',
    name: 'Lisa Park',
    email: 'lisa.park@edutech.org',
    phone: '+1-555-0105',
    company: 'EduTech Solutions',
    title: 'Product Manager',
    status: 'new',
    score: 45,
    priority: 'low',
    source: 'Website',
    tags: ['education', 'saas', 'startup'],
    notes: 'Early stage inquiry. Needs more qualification.',
    lastContact: '2024-01-10T09:30:00Z',
    nextFollowUp: '2024-01-22T11:00:00Z',
    value: 25000,
    conversion_likelihood: 35,
    industry: 'Education',
    employeeCount: 50,
    location: 'Austin, TX',
    timezone: 'CST',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/lisaparkedu'
    },
    customFields: {
      currentSolution: 'Google Workspace',
      painPoints: ['Limited customization', 'User management', 'Reporting'],
      decisionCriteria: ['Ease of use', 'Cost', 'Feature set'],
      budget: '$15k-30k',
      timeline: 'Evaluating'
    }
  }
];

// Enhanced activity data
export const enhancedMockActivities: MockActivity[] = [
  {
    id: 'activity-001',
    leadId: 'lead-001',
    type: 'call',
    title: 'Discovery Call',
    description: 'Discussed technical requirements and integration needs. Sarah is very interested in our API capabilities.',
    timestamp: '2024-01-15T10:30:00Z',
    duration: 45,
    outcome: 'positive',
    nextAction: 'Send technical documentation',
    recordingUrl: '/recordings/discovery-call-001.mp3',
    participants: ['Sarah Chen', 'John Sales Rep'],
    sentiment: 'positive',
    keyTopics: ['API integration', 'Scalability', 'Security'],
    actionItems: [
      'Send API documentation',
      'Schedule technical demo',
      'Provide security compliance docs'
    ]
  },
  {
    id: 'activity-002',
    leadId: 'lead-002',
    type: 'email',
    title: 'ROI Calculation Sent',
    description: 'Sent detailed ROI analysis based on their current processes.',
    timestamp: '2024-01-12T15:45:00Z',
    outcome: 'positive',
    nextAction: 'Follow up on ROI review',
    emailSubject: 'ROI Analysis for RetailCorp Automation',
    openRate: true,
    clickRate: true,
    attachments: ['roi-analysis.pdf', 'case-study-retail.pdf']
  },
  {
    id: 'activity-003',
    leadId: 'lead-003',
    type: 'meeting',
    title: 'Executive Presentation',
    description: 'Presented solution to executive team. Great reception, ready to proceed.',
    timestamp: '2024-01-14T11:20:00Z',
    duration: 60,
    outcome: 'very_positive',
    nextAction: 'Prepare proposal',
    participants: ['Dr. Emily Watson', 'CTO', 'CFO', 'John Sales Rep'],
    presentationSlides: 'executive-presentation-healthplus.pptx',
    keyDecisions: [
      'Approved budget allocation',
      'Confirmed timeline',
      'Identified technical requirements'
    ]
  },
  {
    id: 'activity-004',
    leadId: 'lead-004',
    type: 'demo',
    title: 'Security Features Demo',
    description: 'Demonstrated advanced security features and compliance capabilities.',
    timestamp: '2024-01-13T16:00:00Z',
    duration: 90,
    outcome: 'positive',
    nextAction: 'Price negotiation meeting',
    demoType: 'live',
    featuresShown: ['Encryption', 'Audit trails', 'Access controls', 'Compliance reporting'],
    questions: [
      'SOC 2 compliance timeline?',
      'Multi-factor authentication options?',
      'Data retention policies?'
    ]
  },
  {
    id: 'activity-005',
    leadId: 'lead-005',
    type: 'webinar',
    title: 'Attended Product Webinar',
    description: 'Lisa attended our monthly product webinar and asked several questions.',
    timestamp: '2024-01-10T09:30:00Z',
    duration: 60,
    outcome: 'neutral',
    nextAction: 'Send follow-up materials',
    webinarTitle: 'Education Sector Solutions Overview',
    questionsAsked: 2,
    engagementScore: 75,
    downloadedResources: ['education-use-cases.pdf']
  }
];

// Enhanced call data with AI insights
export const enhancedMockCalls: MockCall[] = [
  {
    id: 'call-001',
    leadId: 'lead-001',
    type: 'outbound',
    status: 'completed',
    duration: 2700, // 45 minutes
    timestamp: '2024-01-15T10:30:00Z',
    notes: 'Excellent call. Sarah is very technical and asked detailed questions about our API.',
    recordingUrl: '/recordings/call-001.mp3',
    transcriptUrl: '/transcripts/call-001.txt',
    sentiment: 'very_positive',
    aiInsights: {
      summary: 'Highly qualified lead with strong technical background. Interested in enterprise features.',
      keyPoints: [
        'Decision maker confirmed',
        'Budget range: $50k-100k',
        'Timeline: Q1 2024',
        'Technical requirements clearly defined'
      ],
      riskFactors: ['None identified'],
      recommendations: [
        'Prioritize technical demo',
        'Involve solution architect',
        'Fast-track proposal process'
      ],
      nextBestAction: 'Schedule technical deep-dive demo',
      confidenceScore: 92
    },
    callAnalytics: {
      talkTime: 60, // percentage
      customerQuestions: 12,
      objections: 0,
      buyingSignals: 8,
      competitorMentions: ['Salesforce'],
      emotionalTone: 'enthusiastic'
    }
  },
  {
    id: 'call-002',
    leadId: 'lead-002',
    type: 'outbound',
    status: 'completed',
    duration: 1800, // 30 minutes
    timestamp: '2024-01-11T14:20:00Z',
    notes: 'Marcus is interested but needs to see clear ROI before moving forward.',
    recordingUrl: '/recordings/call-002.mp3',
    transcriptUrl: '/transcripts/call-002.txt',
    sentiment: 'positive',
    aiInsights: {
      summary: 'Cost-conscious buyer focused on operational efficiency and ROI.',
      keyPoints: [
        'ROI is primary concern',
        'Manual processes causing inefficiencies',
        'Decision timeline: Q2 2024',
        'Budget approval needed'
      ],
      riskFactors: ['Price sensitivity', 'Budget approval required'],
      recommendations: [
        'Provide detailed ROI calculations',
        'Share relevant case studies',
        'Offer pilot program'
      ],
      nextBestAction: 'Send ROI analysis and case studies',
      confidenceScore: 65
    },
    callAnalytics: {
      talkTime: 45,
      customerQuestions: 8,
      objections: 3,
      buyingSignals: 4,
      competitorMentions: [],
      emotionalTone: 'analytical'
    }
  },
  {
    id: 'call-003',
    leadId: 'lead-003',
    type: 'outbound',
    status: 'completed',
    duration: 3600, // 60 minutes
    timestamp: '2024-01-08T13:00:00Z',
    notes: 'Dr. Watson is very impressed. Ready to move to proposal stage.',
    recordingUrl: '/recordings/call-003.mp3',
    transcriptUrl: '/transcripts/call-003.txt',
    sentiment: 'very_positive',
    aiInsights: {
      summary: 'Highly motivated buyer with clear need and budget. Ready to purchase.',
      keyPoints: [
        'Immediate need identified',
        'Budget confirmed: $100k-150k',
        'HIPAA compliance critical',
        'Implementation timeline: ASAP'
      ],
      riskFactors: ['Compliance requirements must be met'],
      recommendations: [
        'Fast-track compliance documentation',
        'Involve legal/compliance team',
        'Prepare detailed proposal'
      ],
      nextBestAction: 'Send proposal with compliance documentation',
      confidenceScore: 95
    },
    callAnalytics: {
      talkTime: 70,
      customerQuestions: 15,
      objections: 1,
      buyingSignals: 12,
      competitorMentions: ['Epic Systems'],
      emotionalTone: 'excited'
    }
  }
];

// CRM Integration mock data
export const mockCRMIntegrations = [
  {
    id: 'crm-001',
    name: 'Zoho CRM',
    type: 'zoho' as const,
    isConnected: true,
    lastSync: '2024-01-16T08:00:00Z',
    leadsImported: 150,
    tasksImported: 45,
    status: 'active'
  },
  {
    id: 'crm-002',
    name: 'ClickUp',
    type: 'clickup' as const,
    isConnected: true,
    lastSync: '2024-01-15T18:30:00Z',
    leadsImported: 0,
    tasksImported: 78,
    status: 'active'
  },
  {
    id: 'crm-003',
    name: 'Salesforce',
    type: 'salesforce' as const,
    isConnected: false,
    lastSync: null,
    leadsImported: 0,
    tasksImported: 0,
    status: 'disconnected'
  }
];

// Automation Workflow mock data
export const mockWorkflows = [
  {
    id: 'workflow-001',
    name: 'Lead Follow-up Automation',
    description: 'Automatically send follow-up emails and create tasks for new qualified leads',
    isActive: true,
    trigger: {
      type: 'lead_status_change' as const,
      conditions: { status: 'qualified' }
    },
    actions: [
      {
        type: 'send_email' as const,
        parameters: {
          template: 'qualified_lead_followup',
          delay: 300 // 5 minutes
        }
      },
      {
        type: 'create_task' as const,
        parameters: {
          title: 'Schedule discovery call',
          priority: 'high',
          dueDate: '+2 days'
        },
        delay: 600 // 10 minutes
      }
    ],
    createdBy: 'user-001',
    createdAt: '2024-01-10T12:00:00Z',
    runCount: 23,
    lastRun: '2024-01-16T09:15:00Z'
  },
  {
    id: 'workflow-002',
    name: 'Voice Command Lead Update',
    description: 'Update lead status and send notification when triggered by voice command',
    isActive: true,
    trigger: {
      type: 'voice_command' as const,
      conditions: { command: 'update lead status' }
    },
    actions: [
      {
        type: 'update_lead' as const,
        parameters: {
          status: 'contacted'
        }
      },
      {
        type: 'ai_analysis' as const,
        parameters: {
          analysisType: 'lead_scoring',
          prompt: 'Analyze lead interaction and update score'
        }
      }
    ],
    createdBy: 'user-001',
    createdAt: '2024-01-12T15:30:00Z',
    runCount: 8,
    lastRun: '2024-01-16T11:45:00Z'
  }
];

// AI Analysis mock data
export const mockAIAnalyses = [
  {
    id: 'analysis-001',
    type: 'lead_scoring',
    leadId: 'lead-001',
    timestamp: '2024-01-16T10:30:00Z',
    confidence: 92,
    insights: [
      'High engagement score based on call duration and questions asked',
      'Strong technical background aligns with enterprise features',
      'Decision-making authority confirmed',
      'Timeline and budget well-defined'
    ],
    recommendations: [
      'Prioritize technical demo with solution architect',
      'Provide detailed API documentation',
      'Fast-track proposal process'
    ],
    riskFactors: ['None identified'],
    scoreChange: +5,
    reasoning: 'Recent positive call interaction and confirmed budget/timeline increased score'
  },
  {
    id: 'analysis-002',
    type: 'conversation_analysis',
    leadId: 'lead-002',
    timestamp: '2024-01-15T16:00:00Z',
    confidence: 78,
    insights: [
      'Strong focus on ROI and cost justification',
      'Currently using manual processes causing inefficiencies',
      'Budget approval process required',
      'Analytical decision-making style'
    ],
    recommendations: [
      'Provide detailed ROI calculations with industry benchmarks',
      'Share case studies from similar retail companies',
      'Offer pilot program to reduce risk'
    ],
    riskFactors: ['Price sensitivity', 'Extended decision timeline'],
    scoreChange: -3,
    reasoning: 'Multiple objections around pricing reduced confidence score'
  }
];

export const enhancedMockData = {
  leads: enhancedMockLeads,
  activities: enhancedMockActivities,
  calls: enhancedMockCalls,
  crmIntegrations: mockCRMIntegrations,
  workflows: mockWorkflows,
  aiAnalyses: mockAIAnalyses
};
