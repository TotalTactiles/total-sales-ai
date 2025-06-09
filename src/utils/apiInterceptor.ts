import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

export const setupAPIInterceptors = (): void => {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const start = performance.now();
    const response = await originalFetch(input, init);
    const end = performance.now();
    const endpoint = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
    const method = init?.method || (input instanceof Request ? input.method : 'GET');
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
      logger.error('Failed to log fetch request', err);
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
        logger.error('Failed to log axios response', err);
      }
      return response;
    },
    async (error) => {
      const end = performance.now();
      const config = error.config || {};
      const metadata = (config as any).metadata || {};
      const duration = end - (metadata.startTime || end);
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
        logger.error('Failed to log axios error', err);
      }
      return Promise.reject(error);
    }
  );
};
