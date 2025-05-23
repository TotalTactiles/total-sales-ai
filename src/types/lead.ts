
export interface Lead {
  id: string;
  name: string;
  company: string;
  source: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  lastContact?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  objection?: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  tags: string[];
  isSensitive: boolean;
  conversionLikelihood: number;
}
