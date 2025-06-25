
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Role } from './types';
import { logger } from '@/utils/logger';

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    logger.info('Fetching profile for user:', userId, 'auth');
    
    const { data: existingProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      logger.error('Error fetching profile:', error, 'auth');
      return null;
    }

    if (existingProfile) {
      logger.info('Profile found successfully:', { 
        profileId: existingProfile.id, 
        role: existingProfile.role,
        fullName: existingProfile.full_name 
      }, 'auth');
      return existingProfile;
    }
    
    logger.info('No existing profile found, will need to create one', {}, 'auth');
    return null;
  } catch (error) {
    logger.error('Exception while fetching profile:', error, 'auth');
    return null;
  }
};

export const createProfile = async (user: User): Promise<Profile | null> => {
  try {
    logger.info('Creating profile for user:', { 
      userId: user.id, 
      email: user.email,
      metadata: user.user_metadata 
    }, 'auth');
    
    const userRole = user.user_metadata?.role as Role || 'sales_rep';
    const fullName = user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.email?.split('@')[0] || 
                    'User';
    
    const profileData: Partial<Profile> = {
      id: user.id,
      full_name: fullName,
      role: userRole,
      company_id: user.id,
      email: user.email,
      phone_number: null,
      email_connected: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      onboarding_step: null,
      has_completed_onboarding: false,
      user_metadata: user.user_metadata || {},
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

    logger.info('Attempting to create profile with data:', profileData, 'auth');

    const { data: newProfile, error } = await supabase
      .from('profiles')
      .upsert(profileData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select()
      .maybeSingle();

    if (error) {
      logger.error('Error creating profile:', error, 'auth');
      throw error;
    }
    
    if (!newProfile) {
      logger.error('Profile creation returned null data', {}, 'auth');
      return profileData as Profile;
    }
    
    logger.info('Profile created successfully:', {
      profileId: newProfile.id,
      role: newProfile.role,
      fullName: newProfile.full_name
    }, 'auth');
    return newProfile;
  } catch (error) {
    logger.error('Exception while creating profile:', error, 'auth');
    return createFallbackProfile(user);
  }
};

const createFallbackProfile = (user: User): Profile => {
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
    user_metadata: user.user_metadata || {},
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
  return fallbackProfile;
};

export const updateLastLogin = async (userId: string): Promise<void> => {
  try {
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);
    logger.info('Updated last login timestamp', {}, 'auth');
  } catch (updateError) {
    logger.warn('Failed to update last login (non-critical):', updateError, 'auth');
  }
};
