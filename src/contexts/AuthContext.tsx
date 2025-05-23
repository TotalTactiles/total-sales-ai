import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Role = 'manager' | 'sales_rep';

type Profile = {
  id: string;
  full_name: string | null;
  role: Role;
};

type AuthContextType = {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if demo mode is active on initial load
    const demoMode = localStorage.getItem('demoMode');
    const demoRole = localStorage.getItem('demoRole') as Role | null;

    if (demoMode === 'true' && demoRole) {
      // Initialize demo mode user
      initializeDemoUser(demoRole);
      setLoading(false);
      return;
    }

    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          setTimeout(async () => {
            await fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
        
        // Update last login timestamp
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: Role) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;
      
      toast.success('Account created successfully! Please log in.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear demo mode if active
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      navigate('/auth');
      toast.info('You have been logged out');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  // Demo mode functions
  const initializeDemoUser = (role: Role) => {
    // Create a mock user and profile for demo purposes with proper type casting
    const demoUser = {
      id: role === 'manager' ? 'demo-manager-id' : 'demo-sales-rep-id',
      email: role === 'manager' ? 'manager@salesos.com' : 'rep@salesos.com',
      user_metadata: {
        full_name: role === 'manager' ? 'John Manager' : 'Sam Sales',
      },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;

    const demoProfile = {
      id: demoUser.id,
      full_name: demoUser.user_metadata.full_name,
      role: role,
    };

    setUser(demoUser);
    setProfile(demoProfile);
    // We don't set a session for demo mode since it's not a real auth session
  };

  const initializeDemoMode = (role: Role) => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', role);
    initializeDemoUser(role);
  };

  const isDemoMode = () => {
    return localStorage.getItem('demoMode') === 'true';
  };

  // Local storage for last selected role tab
  const setLastSelectedRole = (role: Role) => {
    localStorage.setItem('lastSelectedRole', role);
  };

  const getLastSelectedRole = (): Role => {
    return (localStorage.getItem('lastSelectedRole') as Role) || 'sales_rep';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        setLastSelectedRole,
        getLastSelectedRole,
        initializeDemoMode,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
