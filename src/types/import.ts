
export interface ImportSession {
  id: string;
  company_id: string;
  user_id: string;
  import_type: 'csv' | 'zoho' | 'clickup' | 'gohighlevel';
  status: 'pending' | 'mapping' | 'reviewing' | 'importing' | 'completed' | 'failed';
  file_name?: string;
  total_records: number;
  processed_records: number;
  successful_imports: number;
  failed_imports: number;
  duplicate_records: number;
  field_mapping: Record<string, string>;
  import_summary: ImportSummary;
  ai_recommendations: AIRecommendation[];
  error_details?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ImportRawData {
  id: string;
  import_session_id: string;
  row_index: number;
  raw_data: Record<string, any>;
  processed_data?: Record<string, any>;
  status: 'pending' | 'mapped' | 'duplicate' | 'error' | 'imported';
  error_message?: string;
  created_at: string;
}

export interface FieldMappingTemplate {
  id: string;
  company_id?: string;
  import_type: string;
  source_field: string;
  target_field: string;
  confidence_score: number;
  usage_count: number;
  industry?: string;
  created_at: string;
  updated_at: string;
}

export interface ImportDuplicate {
  id: string;
  import_session_id: string;
  raw_data_id: string;
  existing_lead_id?: string;
  duplicate_reason: 'email_match' | 'phone_match' | 'name_company_match';
  confidence_score: number;
  action: 'pending' | 'merge' | 'skip' | 'import_anyway';
  created_at: string;
}

export interface ImportSummary {
  totalLeads: number;
  readyToImport: number;
  flaggedForAttention: number;
  duplicatesFound: number;
  skippedRecords: number;
  dataQuality: {
    hasEmail: number;
    hasPhone: number;
    hasCompany: number;
    missingCriticalData: number;
  };
}

export interface AIRecommendation {
  id: string;
  type: 'field_mapping' | 'data_enrichment' | 'duplicate_handling' | 'workflow_setup';
  title: string;
  description: string;
  action?: string;
  confidence: number;
  accepted?: boolean;
}

export interface FieldMapping {
  source: string;
  target: string;
  confidence: number;
  dataType: 'text' | 'email' | 'phone' | 'number' | 'date' | 'boolean';
  sampleValues: string[];
}

export interface ImportPreview {
  headers: string[];
  rows: Record<string, any>[];
  totalRows: number;
  suggestedMappings: FieldMapping[];
  detectedIssues: {
    type: 'missing_email' | 'invalid_phone' | 'empty_name' | 'duplicate_data';
    rowIndex: number;
    field: string;
    value: any;
    suggestion?: string;
  }[];
}
