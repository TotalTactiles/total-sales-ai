import { MockLead, MockActivity, MockCall, mockAIInsights } from './mockData';
import {
  enhancedMockLeads,
  enhancedMockActivities,
  enhancedMockCalls,
  mockCRMIntegrations,
  mockWorkflows,
} from './enhancedMockData';
import { mockLeadProfile } from './mockLeadProfile';

export interface DemoTeamMember {
  id: string;
  full_name: string | null;
  last_login: string | null;
  role: string;
  stats: {
    call_count: number;
    win_count: number;
    current_streak: number;
    burnout_risk: number;
    last_active: string | null;
    mood_score: number | null;
  };
}

export interface DemoAIRecommendation {
  id: string;
  type: 'follow-up' | 'burnout' | 'trending-down' | 'reward';
  rep_name: string;
  rep_id: string;
  message: string;
  action: string;
}

// Manager dashboard demo team members
export const demoTeamMembers: DemoTeamMember[] = [
  {
    id: 'demo-tm-1',
    full_name: 'Sarah Johnson',
    last_login: new Date().toISOString(),
    role: 'sales_rep',
    stats: {
      call_count: 172,
      win_count: 45,
      current_streak: 5,
      burnout_risk: 10,
      last_active: new Date().toISOString(),
      mood_score: 85,
    },
  },
  {
    id: 'demo-tm-2',
    full_name: 'Michael Chen',
    last_login: new Date(Date.now() - 3600000).toISOString(),
    role: 'sales_rep',
    stats: {
      call_count: 143,
      win_count: 32,
      current_streak: 0,
      burnout_risk: 75,
      last_active: new Date(Date.now() - 3600000).toISOString(),
      mood_score: 45,
    },
  },
  {
    id: 'demo-tm-3',
    full_name: 'Jasmine Lee',
    last_login: new Date(Date.now() - 86400000).toISOString(),
    role: 'sales_rep',
    stats: {
      call_count: 198,
      win_count: 57,
      current_streak: 7,
      burnout_risk: 20,
      last_active: new Date(Date.now() - 43200000).toISOString(),
      mood_score: 90,
    },
  },
];

// Manager dashboard AI recommendations
export const demoManagerRecommendations: DemoAIRecommendation[] = [
  {
    id: 'demo-rec-1',
    type: 'follow-up',
    rep_name: 'Sarah Johnson',
    rep_id: 'demo-tm-1',
    message: 'Sarah missed 3 follow-ups with Enterprise leads this week',
    action: 'Assign Recovery Mode',
  },
  {
    id: 'demo-rec-2',
    type: 'burnout',
    rep_name: 'Michael Chen',
    rep_id: 'demo-tm-2',
    message: 'Michael worked 12+ hours overtime this week and mood score is dropping',
    action: 'Schedule 1-on-1',
  },
];

export {
  enhancedMockLeads as demoLeads,
  enhancedMockActivities as demoActivities,
  enhancedMockCalls as demoCalls,
  mockCRMIntegrations,
  mockWorkflows,
  mockLeadProfile,
  mockAIInsights,
};

export type { MockLead, MockActivity, MockCall };
