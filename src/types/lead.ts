
// Enhanced lead type that includes all necessary fields
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title?: string;
  status: 'qualified' | 'contacted' | 'new' | 'closed' | 'proposal' | 'negotiation';
  score: number;
  priority: 'high' | 'medium' | 'low';
  source: string;
  tags: string[];
  notes: string;
  lastContact: string;
  last_contact?: string; // Alternative naming for database compatibility
  nextFollowUp?: string;
  value: number;
  conversion_likelihood: number;
  industry?: string;
  employeeCount?: number;
  location?: string;
  timezone?: string;
  speed_to_lead?: number;
  is_sensitive?: boolean;
  created_at?: string;
  updated_at?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
  };
  customFields?: {
    currentSolution?: string;
    painPoints?: string[];
    decisionCriteria?: string[];
    budget?: string;
    timeline?: string;
  };
}

// Database lead type for Supabase integration
export interface DatabaseLead extends Lead {
  last_contact: string;
  speed_to_lead: number;
  is_sensitive: boolean;
  created_at: string;
  updated_at: string;
}

// Mock lead type for development
export interface MockLead extends Lead {
  lastContact: string;
}
