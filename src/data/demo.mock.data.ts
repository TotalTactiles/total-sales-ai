
// Demo mode configuration
export const isDemoMode = true; // Set to false for production

// Demo users for testing different roles and dashboards
export const demoUsers = [
  {
    id: 'demo-manager-001',
    name: 'Demo Manager',
    email: 'manager@tsam.com',
    password: 'password123',
    role: 'manager',
    description: 'Access team performance analytics, lead assignments, and coaching insights'
  },
  {
    id: 'demo-sales-001', 
    name: 'Demo Sales Rep',
    email: 'sales@tsam.com',
    password: 'password123',
    role: 'sales_rep',
    description: 'View your assigned leads, track activities, and get AI-powered insights'
  },
  {
    id: 'demo-dev-001',
    name: 'Demo Developer', 
    email: 'dev@tsam.ai',
    password: 'DevTSAM2025',
    role: 'developer',
    description: 'Monitor system health, manage feature flags, and access TSAM JARVIS AI'
  }
];

// Enhanced mock data for manager dashboard
export const mockManagerLeads = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    phone: '555-0123',
    company: 'Tech Corp',
    source: 'LinkedIn',
    status: 'qualified',
    priority: 'high',
    score: 85,
    created_at: '2024-01-15T10:00:00Z',
    last_contact: '2024-01-20T14:30:00Z'
  },
  {
    id: '2', 
    name: 'Sarah Johnson',
    email: 'sarah@startup.com',
    phone: '555-0456',
    company: 'Innovation Inc',
    source: 'Website',
    status: 'new',
    priority: 'medium',
    score: 72,
    created_at: '2024-01-18T09:15:00Z',
    last_contact: null
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@enterprise.com',
    phone: '555-0789',
    company: 'Enterprise Solutions',
    source: 'Cold Call',
    status: 'contacted',
    priority: 'high',
    score: 91,
    created_at: '2024-01-19T11:45:00Z',
    last_contact: '2024-01-22T16:20:00Z'
  }
];

// Enhanced mock data for sales rep dashboard  
export const mockSalesLeads = [
  {
    id: '4',
    name: 'Lisa Chen',
    email: 'lisa@consulting.com',
    phone: '555-0321',
    company: 'Strategic Consulting',
    source: 'Referral', 
    status: 'qualified',
    priority: 'medium',
    score: 78,
    created_at: '2024-01-21T13:30:00Z',
    last_contact: '2024-01-23T10:15:00Z'
  }
];

// Enhanced team members for manager dashboard
export const mockManagerTeamMembers = [
  {
    id: 'demo-tm-1',
    full_name: 'Sarah Johnson',
    last_login: new Date().toISOString(),
    role: 'sales_rep',
    email: 'sarah.j@company.com',
    stats: {
      call_count: 172,
      win_count: 45,
      current_streak: 5,
      burnout_risk: 10,
      last_active: new Date().toISOString(),
      mood_score: 85,
      revenue_generated: 125000,
      conversion_rate: 26.2,
      avg_deal_size: 2780
    }
  },
  {
    id: 'demo-tm-2',
    full_name: 'Michael Chen',
    last_login: new Date(Date.now() - 3600000).toISOString(),
    role: 'sales_rep',
    email: 'michael.c@company.com',
    stats: {
      call_count: 143,
      win_count: 32,
      current_streak: 0,
      burnout_risk: 75,
      last_active: new Date(Date.now() - 3600000).toISOString(),
      mood_score: 45,
      revenue_generated: 89000,
      conversion_rate: 22.4,
      avg_deal_size: 2781
    }
  },
  {
    id: 'demo-tm-3',
    full_name: 'Jasmine Lee',
    last_login: new Date(Date.now() - 86400000).toISOString(),
    role: 'sales_rep',
    email: 'jasmine.l@company.com',
    stats: {
      call_count: 198,
      win_count: 57,
      current_streak: 7,
      burnout_risk: 20,
      last_active: new Date(Date.now() - 43200000).toISOString(),
      mood_score: 90,
      revenue_generated: 156000,
      conversion_rate: 28.8,
      avg_deal_size: 2737
    }
  },
  {
    id: 'demo-tm-4',
    full_name: 'Alex Rodriguez',
    last_login: new Date(Date.now() - 7200000).toISOString(),
    role: 'sales_rep',
    email: 'alex.r@company.com',
    stats: {
      call_count: 165,
      win_count: 41,
      current_streak: 3,
      burnout_risk: 35,
      last_active: new Date(Date.now() - 7200000).toISOString(),
      mood_score: 72,
      revenue_generated: 112000,
      conversion_rate: 24.8,
      avg_deal_size: 2732
    }
  }
];

