
export type Role = 'admin' | 'developer' | 'manager' | 'sales_rep';

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  company_id: string | null;
  email_connected: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
