
export const APP_CONFIG = {
  name: 'SalesOS',
  version: '1.0.0',
  description: 'AI-powered sales acceleration platform'
} as const;

export const API_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
} as const;

export const UI_CONFIG = {
  toastDuration: 4000,
  loadingDelay: 200,
  debounceDelay: 300
} as const;

export const DEMO_CONFIG = {
  companyId: 'demo-company',
  managerId: 'demo-manager-id',
  salesRepId: 'demo-sales-rep-id',
  developerId: 'demo-developer-id'
} as const;

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true
  }
} as const;

export const LEAD_STATUS_OPTIONS = [
  'new',
  'contacted', 
  'qualified',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost'
] as const;

export const LEAD_PRIORITY_OPTIONS = [
  'low',
  'medium', 
  'high'
] as const;
