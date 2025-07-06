
import { Lead } from '@/types/lead';

// Enhanced mock data for demo users
export const mockSalesData = {
  leads: [
    {
      id: 'demo-lead-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1-555-0123',
      company: 'TechCorp Solutions',
      status: 'qualified' as const,
      priority: 'high' as const,
      source: 'LinkedIn Outreach',
      score: 92,
      conversionLikelihood: 85,
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      speedToLead: 15,
      tags: ['enterprise', 'hot-lead', 'decision-maker'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: 'demo-company',
      value: 45000,
      lastActivity: '2 days ago',
      aiPriority: 'High' as const,
      nextAction: 'Schedule demo call',
      lastAIInsight: 'Strong buying signals detected. Mentioned budget approval for Q4.'
    },
    {
      id: 'demo-lead-2',
      name: 'Michael Chen',
      email: 'michael.chen@startup.io',
      phone: '+1-555-0456',
      company: 'Innovation Startup',
      status: 'contacted' as const,
      priority: 'medium' as const,
      source: 'Website Form',
      score: 78,
      conversionLikelihood: 65,
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      speedToLead: 8,
      tags: ['startup', 'follow-up-needed'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      companyId: 'demo-company',
      value: 12000,
      lastActivity: '1 day ago',
      aiPriority: 'Medium' as const,
      nextAction: 'Send pricing proposal',
      lastAIInsight: 'Interested in features but concerned about implementation timeline.'
    },
    {
      id: 'demo-lead-3',
      name: 'Emily Rodriguez',
      email: 'emily.r@enterprise.com',
      phone: '+1-555-0789',
      company: 'Enterprise Corp',
      status: 'proposal' as const,
      priority: 'high' as const,
      source: 'Cold Email',
      score: 88,
      conversionLikelihood: 78,
      lastContact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      speedToLead: 22,
      tags: ['enterprise', 'proposal-sent', 'stakeholder'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: 'demo-company',
      value: 78000,
      lastActivity: '3 days ago',
      aiPriority: 'High' as const,
      nextAction: 'Follow up on proposal',
      lastAIInsight: 'Proposal reviewed by legal team. Positive feedback on ROI calculations.'
    },
    {
      id: 'demo-lead-4',
      name: 'David Kim',
      email: 'david.kim@fastgrow.com',
      phone: '+1-555-0321',
      company: 'FastGrow Inc',
      status: 'negotiation' as const,
      priority: 'high' as const,
      source: 'Referral',
      score: 95,
      conversionLikelihood: 92,
      lastContact: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      speedToLead: 5,
      tags: ['referral', 'closing-soon', 'hot'],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      companyId: 'demo-company',
      value: 125000,
      lastActivity: '12 hours ago',
      aiPriority: 'Critical' as const,
      nextAction: 'Finalize contract terms',
      lastAIInsight: 'Ready to close. Waiting for final approval from CFO. Strong urgency.'
    },
    {
      id: 'demo-lead-5',
      name: 'Lisa Wang',
      email: 'lisa.wang@consulting.com',
      phone: '+1-555-0654',
      company: 'Strategic Consulting',
      status: 'new' as const,
      priority: 'medium' as const,
      source: 'Trade Show',
      score: 72,
      conversionLikelihood: 58,
      lastContact: null,
      speedToLead: 0,
      tags: ['new', 'trade-show', 'needs-qualification'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: 'demo-company',
      value: 28000,
      lastActivity: 'New lead',
      aiPriority: 'Medium' as const,
      nextAction: 'Initial qualification call',
      lastAIInsight: 'High-potential lead from premium trade show booth interaction.'
    },
    {
      id: 'demo-lead-6',
      name: 'Robert Taylor',
      email: 'robert.t@manufacturing.com',
      phone: '+1-555-0987',
      company: 'Manufacturing Plus',
      status: 'qualified' as const,
      priority: 'low' as const,
      source: 'Google Ads',
      score: 65,
      conversionLikelihood: 45,
      lastContact: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      speedToLead: 32,
      tags: ['google-ads', 'manufacturing', 'longer-cycle'],
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: 'demo-company',
      value: 18000,
      lastActivity: '4 days ago',
      aiPriority: 'Low' as const,
      nextAction: 'Send case study',
      lastAIInsight: 'Interested but budget approval needed. Long decision cycle expected.'
    },
    {
      id: 'demo-lead-7',
      name: 'Jennifer Adams',
      email: 'jennifer.adams@retailco.com',
      phone: '+1-555-0147',
      company: 'RetailCo',
      status: 'closed_won' as const,
      priority: 'high' as const,
      source: 'Partner Referral',
      score: 98,
      conversionLikelihood: 100,
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      speedToLead: 12,
      tags: ['closed-won', 'success', 'referral'],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      companyId: 'demo-company',
      value: 95000,
      lastActivity: '1 day ago',
      aiPriority: 'Closed' as const,
      nextAction: 'Onboarding kickoff',
      lastAIInsight: 'Deal closed successfully. Customer excited about implementation.'
    },
    {
      id: 'demo-lead-8',
      name: 'Alex Morgan',
      email: 'alex.morgan@logistics.com',
      phone: '+1-555-0258',
      company: 'Logistics Solutions',
      status: 'contacted' as const,
      priority: 'medium' as const,
      source: 'LinkedIn',
      score: 71,
      conversionLikelihood: 62,
      lastContact: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      speedToLead: 18,
      tags: ['linkedin', 'logistics', 'potential'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      companyId: 'demo-company',
      value: 35000,
      lastActivity: '6 hours ago',
      aiPriority: 'Medium' as const,
      nextAction: 'Schedule discovery call',
      lastAIInsight: 'Engaged on LinkedIn. Showed interest in automation features.'
    }
  ] as Lead[],
  
  tasks: [
    {
      id: 'task-1',
      title: 'Follow up with Sarah Johnson - Demo Feedback',
      description: 'Get feedback on product demo and address any technical questions',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      leadId: 'demo-lead-1',
      leadName: 'Sarah Johnson'
    },
    {
      id: 'task-2',
      title: 'Send pricing proposal to Michael Chen',
      description: 'Customize pricing based on startup tier and send comprehensive proposal',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      leadId: 'demo-lead-2',
      leadName: 'Michael Chen'
    },
    {
      id: 'task-3',
      title: 'Contract finalization with David Kim',
      description: 'Review final contract terms and schedule signing meeting',
      status: 'in-progress',
      priority: 'critical',
      dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      leadId: 'demo-lead-4',
      leadName: 'David Kim'
    }
  ],

  aiInsights: [
    'Sarah Johnson has shown strong buying signals - mentioned budget approval for Q4',
    'David Kim deal is 92% likely to close this week based on engagement patterns',
    'Manufacturing Plus requires longer decision cycle - send case studies to build trust',
    '3 deals worth $248K are in final negotiation stages - focus on closing activities'
  ]
};

export const mockManagerData = {
  teamMembers: [
    {
      id: 'rep-1',
      name: 'Alex Thompson',
      role: 'Senior Sales Rep',
      performance: 128,
      target: 100,
      dealsWon: 12,
      callsMade: 89,
      status: 'active',
      lastActivity: '2 hours ago',
      burnoutRisk: 15,
      moodScore: 85
    },
    {
      id: 'rep-2', 
      name: 'Maria Santos',
      role: 'Sales Rep',
      performance: 95,
      target: 100,
      dealsWon: 8,
      callsMade: 67,
      status: 'active',
      lastActivity: '30 minutes ago',
      burnoutRisk: 35,
      moodScore: 78
    },
    {
      id: 'rep-3',
      name: 'James Wilson',
      role: 'Junior Sales Rep',
      performance: 76,
      target: 100,
      dealsWon: 5,
      callsMade: 45,
      status: 'needs-attention',
      lastActivity: '4 hours ago',
      burnoutRisk: 60,
      moodScore: 65
    }
  ],

  pipelineHealth: {
    totalValue: 1250000,
    dealCount: 28,
    avgDealSize: 44643,
    conversionRate: 24.5,
    stalled: 3,
    hotDeals: 7
  },

  alerts: [
    {
      type: 'stalled-deal',
      message: 'Enterprise Corp deal has been stalled for 5 days',
      priority: 'high',
      actionRequired: 'Manager intervention needed'
    },
    {
      type: 'high-performer',
      message: 'Alex Thompson exceeded quota by 28% this month',
      priority: 'positive',
      actionRequired: 'Consider recognition/reward'
    },
    {
      type: 'burnout-risk',
      message: 'James Wilson showing signs of burnout - mood score dropping',
      priority: 'medium',
      actionRequired: 'Schedule 1:1 check-in'
    }
  ]
};

export const mockDeveloperData = {
  agentLogs: [
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      agent: 'GPT-4 Sales Assistant',
      status: 'active',
      message: 'Generated 3 email drafts for high-priority leads',
      level: 'info'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      agent: 'Claude Analytics Engine',
      status: 'processing',
      message: 'Analyzing pipeline health for 28 active deals',
      level: 'info'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      agent: 'Relevance AI Router',
      status: 'warning',
      message: 'Rate limit approaching for OpenAI API calls',
      level: 'warning'
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      agent: 'System Monitor',
      status: 'active',
      message: 'All systems operational - 99.8% uptime',
      level: 'success'
    }
  ],

  systemHealth: {
    uptime: '99.8%',
    activeAgents: 6,
    apiCalls: 1247,
    errors: 2,
    performance: 'optimal'
  },

  recentCommits: [
    {
      id: 'commit-1',
      message: 'feat: Enhanced lead scoring algorithm',
      author: 'AI System',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      files: 3
    },
    {
      id: 'commit-2',
      message: 'fix: Resolved email template rendering issue',
      author: 'Auto-Fixer',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      files: 1
    },
    {
      id: 'commit-3',
      message: 'update: Pipeline analytics optimization',
      author: 'Performance Bot',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      files: 5
    }
  ]
};
