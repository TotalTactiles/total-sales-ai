
export interface Profile {
  id: string;
  full_name?: string;
  role: Role;
  company_id?: string;
  email_connected?: boolean;
  onboarding_complete?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  email?: string;
  phone_number?: string;
  profile_picture_url?: string;
  assistant_name?: string;
  voice_style?: string;
  industry?: string;
  sales_personality?: string;
  primary_goal?: string;
  motivation_trigger?: string;
  weakness?: string;
  mental_state_trigger?: string;
  management_style?: string;
  preferred_team_personality?: string;
  team_obstacle?: string;
  business_goal?: string;
  influence_style?: string;
  sales_style?: string;
  strength_area?: string;
  rep_motivation?: string;
}

export type Role = 'admin' | 'developer' | 'manager' | 'sales_rep';

export interface AuthContextType {
  user: any;
  profile: Profile | null;
  loading: boolean;
  session: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, options?: any) => Promise<any>;
  signUpWithOAuth: (provider: 'google' | 'github') => Promise<any>;
  signOut: () => Promise<any>;
  fetchProfile: (userId: string) => Promise<Profile | null>;
}
