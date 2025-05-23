
export interface CaseStudy {
  id: string;
  source_id: string;
  content: string;
  created_at: string;
  industry: string;
  source_type: string;
  company_id: string | null;
  // Additional fields we might add through metadata
  title?: string;
  outcome?: string;
  date?: string;
}
