
export const mockSalesData = {
  leads: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '(555) 123-4567',
      company: 'TechCorp Solutions',
      status: 'qualified',
      priority: 'high',
      source: 'LinkedIn',
      score: 85,
      conversionLikelihood: 78,
      lastContact: '2024-01-20T14:30:00Z',
      speedToLead: 15,
      tags: ['enterprise', 'tech'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      companyId: 'demo-company-001',
      isSensitive: false,
      notes: 'Very interested in enterprise solution',
      value: 95000,
      sentiment: 'positive',
      objection: '',
      doNotCall: false,
      lastActivity: 'Sent follow-up email',
      aiPriority: 'High',
      nextAction: 'Schedule demo call',
      lastAIInsight: 'Strong buying signals detected'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@startup.io',
      phone: '(555) 234-5678',
      company: 'InnovateCorp',
      status: 'contacted',
      priority: 'medium',
      source: 'Website',
      score: 72,
      conversionLikelihood: 65,
      lastContact: '2024-01-18T16:20:00Z',
      speedToLead: 8,
      tags: ['startup', 'saas'],
      createdAt: '2024-01-18T09:15:00Z',
      updatedAt: '2024-01-18T16:20:00Z',
      companyId: 'demo-company-001',
      isSensitive: false,
      notes: 'Interested in basic package',
      value: 25000,
      sentiment: 'neutral',
      objection: 'pricing concerns',
      doNotCall: false,
      lastActivity: 'Phone call completed',
      aiPriority: 'Medium',
      nextAction: 'Send pricing proposal',
      lastAIInsight: 'Price sensitive prospect'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@enterprise.com',
      phone: '(555) 345-6789',
      company: 'Enterprise Solutions Ltd',
      status: 'new',
      priority: 'high',
      source: 'Referral',
      score: 91,
      conversionLikelihood: 88,
      lastContact: null,
      speedToLead: 0,
      tags: ['enterprise', 'urgent'],
      createdAt: '2024-01-22T11:45:00Z',
      updatedAt: '2024-01-22T11:45:00Z',
      companyId: 'demo-company-001',
      isSensitive: false,
      notes: 'Warm referral from existing client',
      value: 150000,
      sentiment: 'positive',
      objection: '',
      doNotCall: false,
      lastActivity: 'Lead imported',
      aiPriority: 'Critical',
      nextAction: 'Initial outreach call',
      lastAIInsight: 'High-value referral with strong potential'
    }
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Follow up with Sarah Johnson',
      description: 'Schedule demo call',
      priority: 'high',
      dueDate: '2024-01-25T10:00:00Z',
      completed: false
    },
    {
      id: 'task-2',
      title: 'Send pricing to Michael Chen',
      description: 'Custom pricing proposal',
      priority: 'medium',
      dueDate: '2024-01-24T15:00:00Z',
      completed: false
    }
  ],
  aiInsights: [
    {
      id: 'insight-1',
      type: 'opportunity',
      message: 'Sarah Johnson shows strong buying signals',
      confidence: 85,
      createdAt: '2024-01-23T09:00:00Z'
    }
  ]
};

export const mockManagerData = {
  teamMembers: [
    {
      id: 'rep-1',
      name: 'Alex Thompson',
      role: 'Senior Sales Rep',
      performance: 128,
      dealsWon: 12,
      callsMade: 145,
      moodScore: 8.5,
      burnoutRisk: 25,
      quota: 100000,
      revenue: 128000
    },
    {
      id: 'rep-2',
      name: 'Maria Santos',
      role: 'Sales Rep',
      performance: 95,
      dealsWon: 8,
      callsMade: 120,
      moodScore: 7.8,
      burnoutRisk: 35,
      quota: 80000,
      revenue: 76000
    },
    {
      id: 'rep-3',
      name: 'James Wilson',
      role: 'Junior Sales Rep',
      performance: 67,
      dealsWon: 5,
      callsMade: 98,
      moodScore: 6.2,
      burnoutRisk: 55,
      quota: 60000,
      revenue: 40200
    }
  ],
  pipelineHealth: {
    totalValue: 450000,
    dealCount: 25,
    avgDealSize: 18000,
    conversionRate: 24.5,
    hotDeals: 8,
    stalled: 3
  },
  alerts: [
    {
      id: 'alert-1',
      message: 'James Wilson showing signs of burnout',
      priority: 'high',
      actionRequired: 'Schedule 1:1 meeting and provide support'
    },
    {
      id: 'alert-2',
      message: 'Alex Thompson exceeded quota by 28%',
      priority: 'positive',
      actionRequired: 'Consider for team lead promotion'
    },
    {
      id: 'alert-3',
      message: '3 deals stalled in pipeline for over 2 weeks',
      priority: 'medium',
      actionRequired: 'Review and reassign if needed'
    }
  ]
};

export const mockDeveloperData = {
  agentLogs: [
    {
      id: 'log-1',
      agent: 'Sales AI Agent',
      message: 'Successfully processed lead scoring batch',
      status: 'completed',
      level: 'success',
      timestamp: '2024-01-24T10:30:00Z'
    },
    {
      id: 'log-2',
      agent: 'Email Automation Agent',
      message: 'Sent 15 follow-up emails',
      status: 'active',
      level: 'info',
      timestamp: '2024-01-24T09:45:00Z'
    },
    {
      id: 'log-3',
      agent: 'Data Sync Agent',
      message: 'CRM sync completed with 2 warnings',
      status: 'warning',
      level: 'warning',
      timestamp: '2024-01-24T09:15:00Z'
    },
    {
      id: 'log-4',
      agent: 'Lead Qualification Agent',
      message: 'Processing new lead batch',
      status: 'running',
      level: 'info',
      timestamp: '2024-01-24T08:30:00Z'
    }
  ],
  systemHealth: {
    performance: 'Optimal',
    activeAgents: 6,
    apiCalls: 1247,
    uptime: '99.8%',
    errors: 0,
    responseTime: 45,
    memoryUsage: 68,
    cpuUsage: 23
  },
  recentCommits: [
    {
      id: 'commit-1',
      message: 'Enhanced lead scoring algorithm',
      author: 'AI System',
      files: 3,
      timestamp: '2024-01-24T07:20:00Z'
    },
    {
      id: 'commit-2',
      message: 'Fixed email template rendering issue',
      author: 'Auto-Fix Agent',
      files: 2,
      timestamp: '2024-01-23T16:45:00Z'
    },
    {
      id: 'commit-3',
      message: 'Updated CRM integration endpoints',
      author: 'Integration Agent',
      files: 5,
      timestamp: '2024-01-23T14:10:00Z'
    }
  ]
};
