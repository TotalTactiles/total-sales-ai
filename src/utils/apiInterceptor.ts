import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

export const setupAPIInterceptors = (): void => {
  try {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const start = performance.now();
      const response = await originalFetch(input, init);
      const end = performance.now();
      const endpoint = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
      const method = init?.method || (input instanceof Request ? input.method : 'GET');
      
      // Skip logging for auth-related requests to avoid circular dependencies
      if (endpoint.includes('/auth/') || endpoint.includes('supabase')) {
        return response;
      }
      
      try {
        const { data } = await supabase.auth.getSession();
        await supabase.from('api_logs').insert({
          endpoint,
          method,
          status: response.status,
          response_time: Math.round(end - start),
          user_id: data.session?.user?.id ?? null,
        });
      } catch (err) {
        // Silently fail to avoid breaking app
      }
      return response;
    };

    axios.interceptors.request.use((config) => {
      (config as any).metadata = { startTime: performance.now() };
      return config;
    });

    axios.interceptors.response.use(
      async (response) => {
        const end = performance.now();
        const metadata = (response.config as any).metadata || {};
        const duration = end - (metadata.startTime || end);
        
        // Skip logging for auth-related requests
        if (response.config.url?.includes('/auth/') || response.config.url?.includes('supabase')) {
          return response;
        }
        
        try {
          const { data } = await supabase.auth.getSession();
          await supabase.from('api_logs').insert({
            endpoint: response.config.url || '',
            method: (response.config.method || 'GET').toUpperCase(),
            status: response.status,
            response_time: Math.round(duration),
            user_id: data.session?.user?.id ?? null,
          });
        } catch (err) {
          // Silently fail to avoid breaking app
        }
        return response;
      },
      async (error) => {
        const end = performance.now();
        const config = error.config || {};
        const metadata = (config as any).metadata || {};
        const duration = end - (metadata.startTime || end);
        
        // Skip logging for auth-related requests
        if (config.url?.includes('/auth/') || config.url?.includes('supabase')) {
          return Promise.reject(error);
        }
        
        try {
          const { data } = await supabase.auth.getSession();
          await supabase.from('api_logs').insert({
            endpoint: config.url || '',
            method: (config.method || 'GET').toUpperCase(),
            status: error.response?.status || 0,
            response_time: Math.round(duration),
            user_id: data.session?.user?.id ?? null,
          });
        } catch (err) {
          // Silently fail to avoid breaking app
        }
        return Promise.reject(error);
      }
    );
  } catch (err) {
    logger.warn('Failed to setup API interceptors:', err);
  }
};
