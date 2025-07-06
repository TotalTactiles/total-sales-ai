
export type Role = 'admin' | 'developer' | 'manager' | 'sales_rep';

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  company_id: string | null;
  email: string | null;
  phone_number: string | null;
  email_connected: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  onboarding_step: string | null;
  has_completed_onboarding: boolean;
  assistant_name: string;
  voice_style: string;
  industry: string | null;
  onboarding_complete: boolean;
  sales_personality: string | null;
  sales_style: string | null;
  strength_area: string | null;
  rep_motivation: string | null;
  primary_goal: string | null;
  motivation_trigger: string | null;
  weakness: string | null;
  mental_state_trigger: string | null;
  management_style: string | null;
  team_size: string | null;
  preferred_team_personality: string | null;
  team_obstacle: string | null;
  business_goal: string | null;
  influence_style: string | null;
}

export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, options?: any) => Promise<{ error: any }>;
  signUpWithOAuth: (provider: 'google' | 'github') => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<Profile | null>;
}
