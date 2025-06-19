import { User, Session } from '@supabase/supabase-js';

export type Role = 'developer' | 'admin' | 'manager' | 'sales_rep';

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  company_id: string | null;
  email_connected: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
  email_account?: string | null;
  email_provider?: string | null;
  ai_assistant_name?: string | null;
  email?: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null; profile?: Profile }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any | null }>;
  signUpWithOAuth: (provider: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<{ error: any | null }>;
  isDemoMode: () => boolean;
  setDemoRole: (role: Role) => void;
  getDemoRole: () => Role | null;
  initializeDemoMode: (role: Role) => void;
  setLastSelectedRole: (role: Role) => void;
  setLastSelectedCompanyId: (companyId: string) => void;
  fetchProfile: (userId: string) => Promise<Profile | null>;
  getLastSelectedRole: () => Role;
  getLastSelectedCompanyId: () => string | null;
}
