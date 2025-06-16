
import { User, Session, AuthError, Provider } from '@supabase/supabase-js';

export type Role = 'developer' | 'admin' | 'manager' | 'sales_rep';

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  email_provider?: string | null;
  email_account?: string | null;
  created_at?: string;
  updated_at?: string;
  last_login?: string | null;
  company_id?: string | null;
  email_connected?: boolean;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError; profile?: Profile | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: AuthError }>;
  signUpWithOAuth: (provider: Provider) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<Profile | null>;
  isDemoMode: () => boolean;
  setLastSelectedRole: (role: Role) => void;
  getLastSelectedRole: () => Role;
  setLastSelectedCompanyId: (companyId: string) => void;
  getLastSelectedCompanyId: () => string | null;
  initializeDemoMode: (role: Role) => void;
}
