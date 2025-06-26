
// Demo mode configuration
export const isDemoMode = true; // Set to false for production

// Demo users for testing different roles and dashboards
export const demoUsers = [
  {
    id: 'demo-manager-001',
    name: 'Demo Manager',
    email: 'manager@tsam.com',
    password: 'password123',
    role: 'manager'
  },
  {
    id: 'demo-sales-001', 
    name: 'Demo Sales Rep',
    email: 'sales@tsam.com',
    password: 'password123',
    role: 'sales_rep'
  },
  {
    id: 'demo-dev-001',
    name: 'Demo Developer', 
    email: 'dev@tsam.ai',
    password: 'DevTSAM2025',
    role: 'developer'
  }
];

// Mock data for manager dashboard
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
  }
];

// Mock data for sales rep dashboard  
export const mockSalesLeads = [
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
  },
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
