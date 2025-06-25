
export type Role = 'sales_rep' | 'manager' | 'developer' | 'admin';

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
  onboarding_step: number | null;
  has_completed_onboarding: boolean;
  user_metadata: any;
  assistant_name: string;
  voice_style: string;
  industry: string | null;
  onboarding_complete: boolean;
  launched_at: string | null;
  // Sales Rep specific fields
  sales_personality: string | null;
  sales_style: string | null;
  strength_area: string | null;
  rep_motivation: string | null;
  primary_goal: string | null;
  motivation_trigger: string | null;
  weakness: string | null;
  mental_state_trigger: string | null;
  wishlist: string | null;
  // Manager specific fields
  management_style: string | null;
  team_size: number | null;
  preferred_team_personality: string | null;
  team_obstacle: string | null;
  business_goal: string | null;
  influence_style: string | null;
  // AI Assistant configuration
  ai_assistant: any;
}

export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  session: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signUpWithOAuth: (provider: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  fetchProfile: (userId: string) => Promise<Profile | null>;
}
