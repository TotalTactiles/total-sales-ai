
import { User, Session, AuthError } from '@supabase/supabase-js';

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
  email?: string | null;
  ai_assistant_name?: string | null;
  email_account?: string | null;
  email_provider?: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: AuthError | null }>;
  signUpWithOAuth: (provider: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isDemoMode: () => boolean;
  setDemoRole: (role: Role) => void;
  getDemoRole: () => Role | null;
  initializeDemoMode: (role: Role) => void;
  setLastSelectedRole: (role: Role) => void;
  setLastSelectedCompanyId: (companyId: string) => void;
  fetchProfile: (userId: string) => Promise<Profile | null>;
  getLastSelectedRole: () => Role | null;
  getLastSelectedCompanyId: () => string | null;
}
