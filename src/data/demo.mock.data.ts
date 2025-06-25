
// Demo Mock Data - Toggle this to enable/disable demo mode
export const isDemoMode = true;

// Demo user credentials
export const demoUsers = [
  {
    email: "manager@tsam.com",
    password: "password123",
    role: "manager",
    name: "Demo Manager",
    id: "11111111-1111-1111-1111-111111111111"
  },
  {
    email: "sales@tsam.com", 
    password: "password123",
    role: "sales_rep",
    name: "Demo Sales Rep",
    id: "22222222-2222-2222-2222-222222222222"
  },
  {
    email: "dev@tsam.ai",
    password: "DevTSAM2025", 
    role: "developer",
    name: "Demo Developer",
    id: "33333333-3333-3333-3333-333333333333"
  }
];

// Mock data for Manager OS
export const mockManagerLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1-555-0101',
    company: 'TechCorp Inc',
    source: 'Google Ads',
    status: 'qualified',
    priority: 'high',
    score: 85,
    conversion_likelihood: 78,
    tags: ['Enterprise', 'Hot Lead'],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_contact: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2', 
    name: 'Sarah Johnson',
    email: 'sarah@innovatetech.com',
    phone: '+1-555-0102', 
    company: 'InnovateTech',
    source: 'Meta Ads',
    status: 'contacted',
    priority: 'medium',
    score: 72,
    conversion_likelihood: 65,
    tags: ['SMB', 'Follow-up'],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    name: 'Mike Chen', 
    email: 'mike@cloudstart.io',
    phone: '+1-555-0103',
    company: 'CloudStart',
    source: 'Referral', 
    status: 'new',
    priority: 'high',
    score: 90,
    conversion_likelihood: 85,
    tags: ['Startup', 'High Value'],
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_contact: null
  },
  {
    id: '4',
    name: 'Lisa Rodriguez',
    email: 'lisa@dataflow.com', 
    phone: '+1-555-0104',
    company: 'DataFlow Solutions',
    source: 'LinkedIn',
    status: 'proposal',
    priority: 'high',
    score: 88,
    conversion_likelihood: 82,
    tags: ['Enterprise', 'Decision Stage'],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_contact: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '5',
    name: 'David Park',
    email: 'david@nexusai.com',
    phone: '+1-555-0105', 
    company: 'Nexus AI',
    source: 'Website',
    status: 'negotiation',
    priority: 'high',
    score: 92,
    conversion_likelihood: 88,
    tags: ['AI/ML', 'Close Soon'],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    last_contact: new Date().toISOString()
  }
];

