
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthContextType, Profile, Role } from './types';
import { initializeDemoUser, isDemoMode as checkDemoMode, setDemoMode, clearDemoMode } from './demoMode';
import { setLastSelectedRole, getLastSelectedRole } from './localStorage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if demo mode is active on initial load
    const demoMode = localStorage.getItem('demoMode');
    const demoRole = localStorage.getItem('demoRole') as Role | null;

    if (demoMode === 'true' && demoRole) {
      console.log("Initializing demo mode from stored values");
      const { demoUser, demoProfile } = initializeDemoUser(demoRole);
      setUser(demoUser);
      setProfile(demoProfile);
      setLoading(false);
      return;
    }

    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change:", event);
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
      console.log("Checking for existing session:", currentSession ? "Found" : "None");
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
      console.log("Fetching profile for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, company_id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        console.log("Profile fetched successfully:", data);
        setProfile(data as Profile);
        
        // Update last login timestamp
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userId);
      } else {
        console.warn("No profile found for user:", userId);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: Role) => {
    try {
      const { error, data } = await supabase.auth.signUp({
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
      
      console.log("Sign up successful:", data);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Sign in successful:", data);
      toast.success('Logged in successfully!');
      
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Starting signout process...");
      
      // Clear demo mode if active
      const wasDemoMode = isDemoMode();
      if (wasDemoMode) {
        console.log("Clearing demo mode");
        clearDemoMode();
      }
      
      // Sign out from Supabase if not in demo mode
      if (!wasDemoMode) {
        await supabase.auth.signOut();
      }
      
      // Clear all auth state
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Navigate to auth page
      console.log("Redirecting to /auth");
      navigate('/auth', { replace: true });
      
      toast.info('You have been logged out');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(error.message || 'Error signing out');
    }
  };

  const initializeDemoMode = (role: Role) => {
    console.log("Initializing demo mode with role:", role);
    setDemoMode(role);
    const { demoUser, demoProfile } = initializeDemoUser(role);
    setUser(demoUser);
    setProfile(demoProfile);
    
    // Navigate to appropriate OS using new structure
    let targetPath = '/sales';
    
    switch (role) {
      case 'developer':
      case 'admin':
        targetPath = '/developer';
        break;
      case 'manager':
        targetPath = '/manager';
        break;
      case 'sales_rep':
      default:
        targetPath = '/sales';
        break;
    }
    
    console.log("Navigating to:", targetPath);
    navigate(targetPath);
  };

  const isDemoMode = () => {
    return checkDemoMode();
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
