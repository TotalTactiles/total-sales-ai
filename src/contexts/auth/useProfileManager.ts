
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './types';
import { logger } from '@/utils/logger';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      logger.info('👤 Fetching profile for user:', { userId }, 'profile');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        logger.error('❌ Error fetching profile:', error, 'profile');
        return null;
      }

      if (data) {
        logger.info('✅ Profile fetched successfully:', { 
          userId: data.id, 
          role: data.role 
        }, 'profile');
        setProfile(data as Profile);
        return data as Profile;
      }

      logger.info('ℹ️ No profile found for user:', { userId }, 'profile');
      return null;
    } catch (error) {
      logger.error('❌ Exception fetching profile:', error, 'profile');
      return null;
    }
  }, []);

  const createProfile = useCallback(async (user: User, additionalData?: any) => {
    try {
      logger.info('👤 Creating profile for user:', { 
        userId: user.id, 
        email: user.email 
      }, 'profile');

      const profileData = {
        id: user.id,
        full_name: user.user_metadata?.full_name || additionalData?.full_name || 'User',
        role: additionalData?.role || user.user_metadata?.role || 'sales_rep',
        company_id: user.id, // Use user ID as company ID for individual users
        email_connected: false,
        onboarding_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        logger.error('❌ Error creating profile:', error, 'profile');
        return null;
      }

      logger.info('✅ Profile created successfully:', { 
        userId: data.id, 
        role: data.role 
      }, 'profile');
      
      setProfile(data as Profile);
      return data as Profile;
    } catch (error) {
      logger.error('❌ Exception creating profile:', error, 'profile');
      return null;
    }
  }, []);

  const fetchOrCreateProfile = useCallback(async (user: User) => {
    try {
      // First try to fetch existing profile
      let profile = await fetchProfile(user.id);
      
      // If no profile exists, create one
      if (!profile) {
        profile = await createProfile(user);
      }

      return profile;
    } catch (error) {
      logger.error('❌ Error in fetchOrCreateProfile:', error, 'profile');
      return null;
    }
  }, [fetchProfile, createProfile]);

  const clearProfile = useCallback(() => {
    logger.info('👤 Clearing profile', {}, 'profile');
    setProfile(null);
  }, []);

  return {
    profile,
    setProfile,
    fetchProfile,
    createProfile,
    fetchOrCreateProfile,
    clearProfile
  };
};
