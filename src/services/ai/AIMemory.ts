
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface MemoryEntry {
  id?: string;
  key: string;
  data: any;
  assistantType: string;
  userId?: string;
  companyId?: string;
  createdAt?: string;
  expiresAt?: string;
  metadata?: any;
}

export class AIMemory {
  private static instance: AIMemory;
  private localCache: Map<string, MemoryEntry> = new Map();

  private constructor() {}

  static getInstance(): AIMemory {
    if (!AIMemory.instance) {
      AIMemory.instance = new AIMemory();
    }
    return AIMemory.instance;
  }

  async store(key: string, data: any, assistantType: string, options?: {
    userId?: string;
    companyId?: string;
    expiresIn?: number; // seconds
    metadata?: any;
  }): Promise<void> {
    try {
      const entry: MemoryEntry = {
        key,
        data,
        assistantType,
        userId: options?.userId,
        companyId: options?.companyId,
        createdAt: new Date().toISOString(),
        expiresAt: options?.expiresIn ? 
          new Date(Date.now() + options.expiresIn * 1000).toISOString() : 
          undefined,
        metadata: options?.metadata
      };

      // Store in local cache
      this.localCache.set(this.getCacheKey(key, assistantType), entry);

      // Store in database using ai_agent_tasks table for persistence
      await supabase.from('ai_agent_tasks').insert({
        agent_type: assistantType,
        task_type: 'memory_storage',
        company_id: options?.companyId || 'system',
        user_id: options?.userId,
        status: 'completed',
        input_payload: { key, assistantType },
        output_payload: data,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });

      logger.info('Memory stored', { key, assistantType }, 'ai-memory');
    } catch (error) {
      logger.error('Memory storage failed', error, 'ai-memory');
      throw error;
    }
  }

  async retrieve(key: string, assistantType: string, options?: {
    userId?: string;
    companyId?: string;
  }): Promise<any> {
    try {
      const cacheKey = this.getCacheKey(key, assistantType);
      
      // Check local cache first
      const cached = this.localCache.get(cacheKey);
      if (cached && !this.isExpired(cached)) {
        return cached.data;
      }

      // Query database
      const { data, error } = await supabase
        .from('ai_agent_tasks')
        .select('output_payload, completed_at')
        .eq('agent_type', assistantType)
        .eq('task_type', 'memory_storage')
        .contains('input_payload', { key, assistantType })
        .order('completed_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0].output_payload;
        
        // Update cache
        this.localCache.set(cacheKey, {
          key,
          data: result,
          assistantType,
          createdAt: data[0].completed_at
        });

        return result;
      }

      return null;
    } catch (error) {
      logger.error('Memory retrieval failed', error, 'ai-memory');
      return null;
    }
  }

  async getConversationHistory(assistantType: string, userId?: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agent_tasks')
        .select('input_payload, output_payload, completed_at')
        .eq('agent_type', assistantType)
        .eq('task_type', 'conversation')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      logger.error('Conversation history retrieval failed', error, 'ai-memory');
      return [];
    }
  }

  async storeConversation(assistantType: string, userMessage: string, aiResponse: string, options?: {
    userId?: string;
    companyId?: string;
    context?: any;
  }): Promise<void> {
    try {
      await supabase.from('ai_agent_tasks').insert({
        agent_type: assistantType,
        task_type: 'conversation',
        company_id: options?.companyId || 'system',
        user_id: options?.userId,
        status: 'completed',
        input_payload: { userMessage, context: options?.context },
        output_payload: { aiResponse },
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });

      logger.info('Conversation stored', { assistantType }, 'ai-memory');
    } catch (error) {
      logger.error('Conversation storage failed', error, 'ai-memory');
    }
  }

  async clearExpired(): Promise<void> {
    const now = new Date();
    
    // Clear local cache
    for (const [key, entry] of this.localCache.entries()) {
      if (this.isExpired(entry)) {
        this.localCache.delete(key);
      }
    }

    // Clear database entries older than 30 days
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    await supabase
      .from('ai_agent_tasks')
      .delete()
      .lt('completed_at', thirtyDaysAgo.toISOString())
      .in('task_type', ['memory_storage', 'conversation']);
  }

  private getCacheKey(key: string, assistantType: string): string {
    return `${assistantType}:${key}`;
  }

  private isExpired(entry: MemoryEntry): boolean {
    if (!entry.expiresAt) return false;
    return new Date() > new Date(entry.expiresAt);
  }

  // Cross-AI communication methods
  async shareDataBetweenAIs(fromAI: string, toAI: string, data: any, context?: any): Promise<void> {
    const sharedKey = `cross_ai_${Date.now()}`;
    
    await this.store(sharedKey, {
      fromAI,
      toAI,
      data,
      context,
      sharedAt: new Date().toISOString()
    }, 'company-brain', {
      expiresIn: 3600 // 1 hour
    });

    logger.info('Data shared between AIs', { fromAI, toAI }, 'ai-memory');
  }

  async getSharedData(toAI: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agent_tasks')
        .select('output_payload, completed_at')
        .eq('agent_type', 'company-brain')
        .eq('task_type', 'memory_storage')
        .contains('output_payload', { toAI })
        .gte('completed_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .order('completed_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => item.output_payload) || [];
    } catch (error) {
      logger.error('Shared data retrieval failed', error, 'ai-memory');
      return [];
    }
  }
}
