
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high';
  source: string;
  score: number;
  conversionLikelihood: number;
  lastContact: string;
  speedToLead: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  companyId: string;
  isSensitive: boolean;
}

export interface LeadFilters {
  status?: Lead['status'][];
  priority?: Lead['priority'][];
  source?: string[];
  tags?: string[];
  scoreRange?: [number, number];
  dateRange?: [string, string];
}

export interface LeadSortOptions {
  field: keyof Lead;
  direction: 'asc' | 'desc';
}