// Mock data for Sales Rep OS  
export const mockSalesLeads = [
  {
    id: '6',
    name: 'Alex Thompson',
    email: 'alex@retailplus.com',
    phone: '+1-555-0201',
    company: 'RetailPlus',
    source: 'Cold Outreach',
    status: 'new',
    priority: 'medium',
    score: 68,
    conversion_likelihood: 55,
    tags: ['Retail', 'Cold Lead'],
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    last_contact: null
  },
  {
    id: '7',
    name: 'Emma Wilson',
    email: 'emma@fintech.io',
    phone: '+1-555-0202',
    company: 'FinTech Solutions', 
    source: 'Website',
    status: 'contacted',
    priority: 'high',
    score: 78,
    conversion_likelihood: 72,
    tags: ['FinTech', 'Warm'],
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_contact: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: '8',
    name: 'Ryan Adams',
    email: 'ryan@healthtech.com', 
    phone: '+1-555-0203',
    company: 'HealthTech Corp',
    source: 'Referral',
    status: 'qualified', 
    priority: 'high',
    score: 84,
    conversion_likelihood: 79,
    tags: ['Healthcare', 'Qualified'],
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    last_contact: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '9',
    name: 'Sophie Chen',
    email: 'sophie@edumedia.com',
    phone: '+1-555-0204',
    company: 'EduMedia',
    source: 'LinkedIn',
    status: 'new',
    priority: 'low', 
    score: 45,
    conversion_likelihood: 38,
    tags: ['Education', 'Research'],
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    last_contact: null
  },
  {
    id: '10',
    name: 'Mark Davis',
    email: 'mark@autotech.com',
    phone: '+1-555-0205',
    company: 'AutoTech Inc',
    source: 'Event',
    status: 'contacted',
    priority: 'medium',
    score: 71,
    conversion_likelihood: 63,
    tags: ['Automotive', 'Event Lead'],
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    last_contact: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

// Mock KPIs for Manager OS
export const mockManagerKPIs = {
  totalLeads: 47,
  conversionRate: 23.4,
  avgDealSize: 42500,
  pipelineValue: 1890000,
  monthlyGrowth: 12.8,
  teamPerformance: 87,
  avgResponseTime: 2.4,
  leadQualityScore: 84
};

// Mock marketing channel performance
export const mockChannelPerformance = [
  { source: 'Google Ads', leads: 15, conversion: 28, cost: 4200, roi: 320 },
  { source: 'Meta Ads', leads: 12, conversion: 22, cost: 3100, roi: 280 },
  { source: 'LinkedIn', leads: 8, conversion: 35, cost: 2800, roi: 450 },
  { source: 'Referrals', leads: 7, conversion: 45, cost: 0, roi: 1200 },
  { source: 'Website', leads: 5, conversion: 18, cost: 500, roi: 180 }
];

// Mock AI responses for Manager OS
export const mockManagerAIResponses = [
  "Based on your pipeline data, I recommend focusing on the 5 leads in negotiation stage - they represent $340K in potential revenue.",
  "Your Google Ads conversion rate dropped 12% this week. Consider A/B testing new ad copy for the enterprise segment.", 
  "Team performance is up 8% this month. Sarah and Mike are your top performers - consider having them mentor newer reps."
];

// Mock call list for Sales Rep OS  
export const mockCallList = [
  { id: '1', name: 'Emma Wilson', company: 'FinTech Solutions', priority: 'high', lastContact: '1 hour ago', script: 'Follow up on pricing discussion' },
  { id: '2', name: 'Ryan Adams', company: 'HealthTech Corp', priority: 'high', lastContact: '2 hours ago', script: 'Schedule demo presentation' },
  { id: '3', name: 'Alex Thompson', company: 'RetailPlus', priority: 'medium', lastContact: 'Never', script: 'Initial outreach - retail automation' },
  { id: '4', name: 'Sophie Chen', company: 'EduMedia', priority: 'low', lastContact: 'Never', script: 'Research call - education sector needs' },
  { id: '5', name: 'Mark Davis', company: 'AutoTech Inc', priority: 'medium', lastContact: '4 hours ago', script: 'Follow up on technical requirements' }
];

// Mock sales rep metrics
export const mockSalesMetrics = {
  dailyTarget: 25,
  callsMade: 18,
  dealsClosed: 2,
  pipelineValue: 125000,
  conversionRate: 15.2,
  avgCallDuration: 8.5,
  followUpTasks: 3,
  notifications: 5
};

// Mock AI coaching suggestions
export const mockAICoaching = [
  "Try opening your next call with a specific industry insight about automotive tech trends to build credibility with Mark Davis.",
  "Emma Wilson mentioned budget concerns - prepare a ROI calculator for your follow-up call.",
  "Your close rate improves 23% when you ask discovery questions early. Remember to qualify Ryan Adams' decision-making process."
];

// Mock Developer OS data
export const mockDeveloperData = {
  systemHealth: 98.7,
  activeIssues: 3,
  resolvedToday: 12,
  aiOptimizations: 8,
  deployments: 2,
  errorRate: 0.03
};

export const mockTSAMLogs = [
  {
    id: '1',
    type: 'ai_optimization',
    priority: 'high',
    metadata: { action: 'lead_scoring_update', improvement: '12% accuracy increase', affected_leads: 47 },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: true
  },
  {
    id: '2', 
    type: 'system_performance',
    priority: 'medium',
    metadata: { metric: 'response_time', before: '450ms', after: '280ms', optimization: 'database_query_tuning' },
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    resolved: true
  },
  {
    id: '3',
    type: 'ai_suggestion',
    priority: 'low', 
    metadata: { suggestion: 'increase_call_frequency', confidence: 0.85, expected_impact: '8% conversion boost' },
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: '4',
    type: 'error_detection',
    priority: 'critical',
    metadata: { error: 'lead_assignment_timeout', frequency: 3, last_occurrence: new Date().toISOString() },
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    resolved: false
  }
];

export const mockFeatureFlags = [
  { id: '1', flag_name: 'dark_mode', description: 'Enable dark mode theme across all OS interfaces', enabled: true, target_audience: 'all' },
  { id: '2', flag_name: 'ai_suggestions_v2', description: 'Enhanced AI suggestion engine with machine learning improvements', enabled: false, target_audience: 'beta_users' },
  { id: '3', flag_name: 'advanced_analytics', description: 'Advanced analytics dashboard with predictive insights', enabled: true, target_audience: 'managers' },
  { id: '4', flag_name: 'voice_calling', description: 'Integrated voice calling functionality', enabled: false, target_audience: 'sales_reps' },
  { id: '5', flag_name: 'real_time_notifications', description: 'Real-time push notifications for critical events', enabled: true, target_audience: 'all' }
];

export const mockSystemUpdates = [
  {
    id: '1',
    update_type: 'hotfix',
    description: 'Fixed lead assignment timeout issue',
    changes: { files: ['LeadManager.tsx', 'api/leads.ts'], bug_fix: 'Added retry logic for lead assignment API calls' },
    deployed_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    update_type: 'feature', 
    description: 'Enhanced AI coaching suggestions',
    changes: { files: ['AICoach.tsx', 'ai/coaching.ts'], feature: 'Improved natural language processing for coaching recommendations' },
    deployed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    update_type: 'performance',
    description: 'Optimized dashboard loading times', 
    changes: { files: ['Dashboard.tsx', 'hooks/useDashboard.ts'], optimization: 'Implemented lazy loading and query optimization' },
    deployed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Function to clear demo data (for production switch)
export const clearDemoData = () => {
  // In production, this would clear all demo-related data
  console.log('Demo data cleared - switching to production mode');
};
