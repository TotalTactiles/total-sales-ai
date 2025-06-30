export interface AIAssistantStats {
  emailsDrafted: number;
  callsScheduled: number;
  proposalsGenerated: number;
  performanceImprovement: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
}

export interface PriorityTask {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'proposal';
  title: string;
  description: string;
  suggestedTime: string;
  priority: 'high' | 'medium' | 'low';
  value?: string;
}

export interface PipelineLead {
  id: string;
  company: string;
  contact: string;
  status: 'qualified' | 'proposal' | 'negotiation' | 'closing';
  priority: 'high' | 'medium' | 'low';
  value: string;
  avatar: string;
}

export interface DashboardData {
  aiSummary: string;
  aiAssistant: AIAssistantStats;
  suggestedSchedule: ScheduleItem[];
  priorityTasks: PriorityTask[];
  pipelineData: PipelineLead[];
}
