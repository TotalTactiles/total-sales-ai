
import { Session, User } from '@supabase/supabase-js';

export type Role = 'manager' | 'sales_rep' | 'admin';

export type Profile = {
  id: string;
  full_name: string | null;
  role: Role;
  company_id?: string; // Added company_id as an optional property
  ai_assistant_name?: string; // Added ai_assistant_name as an optional property
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: Role) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setLastSelectedRole: (role: Role) => void;
  getLastSelectedRole: () => Role;
  initializeDemoMode: (role: Role) => void;
  isDemoMode: () => boolean;
};