// Manager AI recommendations
export const mockManagerRecommendations = [
  {
    id: 'demo-rec-1',
    type: 'follow-up',
    rep_name: 'Sarah Johnson',
    rep_id: 'demo-tm-1',
    message: 'Sarah missed 3 follow-ups with Enterprise leads this week',
    action: 'Assign Recovery Mode',
    priority: 'high',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'demo-rec-2',
    type: 'burnout',
    rep_name: 'Michael Chen',
    rep_id: 'demo-tm-2',
    message: 'Michael worked 12+ hours overtime this week and mood score is dropping',
    action: 'Schedule 1-on-1',
    priority: 'critical',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'demo-rec-3',
    type: 'reward',
    rep_name: 'Jasmine Lee',
    rep_id: 'demo-tm-3',
    message: 'Jasmine exceeded her monthly target by 15% - consider recognition',
    action: 'Send Recognition',
    priority: 'medium',
    created_at: new Date(Date.now() - 14400000).toISOString()
  }
];

// Manager AI insights
export const mockManagerAIInsights = [
  {
    id: 'ai-insight-1',
    type: 'performance',
    title: 'Team Performance Trending Up',
    message: 'Overall team conversion rate improved by 8% this week. Email outreach campaigns are performing exceptionally well.',
    severity: 'success',
    actionable: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'ai-insight-2',
    type: 'risk',
    title: 'Pipeline Risk Detected',
    message: '3 deals worth $125K are stalling in negotiation stage. Recommend immediate intervention.',
    severity: 'warning',
    actionable: true,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'ai-insight-3',
    type: 'opportunity',
    title: 'Upsell Opportunity',
    message: '12 existing clients showing buying signals for premium features. Revenue potential: $45K.',
    severity: 'info',
    actionable: true,
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

// Mock TSAM logs for developer dashboard
export const mockTSAMLogs = [
  {
    id: '1',
    type: 'auth_success', 
    priority: 'low',
    message: 'User login successful',
    created_at: '2024-01-24T08:30:00Z',
    metadata: { userId: 'demo-sales-001', source: 'demo_login' }
  },
  {
    id: '2',
    type: 'lead_import',
    priority: 'medium', 
    message: 'Bulk lead import completed',
    created_at: '2024-01-24T09:15:00Z',
    metadata: { imported: 15, failed: 2 }
  },
  {
    id: '3',
    type: 'api_error',
    priority: 'high',
    message: 'External API rate limit exceeded', 
    created_at: '2024-01-24T10:45:00Z',
    metadata: { service: 'email_provider', retryAfter: 300 }
  },
  {
    id: '4', 
    type: 'system_alert',
    priority: 'critical',
    message: 'Database connection timeout',
    created_at: '2024-01-24T11:22:00Z',
    metadata: { database: 'primary', timeout: 5000 }
  }
];

// Mock feature flags for developer dashboard
export const mockFeatureFlags = [
  {
    id: '1',
    flag_name: 'ai_assistant_v2',
    description: 'Enable new AI assistant features',
    enabled: true,
    target_audience: 'beta_users',
    created_at: '2024-01-20T12:00:00Z'
  },
  {
    id: '2',
    flag_name: 'advanced_analytics', 
    description: 'Advanced reporting dashboard',
    enabled: false,
    target_audience: 'managers',
    created_at: '2024-01-22T14:30:00Z'
  },
  {
    id: '3',
    flag_name: 'voice_dialer',
    description: 'AI-powered voice dialing system',
    enabled: true, 
    target_audience: 'sales_reps',
    created_at: '2024-01-23T16:45:00Z'
  }
];

// Business Operations Mock Data
export const mockBusinessOpsData = {
  metrics: {
    revenue_trend: { value: '+15.2%', trend: 'up', target: 'vs last month' },
    pipeline_value: { value: '$1.2M', trend: 'up', target: 'active deals' },
    team_utilization: { value: '87%', trend: 'neutral', target: 'optimal range' },
    conversion_rate: { value: '23.5%', trend: 'up', target: '+3.2% improvement' }
  },
  alerts: [
    { type: 'opportunity', message: 'Q4 trending 23% above target', priority: 'high' },
    { type: 'risk', message: 'Price objections up 12% - need value prop training', priority: 'medium' },
    { type: 'action', message: '3 high-value deals need immediate attention', priority: 'high' }
  ]
};

// Log demo login attempts for tracking
export const logDemoLogin = (email: string, success: boolean) => {
  const timestamp = new Date().toISOString();
  console.log(`🎭 Demo Login [${timestamp}]:`, {
    email,
    success,
    tag: 'demo-seed-v1.2'
  });
};

// Utility to check if current user is demo user
export const isDemoUser = (email?: string) => {
  if (!email || !isDemoMode) return false;
  return demoUsers.some(user => user.email === email);
};

// Get demo user data by email
export const getDemoUserByEmail = (email: string) => {
  return demoUsers.find(user => user.email === email);
};
