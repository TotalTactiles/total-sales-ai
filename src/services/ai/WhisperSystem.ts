
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { AIMemory } from './AIMemory';

export interface WhisperMessage {
  id?: string;
  fromAI: string;
  toRepId?: string;
  toAI?: string;
  message: string;
  context: any;
  type: 'rep_notification' | 'ai_communication' | 'alert' | 'pulse_check';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt?: string;
  delivered?: boolean;
  read?: boolean;
}

export class WhisperSystem {
  private static instance: WhisperSystem;
  private memory: AIMemory;

  private constructor() {
    this.memory = AIMemory.getInstance();
  }

  static getInstance(): WhisperSystem {
    if (!WhisperSystem.instance) {
      WhisperSystem.instance = new WhisperSystem();
    }
    return WhisperSystem.instance;
  }

  async sendWhisper(whisper: Omit<WhisperMessage, 'id' | 'createdAt' | 'delivered' | 'read'>): Promise<string> {
    try {
      const whisperMessage: WhisperMessage = {
        ...whisper,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        delivered: false,
        read: false
      };

      // Store whisper in memory system
      await this.memory.store(
        `whisper_${whisperMessage.id}`,
        whisperMessage,
        'company-brain',
        {
          companyId: 'system',
          expiresIn: 86400, // 24 hours
          metadata: { type: 'whisper', priority: whisper.priority }
        }
      );

      // If targeting a rep, create a notification
      if (whisper.toRepId) {
        await this.createRepNotification(whisperMessage);
      }

      // If targeting another AI, store in AI communication queue
      if (whisper.toAI) {
        await this.queueAICommunication(whisperMessage);
      }

      // Log the whisper
      await supabase.from('ai_agent_tasks').insert({
        agent_type: whisper.fromAI,
        task_type: 'whisper_sent',
        company_id: 'system',
        status: 'completed',
        input_payload: {
          toRepId: whisper.toRepId,
          toAI: whisper.toAI,
          type: whisper.type,
          priority: whisper.priority
        },
        output_payload: {
          message: whisper.message,
          context: whisper.context
        },
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      });

      logger.info('Whisper sent', { 
        fromAI: whisper.fromAI, 
        toRepId: whisper.toRepId, 
        toAI: whisper.toAI,
        type: whisper.type 
      }, 'whisper-system');

      return whisperMessage.id!;
    } catch (error) {
      logger.error('Whisper sending failed', error, 'whisper-system');
      throw error;
    }
  }

  async getWhispersForRep(repId: string, unreadOnly: boolean = false): Promise<WhisperMessage[]> {
    try {
      const { data, error } = await supabase
        .from('ai_agent_tasks')
        .select('output_payload, input_payload, completed_at')
        .eq('task_type', 'whisper_sent')
        .contains('input_payload', { toRepId: repId })
        .order('completed_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const whispers: WhisperMessage[] = data?.map(item => ({
        id: crypto.randomUUID(),
        fromAI: item.input_payload.fromAI || 'unknown',
        toRepId: repId,
        message: item.output_payload.message,
        context: item.output_payload.context,
        type: item.input_payload.type || 'rep_notification',
        priority: item.input_payload.priority || 'medium',
        createdAt: item.completed_at,
        delivered: true,
        read: false
      })) || [];

      return unreadOnly ? whispers.filter(w => !w.read) : whispers;
    } catch (error) {
      logger.error('Whisper retrieval failed', error, 'whisper-system');
      return [];
    }
  }

  async getAICommunications(toAI: string): Promise<WhisperMessage[]> {
    try {
      const sharedData = await this.memory.getSharedData(toAI);
      
      return sharedData
        .filter(data => data.type === 'ai_communication')
        .map(data => ({
          id: crypto.randomUUID(),
          fromAI: data.fromAI,
          toAI: data.toAI,
          message: data.message,
          context: data.context,
          type: 'ai_communication' as const,
          priority: data.priority || 'medium' as const,
          createdAt: data.sharedAt,
          delivered: true,
          read: false
        }));
    } catch (error) {
      logger.error('AI communication retrieval failed', error, 'whisper-system');
      return [];
    }
  }

  async markWhisperAsRead(whisperId: string): Promise<void> {
    try {
      // In a real implementation, you'd update the read status in the database
      logger.info('Whisper marked as read', { whisperId }, 'whisper-system');
    } catch (error) {
      logger.error('Mark whisper as read failed', error, 'whisper-system');
    }
  }

  async sendAlert(fromAI: string, message: string, context: any, priority: 'high' | 'urgent' = 'high'): Promise<void> {
    await this.sendWhisper({
      fromAI,
      toAI: 'dashboard', // Always route alerts to CEO EA AI
      message,
      context,
      type: 'alert',
      priority
    });
  }

  async sendPulseCheck(fromAI: string, context: any): Promise<void> {
    await this.sendWhisper({
      fromAI,
      toAI: 'dashboard',
      message: 'Pulse check triggered - attention required',
      context,
      type: 'pulse_check',
      priority: 'medium'
    });
  }

  private async createRepNotification(whisper: WhisperMessage): Promise<void> {
    try {
      // Create notification in ai_nudges table
      await supabase.from('ai_nudges').insert({
        company_id: 'system', // This would be actual company ID in real implementation
        rep_id: whisper.toRepId,
        nudge_type: whisper.type,
        title: `Message from ${whisper.fromAI.toUpperCase()} AI`,
        message: whisper.message,
        priority: this.getPriorityNumber(whisper.priority),
        action_url: this.getActionUrl(whisper),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });
    } catch (error) {
      logger.error('Rep notification creation failed', error, 'whisper-system');
    }
  }

  private async queueAICommunication(whisper: WhisperMessage): Promise<void> {
    await this.memory.shareDataBetweenAIs(
      whisper.fromAI,
      whisper.toAI!,
      {
        message: whisper.message,
        context: whisper.context,
        type: whisper.type,
        priority: whisper.priority
      }
    );
  }

  private getPriorityNumber(priority: string): number {
    const priorityMap = { low: 1, medium: 2, high: 3, urgent: 4 };
    return priorityMap[priority as keyof typeof priorityMap] || 2;
  }

  private getActionUrl(whisper: WhisperMessage): string {
    const baseUrls = {
      dashboard: '/manager/dashboard',
      'business-ops': '/manager/business-ops',
      team: '/manager/team',
      leads: '/manager/leads'
    };
    
    return baseUrls[whisper.fromAI as keyof typeof baseUrls] || '/manager/dashboard';
  }
}
