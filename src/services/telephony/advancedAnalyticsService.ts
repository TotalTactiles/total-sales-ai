
import { supabase } from '@/integrations/supabase/client';

export interface CallAnalytics {
  total_calls: number;
  answered_calls: number;
  missed_calls: number;
  failed_calls: number;
  answer_rate: number;
  total_duration: number;
  average_duration: number;
  peak_call_hours: { hour: number; count: number; }[];
  conversion_rate: number;
  quality_score: number;
}

export interface SMSAnalytics {
  total_messages: number;
  outbound_messages: number;
  inbound_messages: number;
  response_rate: number;
  delivery_rate: number;
  avg_response_time: number;
  popular_templates: string[];
}

export interface RepPerformance {
  rep_id: string;
  rep_name: string;
  calls_made: number;
  calls_answered: number;
  talk_time: number;
  conversion_rate: number;
  quality_score: number;
  sms_sent: number;
  sms_response_rate: number;
}

export class AdvancedAnalyticsService {
  static async getCallAnalytics(
    companyId: string,
    startDate: string,
    endDate: string,
    repId?: string
  ): Promise<CallAnalytics> {
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

      const { data, error } = await query;

      if (error) throw error;

      const sessions = data || [];
      const totalCalls = sessions.length;
      const answeredCalls = sessions.filter(s => s.status === 'answered').length;
      const missedCalls = sessions.filter(s => s.status === 'failed' || s.status === 'cancelled').length;
      const failedCalls = sessions.filter(s => s.status === 'failed').length;
      const answerRate = totalCalls > 0 ? (answeredCalls / totalCalls) * 100 : 0;
      const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const avgDuration = answeredCalls > 0 ? totalDuration / answeredCalls : 0;

      // Calculate peak call hours
      const hourCounts = new Map<number, number>();
      sessions.forEach(session => {
        const hour = new Date(session.created_at).getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      });

      const peakCallHours = Array.from(hourCounts.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      return {
        total_calls: totalCalls,
        answered_calls: answeredCalls,
        missed_calls: missedCalls,
        failed_calls: failedCalls,
        answer_rate: answerRate,
        total_duration: totalDuration,
        average_duration: avgDuration,
        peak_call_hours: peakCallHours,
        conversion_rate: 0, // Would need leads data to calculate
        quality_score: sessions.reduce((sum, s) => sum + (s.quality_score || 0), 0) / sessions.length || 0
      };
    } catch (error) {
      console.error('Error fetching call analytics:', error);
      throw error;
    }
  }

  static async getSMSAnalytics(
    companyId: string,
    startDate: string,
    endDate: string,
    repId?: string
  ): Promise<SMSAnalytics> {
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

      const { data, error } = await query;

      if (error) throw error;

      const messages = data || [];
      const totalMessages = messages.length;
      const outboundMessages = messages.filter(m => m.direction === 'outbound').length;
      const inboundMessages = messages.filter(m => m.direction === 'inbound').length;
      const responseRate = outboundMessages > 0 ? (inboundMessages / outboundMessages) * 100 : 0;
      const deliveryRate = messages.filter(m => m.status === 'delivered').length / totalMessages * 100 || 0;

      return {
        total_messages: totalMessages,
        outbound_messages: outboundMessages,
        inbound_messages: inboundMessages,
        response_rate: responseRate,
        delivery_rate: deliveryRate,
        avg_response_time: 0, // Would need conversation threading to calculate
        popular_templates: []
      };
    } catch (error) {
      console.error('Error fetching SMS analytics:', error);
      throw error;
    }
  }

  static async getRepPerformance(
    companyId: string,
    startDate: string,
    endDate: string
  ): Promise<RepPerformance[]> {
    try {
      const { data: callData, error: callError } = await supabase
        .from('call_sessions')
        .select('user_id, duration, quality_score, status')
        .eq('company_id', companyId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (callError) throw callError;

      const { data: smsData, error: smsError } = await supabase
        .from('sms_conversations')
        .select('user_id, direction')
        .eq('company_id', companyId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (smsError) throw smsError;

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('company_id', companyId);

      if (profileError) throw profileError;

      const repStats = new Map<string, RepPerformance>();

      // Initialize rep performance objects
      profiles?.forEach(profile => {
        repStats.set(profile.id, {
          rep_id: profile.id,
          rep_name: profile.full_name || 'Unknown',
          calls_made: 0,
          calls_answered: 0,
          talk_time: 0,
          conversion_rate: 0,
          quality_score: 0,
          sms_sent: 0,
          sms_response_rate: 0
        });
      });

      // Process call data
      callData?.forEach(call => {
        const rep = repStats.get(call.user_id);
        if (rep) {
          rep.calls_made++;
          if (call.status === 'answered') {
            rep.calls_answered++;
            rep.talk_time += call.duration || 0;
          }
          rep.quality_score += call.quality_score || 0;
        }
      });

      // Process SMS data
      smsData?.forEach(sms => {
        const rep = repStats.get(sms.user_id);
        if (rep && sms.direction === 'outbound') {
          rep.sms_sent++;
        }
      });

      // Calculate averages and rates
      repStats.forEach(rep => {
        if (rep.calls_made > 0) {
          rep.quality_score = rep.quality_score / rep.calls_made;
        }
        // Additional calculations would go here
      });

      return Array.from(repStats.values())
        .filter(rep => rep.calls_made > 0 || rep.sms_sent > 0)
        .sort((a, b) => b.calls_answered - a.calls_answered);
    } catch (error) {
      console.error('Error fetching rep performance:', error);
      throw error;
    }
  }

  static async generateInsights(
    companyId: string,
    startDate: string,
    endDate: string
  ): Promise<string[]> {
    try {
      const insights: string[] = [];

      // Get call analytics for insights
      const callAnalytics = await this.getCallAnalytics(companyId, startDate, endDate);
      const smsAnalytics = await this.getSMSAnalytics(companyId, startDate, endDate);

      // Generate insights based on data
      if (callAnalytics.answer_rate < 50) {
        insights.push('📞 Your answer rate is below 50%. Consider calling during different hours or improving your opening message.');
      }

      if (callAnalytics.peak_call_hours.length > 0) {
        const bestHour = callAnalytics.peak_call_hours[0];
        insights.push(`⏰ Your most successful calling hour is ${bestHour.hour}:00 with ${bestHour.count} calls.`);
      }

      if (smsAnalytics.response_rate > 30) {
        insights.push('💬 Your SMS response rate is strong! Consider increasing SMS outreach.');
      }

      if (callAnalytics.average_duration < 60) {
        insights.push('⏱️ Average call duration is under 1 minute. Focus on engaging prospects longer.');
      }

      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }
}
