
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export class UserCacheManager {
  /**
   * Clear all user-specific cache and session data
   */
  static async clearUserCache(): Promise<void> {
    try {
      logger.info('Starting user cache clearing...', {}, 'auth');
      
      // Sign out the current user
      await supabase.auth.signOut();
      
      // Clear localStorage items related to auth and onboarding
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('supabase') ||
          key.includes('auth') ||
          key.includes('onboarding_complete') ||
          key.includes('profile') ||
          key.includes('user')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        logger.info(`Removed localStorage key: ${key}`, {}, 'auth');
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear any React Query cache related to user data
      if ((window as any).__REACT_QUERY_CLIENT__) {
        (window as any).__REACT_QUERY_CLIENT__.clear();
      }
      
      logger.info('User cache cleared successfully', {}, 'auth');
      
      // Reload the page to ensure clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
      
    } catch (error) {
      logger.error('Error clearing user cache:', error, 'auth');
      throw error;
    }
  }
  
  /**
   * Clear onboarding completion flags for all companies
   */
  static clearOnboardingFlags(): void {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('onboarding_complete_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      logger.info(`Cleared onboarding flag: ${key}`, {}, 'auth');
    });
  }
}

export const clearUserCache = () => UserCacheManager.clearUserCache();
export const clearOnboardingFlags = () => UserCacheManager.clearOnboardingFlags();
