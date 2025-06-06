
import { User, Session, AuthError } from '@supabase/supabase-js';

export type Role = 'sales_rep' | 'manager' | 'developer' | 'admin';

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role: Role;
  company_id?: string;
  email_connected?: boolean;
  email_provider?: string;
  email_account?: string;
  ai_assistant_name?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ profile?: Profile; error?: AuthError }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<Profile | null>;
  isDemoMode: () => boolean;
  setLastSelectedRole: (role: Role) => void;
  getLastSelectedRole: () => Role;
  setLastSelectedCompanyId: (companyId: string) => void;
  getLastSelectedCompanyId: () => string | null;
  initializeDemoMode: (role: Role) => void;
}
