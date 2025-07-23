
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CallAnalytics {
  total_calls: number;
  answered_calls: number;
  answer_rate: number;
  average_duration: number;
  total_duration: number;
  missed_calls: number;
  failed_calls: number;
  recordings_count: number;
  transcriptions_count: number;
  sentiment_scores: number[];
  quality_scores: number[];
  peak_call_hours: { hour: number; count: number }[];
  conversion_metrics: {
    calls_to_meetings: number;
    calls_to_sales: number;
    conversion_rate: number;
  };
}

export interface SMSAnalytics {
  total_messages: number;
  outbound_messages: number;
  inbound_messages: number;
  response_rate: number;
  average_response_time: number;
  delivery_rate: number;
  thread_count: number;
  active_conversations: number;
}

export interface RepPerformance {
  rep_id: string;
  rep_name: string;
  calls_made: number;
  calls_answered: number;
  talk_time: number;
  average_call_duration: number;
  conversion_rate: number;
  quality_score: number;
  sentiment_score: number;
  activities_completed: number;
  revenue_attributed: number;
}

export class AdvancedAnalyticsService {
  static async getCallAnalytics(
    companyId: string,
    startDate: string,
    endDate: string,
    repId?: string
  ): Promise<CallAnalytics | null> {
    try {
      let query = supabase
        .from('call_sessions')
        .select('*')
        .eq('company_id', companyId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (repId) {
        query = query.eq('user_id', repId);
      }

      const { data: calls, error } = await query;

      if (error) {
        console.error('Error fetching call analytics:', error);
        return null;
      }

      const totalCalls = calls?.length || 0;
      const answeredCalls = calls?.filter(c => c.status === 'answered' || c.status === 'completed').length || 0;
      const missedCalls = calls?.filter(c => c.status === 'failed' || c.status === 'cancelled').length || 0;
      const failedCalls = calls?.filter(c => c.status === 'failed').length || 0;

      const durations = calls?.filter(c => c.duration > 0).map(c => c.duration) || [];
      const totalDuration = durations.reduce((sum, d) => sum + d, 0);
      const averageDuration = durations.length > 0 ? totalDuration / durations.length : 0;

      const sentimentScores = calls?.filter(c => c.sentiment_score).map(c => c.sentiment_score) || [];
      const qualityScores = calls?.filter(c => c.quality_score).map(c => c.quality_score) || [];

      // Calculate peak call hours
      const peakHours = calls?.reduce((acc, call) => {
        const hour = new Date(call.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>) || {};

      const peakCallHours = Object.entries(peakHours)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      return {
        total_calls: totalCalls,
        answered_calls: answeredCalls,
        answer_rate: totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0,
        average_duration: averageDuration,
        total_duration: totalDuration,
        missed_calls: missedCalls,
        failed_calls: failedCalls,
        recordings_count: calls?.filter(c => c.recording_url).length || 0,
        transcriptions_count: calls?.filter(c => c.transcription).length || 0,
        sentiment_scores: sentimentScores,
        quality_scores: qualityScores,
        peak_call_hours: peakCallHours,
        conversion_metrics: {
          calls_to_meetings: 0, // TODO: Calculate from CRM data
          calls_to_sales: 0, // TODO: Calculate from CRM data
          conversion_rate: 0 // TODO: Calculate from CRM data
        }
      };
    } catch (error) {
      console.error('Error calculating call analytics:', error);
      return null;
    }
  }

  static async getSMSAnalytics(
    companyId: string,
    startDate: string,
    endDate: string,
    repId?: string
  ): Promise<SMSAnalytics | null> {
    try {
      let query = supabase
        .from('sms_conversations')
        .select('*')
        .eq('company_id', companyId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (repId) {
        query = query.eq('user_id', repId);
      }

      const { data: messages, error } = await query;

      if (error) {
        console.error('Error fetching SMS analytics:', error);
        return null;
      }

      const totalMessages = messages?.length || 0;
      const outboundMessages = messages?.filter(m => m.direction === 'outbound').length || 0;
      const inboundMessages = messages?.filter(m => m.direction === 'inbound').length || 0;
      const deliveredMessages = messages?.filter(m => m.status === 'delivered').length || 0;

      const threads = new Set(messages?.map(m => m.thread_id).filter(Boolean)).size;

      return {
        total_messages: totalMessages,
        outbound_messages: outboundMessages,
        inbound_messages: inboundMessages,
        response_rate: outboundMessages > 0 ? (inboundMessages / outboundMessages) * 100 : 0,
        average_response_time: 0, // TODO: Calculate from message timestamps
        delivery_rate: totalMessages > 0 ? (deliveredMessages / totalMessages) * 100 : 0,
        thread_count: threads,
        active_conversations: threads // Simplified for now
      };
    } catch (error) {
      console.error('Error calculating SMS analytics:', error);
      return null;
    }
  }

  static async getRepPerformance(
    companyId: string,
    startDate: string,
    endDate: string
  ): Promise<RepPerformance[]> {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('company_id', companyId)
        .eq('role', 'sales_rep');

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        return [];
      }

      const performance: RepPerformance[] = [];

      for (const profile of profiles || []) {
        const callAnalytics = await this.getCallAnalytics(companyId, startDate, endDate, profile.id);
        const smsAnalytics = await this.getSMSAnalytics(companyId, startDate, endDate, profile.id);

        if (callAnalytics) {
          performance.push({
            rep_id: profile.id,
            rep_name: profile.full_name,
            calls_made: callAnalytics.total_calls,
            calls_answered: callAnalytics.answered_calls,
            talk_time: callAnalytics.total_duration,
            average_call_duration: callAnalytics.average_duration,
            conversion_rate: callAnalytics.conversion_metrics.conversion_rate,
            quality_score: callAnalytics.quality_scores.length > 0 
              ? callAnalytics.quality_scores.reduce((a, b) => a + b, 0) / callAnalytics.quality_scores.length 
              : 0,
            sentiment_score: callAnalytics.sentiment_scores.length > 0 
              ? callAnalytics.sentiment_scores.reduce((a, b) => a + b, 0) / callAnalytics.sentiment_scores.length 
              : 0,
            activities_completed: callAnalytics.total_calls + (smsAnalytics?.total_messages || 0),
            revenue_attributed: 0 // TODO: Calculate from CRM data
          });
        }
      }

      return performance.sort((a, b) => b.calls_made - a.calls_made);
    } catch (error) {
      console.error('Error calculating rep performance:', error);
      return [];
    }
  }

  static async generateInsights(
    companyId: string,
    startDate: string,
    endDate: string
  ): Promise<string[]> {
    try {
      const callAnalytics = await this.getCallAnalytics(companyId, startDate, endDate);
      const smsAnalytics = await this.getSMSAnalytics(companyId, startDate, endDate);
      const repPerformance = await this.getRepPerformance(companyId, startDate, endDate);

      const insights: string[] = [];

      if (callAnalytics) {
        if (callAnalytics.answer_rate < 30) {
          insights.push(`Low answer rate (${callAnalytics.answer_rate.toFixed(1)}%). Consider calling during peak hours or improving lead quality.`);
        }

        if (callAnalytics.average_duration < 120) {
          insights.push(`Short average call duration (${Math.round(callAnalytics.average_duration)}s). Focus on engagement and discovery techniques.`);
        }

        if (callAnalytics.peak_call_hours.length > 0) {
          const bestHour = callAnalytics.peak_call_hours[0];
          insights.push(`Most successful calling hour: ${bestHour.hour}:00 with ${bestHour.count} calls.`);
        }
      }

      if (smsAnalytics) {
        if (smsAnalytics.response_rate < 20) {
          insights.push(`Low SMS response rate (${smsAnalytics.response_rate.toFixed(1)}%). Consider personalizing messages or adjusting timing.`);
        }

        if (smsAnalytics.delivery_rate < 95) {
          insights.push(`SMS delivery issues (${smsAnalytics.delivery_rate.toFixed(1)}% delivered). Check phone number quality.`);
        }
      }

      if (repPerformance.length > 0) {
        const topRep = repPerformance[0];
        insights.push(`Top performer: ${topRep.rep_name} with ${topRep.calls_made} calls and ${topRep.calls_answered} connections.`);

        const avgCallsPerRep = repPerformance.reduce((sum, rep) => sum + rep.calls_made, 0) / repPerformance.length;
        const underperformers = repPerformance.filter(rep => rep.calls_made < avgCallsPerRep * 0.7);
        
        if (underperformers.length > 0) {
          insights.push(`${underperformers.length} reps are below average activity. Consider additional coaching or support.`);
        }
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }
}
