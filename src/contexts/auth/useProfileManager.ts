
import { useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from './types';
import { fetchProfile, createProfile, updateLastLogin } from './profileService';
import { logger } from '@/utils/logger';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchOrCreateProfile = useCallback(async (user: User) => {
    try {
      logger.info('Starting fetchOrCreateProfile for user:', user.id, 'auth');
      let userProfile = await fetchProfile(user.id);
      
      if (!userProfile) {
        logger.info('Profile not found, creating new profile for user:', user.id, 'auth');
        userProfile = await createProfile(user);
      }

      if (userProfile) {
        logger.info('Setting profile in state:', { 
          userId: user.id, 
          profileRole: userProfile.role,
          profileId: userProfile.id
        }, 'auth');
        setProfile(userProfile);
        
        // Update last login timestamp (non-critical operation)
        setTimeout(() => updateLastLogin(user.id), 0);
      }
    } catch (error) {
      logger.error('Critical error in fetchOrCreateProfile:', error, 'auth');
      // Set a fallback profile to prevent blocking access
      const fallbackProfile: Profile = {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'User',
        role: 'sales_rep',
        company_id: user.id,
        email: user.email,
        phone_number: null,
        email_connected: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        onboarding_step: null,
        has_completed_onboarding: false,
        user_metadata: {},
        assistant_name: 'AI Assistant',
        voice_style: 'professional',
        industry: null,
        onboarding_complete: false,
        launched_at: null,
        sales_personality: null,
        sales_style: null,
        strength_area: null,
        rep_motivation: null,
        primary_goal: null,
        motivation_trigger: null,
        weakness: null,
        mental_state_trigger: null,
        wishlist: null,
        management_style: null,
        team_size: null,
        preferred_team_personality: null,
        team_obstacle: null,
        business_goal: null,
        influence_style: null,
        ai_assistant: null
      };
      logger.warn('Using fallback profile due to error:', fallbackProfile, 'auth');
      setProfile(fallbackProfile);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  return {
    profile,
    setProfile,
    fetchOrCreateProfile,
    clearProfile,
    fetchProfile
  };
};
