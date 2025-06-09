import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export async function withRetry<T>(operation: () => Promise<T>, context = 'general'): Promise<T> {
  const delays = [0, 1500, 3000];
  let lastError: any;

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, delays[attempt]));
    }

    try {
      const result = await operation();
      if (attempt > 0) {
        logger.info(`Retry succeeded after ${attempt} attempt(s)`, null, context);
        try {
          await (supabase as any)
            .from('auto_resolved')
            .insert({
              context,
              attempts: attempt,
              resolved_at: new Date().toISOString()
            });
        } catch (logErr) {
          logger.error('Failed to log auto_resolved', logErr, context);
        }
      }
      return result;
    } catch (error) {
      lastError = error;
      logger.warn(`Attempt ${attempt + 1} failed`, error, context);
    }
  }

  try {
    await (supabase as any)
      .from('error_logs')
      .insert({
        provider: context,
        error_type: 'retry_failure',
        error_message: lastError?.message || String(lastError),
        error_details: lastError,
        timestamp: new Date().toISOString()
      });
  } catch (logErr) {
    logger.error('Failed to log to error_logs', logErr, context);
  }

  throw lastError;
}
