export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agent_trigger_logs: {
        Row: {
          agent_name: string
          created_at: string | null
          id: string
          input_payload: Json | null
          result_status: string | null
          timestamp: string | null
          trigger_type: string
          triggered_by: string | null
        }
        Insert: {
          agent_name: string
          created_at?: string | null
          id?: string
          input_payload?: Json | null
          result_status?: string | null
          timestamp?: string | null
          trigger_type: string
          triggered_by?: string | null
        }
        Update: {
          agent_name?: string
          created_at?: string | null
          id?: string
          input_payload?: Json | null
          result_status?: string | null
          timestamp?: string | null
          trigger_type?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      ai_agent_personas: {
        Row: {
          created_at: string | null
          delivery_style: string | null
          id: string
          last_training: string | null
          level: number
          name: string
          tone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_style?: string | null
          id?: string
          last_training?: string | null
          level?: number
          name: string
          tone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivery_style?: string | null
          id?: string
          last_training?: string | null
          level?: number
          name?: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_agent_status: {
        Row: {
          agent_name: string
          error_count: number | null
          id: string
          last_health_check: string | null
          metadata: Json | null
          response_time_ms: number | null
          status: string
          success_count: number | null
          updated_at: string | null
        }
        Insert: {
          agent_name: string
          error_count?: number | null
          id?: string
          last_health_check?: string | null
          metadata?: Json | null
          response_time_ms?: number | null
          status?: string
          success_count?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_name?: string
          error_count?: number | null
          id?: string
          last_health_check?: string | null
          metadata?: Json | null
          response_time_ms?: number | null
          status?: string
          success_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_agent_tasks: {
        Row: {
          agent_type: string
          company_id: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          input_payload: Json | null
          output_payload: Json | null
          retry_count: number | null
          started_at: string | null
          status: string
          task_type: string
          user_id: string | null
        }
        Insert: {
          agent_type: string
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_payload?: Json | null
          output_payload?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          task_type: string
          user_id?: string | null
        }
        Update: {
          agent_type?: string
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_payload?: Json | null
          output_payload?: Json | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          task_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_brain_insights: {
        Row: {
          accepted: boolean | null
          company_id: string | null
          context: Json | null
          id: string
          suggestion_text: string | null
          timestamp: string | null
          triggered_by: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          accepted?: boolean | null
          company_id?: string | null
          context?: Json | null
          id?: string
          suggestion_text?: string | null
          timestamp?: string | null
          triggered_by?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          accepted?: boolean | null
          company_id?: string | null
          context?: Json | null
          id?: string
          suggestion_text?: string | null
          timestamp?: string | null
          triggered_by?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_brain_logs: {
        Row: {
          company_id: string | null
          event_summary: string | null
          id: string
          payload: Json | null
          processed: boolean | null
          timestamp: string | null
          type: string | null
          visibility: string | null
        }
        Insert: {
          company_id?: string | null
          event_summary?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          timestamp?: string | null
          type?: string | null
          visibility?: string | null
        }
        Update: {
          company_id?: string | null
          event_summary?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          timestamp?: string | null
          type?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      ai_nudges: {
        Row: {
          action_url: string | null
          company_id: string
          created_at: string | null
          dismissed: boolean | null
          expires_at: string | null
          id: string
          message: string
          nudge_type: string
          priority: number | null
          rep_id: string | null
          seen: boolean | null
          title: string
        }
        Insert: {
          action_url?: string | null
          company_id: string
          created_at?: string | null
          dismissed?: boolean | null
          expires_at?: string | null
          id?: string
          message: string
          nudge_type: string
          priority?: number | null
          rep_id?: string | null
          seen?: boolean | null
          title: string
        }
        Update: {
          action_url?: string | null
          company_id?: string
          created_at?: string | null
          dismissed?: boolean | null
          expires_at?: string | null
          id?: string
          message?: string
          nudge_type?: string
          priority?: number | null
          rep_id?: string | null
          seen?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_nudges_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_logs: {
        Row: {
          created_at: string | null
          endpoint: string | null
          id: string
          method: string | null
          response_time: number | null
          status: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          method?: string | null
          response_time?: number | null
          status?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string | null
          id?: string
          method?: string | null
          response_time?: number | null
          status?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          id: string
          last_updated: string | null
          provider: string
          rate_limited_until: string | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          provider: string
          rate_limited_until?: string | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          provider?: string
          rate_limited_until?: string | null
        }
        Relationships: []
      }
      automationagent_memory: {
        Row: {
          automation_id: string
          created_at: string | null
          event_type: string
          id: string
          input_data: Json | null
          resolution_time: number | null
          retry_count: number | null
          status: string | null
          trigger_timestamp: string | null
          updated_at: string | null
        }
        Insert: {
          automation_id?: string
          created_at?: string | null
          event_type: string
          id?: string
          input_data?: Json | null
          resolution_time?: number | null
          retry_count?: number | null
          status?: string | null
          trigger_timestamp?: string | null
          updated_at?: string | null
        }
        Update: {
          automation_id?: string
          created_at?: string | null
          event_type?: string
          id?: string
          input_data?: Json | null
          resolution_time?: number | null
          retry_count?: number | null
          status?: string | null
          trigger_timestamp?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      call_events: {
        Row: {
          call_session_id: string
          event_data: Json | null
          event_type: string
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          call_session_id: string
          event_data?: Json | null
          event_type: string
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          call_session_id?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_events_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          call_sid: string | null
          call_type: string
          company_id: string
          created_at: string | null
          duration: number | null
          id: string
          lead_id: string | null
          notes: string | null
          recording_url: string | null
          status: string
          user_id: string
        }
        Insert: {
          call_sid?: string | null
          call_type: string
          company_id: string
          created_at?: string | null
          duration?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          recording_url?: string | null
          status: string
          user_id: string
        }
        Update: {
          call_sid?: string | null
          call_type?: string
          company_id?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          recording_url?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      call_recordings: {
        Row: {
          call_session_id: string
          created_at: string | null
          duration: number | null
          file_size: number | null
          id: string
          keywords: string[] | null
          recording_sid: string
          recording_url: string
          sentiment_analysis: Json | null
          transcription: string | null
          transcription_confidence: number | null
        }
        Insert: {
          call_session_id: string
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          keywords?: string[] | null
          recording_sid: string
          recording_url: string
          sentiment_analysis?: Json | null
          transcription?: string | null
          transcription_confidence?: number | null
        }
        Update: {
          call_session_id?: string
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          keywords?: string[] | null
          recording_sid?: string
          recording_url?: string
          sentiment_analysis?: Json | null
          transcription?: string | null
          transcription_confidence?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_recordings_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sessions: {
        Row: {
          answered_at: string | null
          call_sid: string
          company_id: string
          created_at: string | null
          direction: string
          disposition: string | null
          duration: number | null
          ended_at: string | null
          from_number: string
          id: string
          lead_id: string | null
          metadata: Json | null
          notes: string | null
          quality_score: number | null
          recording_sid: string | null
          recording_url: string | null
          sentiment_score: number | null
          started_at: string | null
          status: string
          to_number: string
          transcription: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answered_at?: string | null
          call_sid: string
          company_id: string
          created_at?: string | null
          direction: string
          disposition?: string | null
          duration?: number | null
          ended_at?: string | null
          from_number: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          notes?: string | null
          quality_score?: number | null
          recording_sid?: string | null
          recording_url?: string | null
          sentiment_score?: number | null
          started_at?: string | null
          status?: string
          to_number: string
          transcription?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answered_at?: string | null
          call_sid?: string
          company_id?: string
          created_at?: string | null
          direction?: string
          disposition?: string | null
          duration?: number | null
          ended_at?: string | null
          from_number?: string
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          notes?: string | null
          quality_score?: number | null
          recording_sid?: string | null
          recording_url?: string | null
          sentiment_score?: number | null
          started_at?: string | null
          status?: string
          to_number?: string
          transcription?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      call_supervision: {
        Row: {
          call_session_id: string
          ended_at: string | null
          id: string
          notes: string | null
          started_at: string | null
          supervision_type: string
          supervisor_id: string
        }
        Insert: {
          call_session_id: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          supervision_type: string
          supervisor_id: string
        }
        Update: {
          call_session_id?: string
          ended_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          supervision_type?: string
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_supervision_call_session_id_fkey"
            columns: ["call_session_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_attachments: {
        Row: {
          chat_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          message_id: string
          uploaded_by: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          message_id: string
          uploaded_by: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          message_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_attachments_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_participants: {
        Row: {
          chat_id: string
          id: string
          is_pinned: boolean | null
          joined_at: string
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: string
          is_pinned?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: string
          is_pinned?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          company_id: string
          created_at: string
          created_by: string
          id: string
          last_message_at: string | null
          name: string | null
          participants: string[]
          type: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by: string
          id?: string
          last_message_at?: string | null
          name?: string | null
          participants: string[]
          type?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string
          id?: string
          last_message_at?: string | null
          name?: string | null
          participants?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_brains: {
        Row: {
          ai_insights: Json | null
          ai_learnings: Json | null
          business_goals: Json | null
          company_id: string
          created_at: string | null
          id: string
          rep_behaviors: Json | null
          source_performance: Json | null
          updated_at: string | null
        }
        Insert: {
          ai_insights?: Json | null
          ai_learnings?: Json | null
          business_goals?: Json | null
          company_id: string
          created_at?: string | null
          id?: string
          rep_behaviors?: Json | null
          source_performance?: Json | null
          updated_at?: string | null
        }
        Update: {
          ai_insights?: Json | null
          ai_learnings?: Json | null
          business_goals?: Json | null
          company_id?: string
          created_at?: string | null
          id?: string
          rep_behaviors?: Json | null
          source_performance?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_master_ai: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          last_synced_at: string | null
          most_clicked_features: string[] | null
          top_weaknesses: string[] | null
          updated_at: string | null
          wishlist_tags: string[] | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          most_clicked_features?: string[] | null
          top_weaknesses?: string[] | null
          updated_at?: string | null
          wishlist_tags?: string[] | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          last_synced_at?: string | null
          most_clicked_features?: string[] | null
          top_weaknesses?: string[] | null
          updated_at?: string | null
          wishlist_tags?: string[] | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          agent_name: string | null
          company_id: string
          created_at: string | null
          customIndustry: string | null
          enabled_modules: Json | null
          guided_tour_completed: boolean | null
          id: string
          industry: string | null
          last_feedback_check: string | null
          onboarding_completed_at: string | null
          original_goal: string | null
          pain_points: string[] | null
          personalization_flags: Json | null
          sales_model: string[] | null
          team_roles: string[] | null
          tone: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_name?: string | null
          company_id: string
          created_at?: string | null
          customIndustry?: string | null
          enabled_modules?: Json | null
          guided_tour_completed?: boolean | null
          id?: string
          industry?: string | null
          last_feedback_check?: string | null
          onboarding_completed_at?: string | null
          original_goal?: string | null
          pain_points?: string[] | null
          personalization_flags?: Json | null
          sales_model?: string[] | null
          team_roles?: string[] | null
          tone?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_name?: string | null
          company_id?: string
          created_at?: string | null
          customIndustry?: string | null
          enabled_modules?: Json | null
          guided_tour_completed?: boolean | null
          id?: string
          industry?: string | null
          last_feedback_check?: string | null
          onboarding_completed_at?: string | null
          original_goal?: string | null
          pain_points?: string[] | null
          personalization_flags?: Json | null
          sales_model?: string[] | null
          team_roles?: string[] | null
          tone?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_summary: {
        Row: {
          ai_insights: Json | null
          company_id: string
          last_updated: string | null
          summary: string | null
        }
        Insert: {
          ai_insights?: Json | null
          company_id: string
          last_updated?: string | null
          summary?: string | null
        }
        Update: {
          ai_insights?: Json | null
          company_id?: string
          last_updated?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      confidence_cache: {
        Row: {
          context: string | null
          created_at: string | null
          date_achieved: string | null
          id: string
          objection_handled: string | null
          user_id: string
          win_description: string
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          date_achieved?: string | null
          id?: string
          objection_handled?: string | null
          user_id: string
          win_description: string
        }
        Update: {
          context?: string | null
          created_at?: string | null
          date_achieved?: string | null
          id?: string
          objection_handled?: string | null
          user_id?: string
          win_description?: string
        }
        Relationships: []
      }
      crm_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          provider: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          provider?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      developeragent_memory: {
        Row: {
          agent_affected: string
          created_at: string | null
          error_details: string | null
          error_type: string | null
          escalation_flag: boolean | null
          id: string
          log_timestamp: string | null
          resolution_action: string | null
          retry_count: number | null
          task_id: string
          updated_at: string | null
        }
        Insert: {
          agent_affected: string
          created_at?: string | null
          error_details?: string | null
          error_type?: string | null
          escalation_flag?: boolean | null
          id?: string
          log_timestamp?: string | null
          resolution_action?: string | null
          retry_count?: number | null
          task_id?: string
          updated_at?: string | null
        }
        Update: {
          agent_affected?: string
          created_at?: string | null
          error_details?: string | null
          error_type?: string | null
          escalation_flag?: boolean | null
          id?: string
          log_timestamp?: string | null
          resolution_action?: string | null
          retry_count?: number | null
          task_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dialer_campaigns: {
        Row: {
          call_script: string | null
          company_id: string
          created_at: string | null
          id: string
          lead_filters: Json | null
          max_attempts: number | null
          name: string
          retry_delay_minutes: number | null
          status: string
          timezone: string | null
          updated_at: string | null
          user_id: string
          working_hours_end: string | null
          working_hours_start: string | null
        }
        Insert: {
          call_script?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          lead_filters?: Json | null
          max_attempts?: number | null
          name: string
          retry_delay_minutes?: number | null
          status?: string
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Update: {
          call_script?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          lead_filters?: Json | null
          max_attempts?: number | null
          name?: string
          retry_delay_minutes?: number | null
          status?: string
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          working_hours_end?: string | null
          working_hours_start?: string | null
        }
        Relationships: []
      }
      dialer_queue: {
        Row: {
          attempts: number | null
          campaign_id: string
          created_at: string | null
          id: string
          last_attempt_at: string | null
          lead_id: string
          next_attempt_at: string | null
          phone_number: string
          priority: number | null
          status: string
        }
        Insert: {
          attempts?: number | null
          campaign_id: string
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          lead_id: string
          next_attempt_at?: string | null
          phone_number: string
          priority?: number | null
          status?: string
        }
        Update: {
          attempts?: number | null
          campaign_id?: string
          created_at?: string | null
          id?: string
          last_attempt_at?: string | null
          lead_id?: string
          next_attempt_at?: string | null
          phone_number?: string
          priority?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "dialer_queue_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "dialer_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          body_template: string
          company_id: string
          created_at: string | null
          delay_hours: number | null
          id: string
          is_active: boolean | null
          name: string
          subject_template: string
        }
        Insert: {
          body_template: string
          company_id: string
          created_at?: string | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          subject_template: string
        }
        Update: {
          body_template?: string
          company_id?: string
          created_at?: string | null
          delay_hours?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject_template?: string
        }
        Relationships: []
      }
      email_tokens: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          provider: string
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          provider: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: string | null
          error_code: string | null
          error_details: Json | null
          error_message: string
          error_type: string
          id: string
          provider: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          context?: string | null
          error_code?: string | null
          error_details?: Json | null
          error_message: string
          error_type: string
          id?: string
          provider: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          context?: string | null
          error_code?: string | null
          error_details?: Json | null
          error_message?: string
          error_type?: string
          id?: string
          provider?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          enabled: boolean | null
          flag_name: string
          id: string
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          flag_name: string
          id?: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          flag_name?: string
          id?: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_requests: {
        Row: {
          company_id: string | null
          context: string | null
          created_at: string | null
          feature_name: string | null
          id: string
          industry: string | null
          validated: boolean | null
          votes: number | null
        }
        Insert: {
          company_id?: string | null
          context?: string | null
          created_at?: string | null
          feature_name?: string | null
          id?: string
          industry?: string | null
          validated?: boolean | null
          votes?: number | null
        }
        Update: {
          company_id?: string | null
          context?: string | null
          created_at?: string | null
          feature_name?: string | null
          id?: string
          industry?: string | null
          validated?: boolean | null
          votes?: number | null
        }
        Relationships: []
      }
      field_mapping_templates: {
        Row: {
          company_id: string | null
          confidence_score: number | null
          created_at: string
          id: string
          import_type: string
          industry: string | null
          source_field: string
          target_field: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          import_type: string
          industry?: string | null
          source_field: string
          target_field: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          company_id?: string | null
          confidence_score?: number | null
          created_at?: string
          id?: string
          import_type?: string
          industry?: string | null
          source_field?: string
          target_field?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      ghost_intent_events: {
        Row: {
          feature_attempted: string | null
          id: string
          intent_description: string | null
          metadata: Json | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          feature_attempted?: string | null
          id?: string
          intent_description?: string | null
          metadata?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          feature_attempted?: string | null
          id?: string
          intent_description?: string | null
          metadata?: Json | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      import_duplicates: {
        Row: {
          action: string | null
          confidence_score: number
          created_at: string
          duplicate_reason: string
          existing_lead_id: string | null
          id: string
          import_session_id: string
          raw_data_id: string
        }
        Insert: {
          action?: string | null
          confidence_score: number
          created_at?: string
          duplicate_reason: string
          existing_lead_id?: string | null
          id?: string
          import_session_id: string
          raw_data_id: string
        }
        Update: {
          action?: string | null
          confidence_score?: number
          created_at?: string
          duplicate_reason?: string
          existing_lead_id?: string | null
          id?: string
          import_session_id?: string
          raw_data_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_duplicates_existing_lead_id_fkey"
            columns: ["existing_lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_duplicates_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "import_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_duplicates_raw_data_id_fkey"
            columns: ["raw_data_id"]
            isOneToOne: false
            referencedRelation: "import_raw_data"
            referencedColumns: ["id"]
          },
        ]
      }
      import_raw_data: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          import_session_id: string
          processed_data: Json | null
          raw_data: Json
          row_index: number
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          import_session_id: string
          processed_data?: Json | null
          raw_data: Json
          row_index: number
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          import_session_id?: string
          processed_data?: Json | null
          raw_data?: Json
          row_index?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_raw_data_import_session_id_fkey"
            columns: ["import_session_id"]
            isOneToOne: false
            referencedRelation: "import_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      import_sessions: {
        Row: {
          ai_recommendations: Json | null
          company_id: string
          completed_at: string | null
          created_at: string
          duplicate_records: number | null
          error_details: string | null
          failed_imports: number | null
          field_mapping: Json | null
          file_name: string | null
          id: string
          import_summary: Json | null
          import_type: string
          processed_records: number | null
          status: string
          successful_imports: number | null
          total_records: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_recommendations?: Json | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          duplicate_records?: number | null
          error_details?: string | null
          failed_imports?: number | null
          field_mapping?: Json | null
          file_name?: string | null
          id?: string
          import_summary?: Json | null
          import_type: string
          processed_records?: number | null
          status?: string
          successful_imports?: number | null
          total_records?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_recommendations?: Json | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          duplicate_records?: number | null
          error_details?: string | null
          failed_imports?: number | null
          field_mapping?: Json | null
          file_name?: string | null
          id?: string
          import_summary?: Json | null
          import_type?: string
          processed_records?: number | null
          status?: string
          successful_imports?: number | null
          total_records?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      industry_knowledge: {
        Row: {
          company_id: string | null
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          industry: string
          source_id: string
          source_type: string
        }
        Insert: {
          company_id?: string | null
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          industry: string
          source_id: string
          source_type: string
        }
        Update: {
          company_id?: string | null
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          industry?: string
          source_id?: string
          source_type?: string
        }
        Relationships: []
      }
      integration_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          operation: string
          provider: string
          resource_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          operation: string
          provider: string
          resource_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          operation?: string
          provider?: string
          resource_id?: string | null
          status?: string
        }
        Relationships: []
      }
      integration_sync_status: {
        Row: {
          id: string
          last_sync: string | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          last_sync?: string | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          last_sync?: string | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      internal_ai_brain_status: {
        Row: {
          ai_uptime_minutes: number | null
          auto_fixes_today: number | null
          created_at: string | null
          critical_routes_monitored: Json | null
          escalation_count: number | null
          id: string
          last_check_in: string | null
          last_fix_description: string | null
          pending_errors: number | null
          status_timestamp: string
          system_health_score: number
          updated_at: string | null
        }
        Insert: {
          ai_uptime_minutes?: number | null
          auto_fixes_today?: number | null
          created_at?: string | null
          critical_routes_monitored?: Json | null
          escalation_count?: number | null
          id?: string
          last_check_in?: string | null
          last_fix_description?: string | null
          pending_errors?: number | null
          status_timestamp?: string
          system_health_score?: number
          updated_at?: string | null
        }
        Update: {
          ai_uptime_minutes?: number | null
          auto_fixes_today?: number | null
          created_at?: string | null
          critical_routes_monitored?: Json | null
          escalation_count?: number | null
          id?: string
          last_check_in?: string | null
          last_fix_description?: string | null
          pending_errors?: number | null
          status_timestamp?: string
          system_health_score?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          job_name: string
          last_run: string | null
          metadata: Json | null
          status: string
        }
        Insert: {
          id?: string
          job_name: string
          last_run?: string | null
          metadata?: Json | null
          status?: string
        }
        Update: {
          id?: string
          job_name?: string
          last_run?: string | null
          metadata?: Json | null
          status?: string
        }
        Relationships: []
      }
      lead_source_stats: {
        Row: {
          avg_close_value: number | null
          closed_deals: number | null
          company_id: string
          conversion_rate: number | null
          created_at: string | null
          id: string
          qualified_leads: number | null
          source: string
          total_leads: number | null
          total_spend: number | null
          updated_at: string | null
        }
        Insert: {
          avg_close_value?: number | null
          closed_deals?: number | null
          company_id: string
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          qualified_leads?: number | null
          source: string
          total_leads?: number | null
          total_spend?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_close_value?: number | null
          closed_deals?: number | null
          company_id?: string
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          qualified_leads?: number | null
          source?: string
          total_leads?: number | null
          total_spend?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          company_id: string
          conversion_likelihood: number | null
          created_at: string | null
          email: string | null
          id: string
          is_sensitive: boolean | null
          last_contact: string | null
          name: string
          phone: string | null
          priority: string | null
          score: number | null
          source: string | null
          speed_to_lead: number | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          company_id: string
          conversion_likelihood?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_sensitive?: boolean | null
          last_contact?: string | null
          name: string
          phone?: string | null
          priority?: string | null
          score?: number | null
          source?: string | null
          speed_to_lead?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          company_id?: string
          conversion_likelihood?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_sensitive?: boolean | null
          last_contact?: string | null
          name?: string
          phone?: string | null
          priority?: string | null
          score?: number | null
          source?: string | null
          speed_to_lead?: number | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      manager_feedback: {
        Row: {
          company_id: string
          created_at: string | null
          feedback_period_end: string | null
          feedback_period_start: string | null
          feedback_type: string | null
          goals_alignment_score: number | null
          id: string
          metrics: Json | null
          recommended_actions: Json | null
          report_summary: string | null
          sentiment: string | null
          suggestions: Json | null
          user_accepted_suggestions: boolean | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          feedback_period_end?: string | null
          feedback_period_start?: string | null
          feedback_type?: string | null
          goals_alignment_score?: number | null
          id?: string
          metrics?: Json | null
          recommended_actions?: Json | null
          report_summary?: string | null
          sentiment?: string | null
          suggestions?: Json | null
          user_accepted_suggestions?: boolean | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          feedback_period_end?: string | null
          feedback_period_start?: string | null
          feedback_type?: string | null
          goals_alignment_score?: number | null
          id?: string
          metrics?: Json | null
          recommended_actions?: Json | null
          report_summary?: string | null
          sentiment?: string | null
          suggestions?: Json | null
          user_accepted_suggestions?: boolean | null
        }
        Relationships: []
      }
      manageragent_memory: {
        Row: {
          created_at: string | null
          escalations: number | null
          feedback_log: Json | null
          id: string
          last_login: string | null
          pipeline_health: string | null
          rep_id: string
          task_performance: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          escalations?: number | null
          feedback_log?: Json | null
          id?: string
          last_login?: string | null
          pipeline_health?: string | null
          rep_id: string
          task_performance?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          escalations?: number | null
          feedback_log?: Json | null
          id?: string
          last_login?: string | null
          pipeline_health?: string | null
          rep_id?: string
          task_performance?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      master_ai_brain: {
        Row: {
          applied_fixes: Json | null
          company_id: string | null
          company_overview: Json | null
          created_at: string | null
          id: string
          integrations_health: Json | null
          logs: Json | null
          realtime_issues: Json | null
          system_performance: Json | null
          unresolved_bugs: Json | null
          updated_at: string | null
        }
        Insert: {
          applied_fixes?: Json | null
          company_id?: string | null
          company_overview?: Json | null
          created_at?: string | null
          id?: string
          integrations_health?: Json | null
          logs?: Json | null
          realtime_issues?: Json | null
          system_performance?: Json | null
          unresolved_bugs?: Json | null
          updated_at?: string | null
        }
        Update: {
          applied_fixes?: Json | null
          company_id?: string | null
          company_overview?: Json | null
          created_at?: string | null
          id?: string
          integrations_health?: Json | null
          logs?: Json | null
          realtime_issues?: Json | null
          system_performance?: Json | null
          unresolved_bugs?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      message_lead_links: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          message_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_lead_links_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_lead_links_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string
          edited_at: string | null
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_pinned: boolean | null
          message_type: string
          metadata: Json | null
          sender_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string
          edited_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean | null
          message_type?: string
          metadata?: Json | null
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string
          edited_at?: string | null
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_pinned?: boolean | null
          message_type?: string
          metadata?: Json | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      nova_error_log: {
        Row: {
          component: string
          context: Json | null
          created_at: string | null
          error_message: string
          error_type: string
          fixed_by_ai: boolean | null
          id: string
          resolved_at: string | null
          retry_count: number | null
        }
        Insert: {
          component: string
          context?: Json | null
          created_at?: string | null
          error_message: string
          error_type: string
          fixed_by_ai?: boolean | null
          id?: string
          resolved_at?: string | null
          retry_count?: number | null
        }
        Update: {
          component?: string
          context?: Json | null
          created_at?: string | null
          error_message?: string
          error_type?: string
          fixed_by_ai?: boolean | null
          id?: string
          resolved_at?: string | null
          retry_count?: number | null
        }
        Relationships: []
      }
      oauth_connections: {
        Row: {
          access_token: string | null
          account_info: Json | null
          created_at: string
          email: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          provider: string
          provider_user_id: string | null
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          account_info?: Json | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider: string
          provider_user_id?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          account_info?: Json | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          provider?: string
          provider_user_id?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_assistant: Json | null
          ai_calibrated: boolean | null
          assistant_name: string | null
          business_goal: string | null
          company_id: string | null
          created_at: string | null
          email: string | null
          email_account: string | null
          email_connected: boolean | null
          email_provider: string | null
          full_name: string | null
          has_completed_onboarding: boolean | null
          id: string
          industry: string | null
          influence_style: string | null
          last_login: string | null
          launched_at: string | null
          management_style: string | null
          mental_state_trigger: string | null
          motivation_trigger: string | null
          onboarding_complete: boolean | null
          onboarding_step: number | null
          phone_number: string | null
          preferred_team_personality: string | null
          primary_goal: string | null
          profile_picture_url: string | null
          rep_motivation: string | null
          role: Database["public"]["Enums"]["user_role"]
          sales_personality: string | null
          sales_style: string | null
          strength_area: string | null
          team_obstacle: string | null
          team_size: number | null
          updated_at: string | null
          user_metadata: Json | null
          voice_style: string | null
          weakness: string | null
          wishlist: string | null
        }
        Insert: {
          ai_assistant?: Json | null
          ai_calibrated?: boolean | null
          assistant_name?: string | null
          business_goal?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          email_account?: string | null
          email_connected?: boolean | null
          email_provider?: string | null
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id: string
          industry?: string | null
          influence_style?: string | null
          last_login?: string | null
          launched_at?: string | null
          management_style?: string | null
          mental_state_trigger?: string | null
          motivation_trigger?: string | null
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          phone_number?: string | null
          preferred_team_personality?: string | null
          primary_goal?: string | null
          profile_picture_url?: string | null
          rep_motivation?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sales_personality?: string | null
          sales_style?: string | null
          strength_area?: string | null
          team_obstacle?: string | null
          team_size?: number | null
          updated_at?: string | null
          user_metadata?: Json | null
          voice_style?: string | null
          weakness?: string | null
          wishlist?: string | null
        }
        Update: {
          ai_assistant?: Json | null
          ai_calibrated?: boolean | null
          assistant_name?: string | null
          business_goal?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          email_account?: string | null
          email_connected?: boolean | null
          email_provider?: string | null
          full_name?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          industry?: string | null
          influence_style?: string | null
          last_login?: string | null
          launched_at?: string | null
          management_style?: string | null
          mental_state_trigger?: string | null
          motivation_trigger?: string | null
          onboarding_complete?: boolean | null
          onboarding_step?: number | null
          phone_number?: string | null
          preferred_team_personality?: string | null
          primary_goal?: string | null
          profile_picture_url?: string | null
          rep_motivation?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sales_personality?: string | null
          sales_style?: string | null
          strength_area?: string | null
          team_obstacle?: string | null
          team_size?: number | null
          updated_at?: string | null
          user_metadata?: Json | null
          voice_style?: string | null
          weakness?: string | null
          wishlist?: string | null
        }
        Relationships: []
      }
      referral_links: {
        Row: {
          company_id: string
          config_snapshot: Json
          created_at: string | null
          expires_at: string | null
          id: string
          referral_code: string
        }
        Insert: {
          company_id: string
          config_snapshot: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          referral_code: string
        }
        Update: {
          company_id?: string
          config_snapshot?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          referral_code?: string
        }
        Relationships: []
      }
      referral_usage: {
        Row: {
          created_at: string | null
          discount_applied: number | null
          id: string
          new_company_id: string
          referral_code: string
          referring_company_id: string
        }
        Insert: {
          created_at?: string | null
          discount_applied?: number | null
          id?: string
          new_company_id: string
          referral_code: string
          referring_company_id: string
        }
        Update: {
          created_at?: string | null
          discount_applied?: number | null
          id?: string
          new_company_id?: string
          referral_code?: string
          referring_company_id?: string
        }
        Relationships: []
      }
      relevance_usage: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          requests_limit: number
          requests_used: number
          tier: string
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          requests_limit?: number
          requests_used?: number
          tier?: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          requests_limit?: number
          requests_used?: number
          tier?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rep_learning_logs: {
        Row: {
          company_id: string
          completed: boolean | null
          created_at: string | null
          feedback: string | null
          id: string
          lesson_title: string | null
          lesson_type: string
          quiz_result: number | null
          rep_id: string | null
          time_spent_minutes: number | null
        }
        Insert: {
          company_id: string
          completed?: boolean | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          lesson_title?: string | null
          lesson_type: string
          quiz_result?: number | null
          rep_id?: string | null
          time_spent_minutes?: number | null
        }
        Update: {
          company_id?: string
          completed?: boolean | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          lesson_title?: string | null
          lesson_type?: string
          quiz_result?: number | null
          rep_id?: string | null
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rep_learning_logs_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rep_metrics: {
        Row: {
          avg_tone_score: number | null
          calls_made: number | null
          closes: number | null
          company_id: string
          created_at: string | null
          demos_booked: number | null
          id: string
          objections_logged: Json | null
          rep_id: string | null
          updated_at: string | null
          week_start: string
        }
        Insert: {
          avg_tone_score?: number | null
          calls_made?: number | null
          closes?: number | null
          company_id: string
          created_at?: string | null
          demos_booked?: number | null
          id?: string
          objections_logged?: Json | null
          rep_id?: string | null
          updated_at?: string | null
          week_start: string
        }
        Update: {
          avg_tone_score?: number | null
          calls_made?: number | null
          closes?: number | null
          company_id?: string
          created_at?: string | null
          demos_booked?: number | null
          id?: string
          objections_logged?: Json | null
          rep_id?: string | null
          updated_at?: string | null
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "rep_metrics_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salesagent_memory: {
        Row: {
          created_at: string | null
          escalation_flag: boolean | null
          follow_up_sent: boolean | null
          id: string
          last_contact: string | null
          lead_id: string
          notes: string | null
          outcome: string | null
          stage: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          escalation_flag?: boolean | null
          follow_up_sent?: boolean | null
          id?: string
          last_contact?: string | null
          lead_id: string
          notes?: string | null
          outcome?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          escalation_flag?: boolean | null
          follow_up_sent?: boolean | null
          id?: string
          last_contact?: string | null
          lead_id?: string
          notes?: string | null
          outcome?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_summary: {
        Row: {
          company_id: string
          generated_at: string | null
          id: string
          summary: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          generated_at?: string | null
          id?: string
          summary?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          generated_at?: string | null
          id?: string
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sms_conversations: {
        Row: {
          body: string
          company_id: string
          created_at: string | null
          direction: string
          error_message: string | null
          id: string
          lead_id: string | null
          media_urls: string[] | null
          message_sid: string
          metadata: Json | null
          phone_number: string
          status: string
          thread_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          company_id: string
          created_at?: string | null
          direction: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          media_urls?: string[] | null
          message_sid: string
          metadata?: Json | null
          phone_number: string
          status?: string
          thread_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          company_id?: string
          created_at?: string | null
          direction?: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          media_urls?: string[] | null
          message_sid?: string
          metadata?: Json | null
          phone_number?: string
          status?: string
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stats_history: {
        Row: {
          chunk_count: number
          created_at: string
          document_count: number
          id: string
          user_id: string | null
        }
        Insert: {
          chunk_count?: number
          created_at?: string
          document_count?: number
          id?: string
          user_id?: string | null
        }
        Update: {
          chunk_count?: number
          created_at?: string
          document_count?: number
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sync_failures: {
        Row: {
          created_at: string | null
          error_message: string
          id: string
          provider: string
          resolved_at: string | null
          resource_id: string
          resource_type: string
          retry_count: number | null
        }
        Insert: {
          created_at?: string | null
          error_message: string
          id?: string
          provider: string
          resolved_at?: string | null
          resource_id: string
          resource_type: string
          retry_count?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string
          id?: string
          provider?: string
          resolved_at?: string | null
          resource_id?: string
          resource_type?: string
          retry_count?: number | null
        }
        Relationships: []
      }
      system_error_log: {
        Row: {
          ai_fix_summary: string | null
          component: string
          created_at: string | null
          developer_note: string | null
          error_type: string
          escalated: boolean | null
          fix_type: string | null
          fixed_by_ai: boolean | null
          id: string
          retry_attempted: boolean | null
          retry_result: string | null
          route: string | null
          severity: string
          stack_trace: string | null
          timestamp: string
          updated_at: string | null
        }
        Insert: {
          ai_fix_summary?: string | null
          component: string
          created_at?: string | null
          developer_note?: string | null
          error_type: string
          escalated?: boolean | null
          fix_type?: string | null
          fixed_by_ai?: boolean | null
          id?: string
          retry_attempted?: boolean | null
          retry_result?: string | null
          route?: string | null
          severity?: string
          stack_trace?: string | null
          timestamp?: string
          updated_at?: string | null
        }
        Update: {
          ai_fix_summary?: string | null
          component?: string
          created_at?: string | null
          developer_note?: string | null
          error_type?: string
          escalated?: boolean | null
          fix_type?: string | null
          fixed_by_ai?: boolean | null
          id?: string
          retry_attempted?: boolean | null
          retry_result?: string | null
          route?: string | null
          severity?: string
          stack_trace?: string | null
          timestamp?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_updates: {
        Row: {
          changes: Json | null
          deployed_at: string | null
          deployed_by: string | null
          description: string | null
          id: string
          update_type: string
        }
        Insert: {
          changes?: Json | null
          deployed_at?: string | null
          deployed_by?: string | null
          description?: string | null
          id?: string
          update_type: string
        }
        Update: {
          changes?: Json | null
          deployed_at?: string | null
          deployed_by?: string | null
          description?: string | null
          id?: string
          update_type?: string
        }
        Relationships: []
      }
      tsam_logs: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          priority: string | null
          resolved: boolean | null
          type: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          resolved?: boolean | null
          type: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          resolved?: boolean | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      unused_features: {
        Row: {
          company_id: string | null
          feature: string | null
          flagged: boolean | null
          id: string
          last_seen: string | null
          usage_count: number | null
        }
        Insert: {
          company_id?: string | null
          feature?: string | null
          flagged?: boolean | null
          id?: string
          last_seen?: string | null
          usage_count?: number | null
        }
        Update: {
          company_id?: string | null
          feature?: string | null
          flagged?: boolean | null
          id?: string
          last_seen?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      usage_analytics: {
        Row: {
          company_id: string
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          action: string | null
          company_id: string
          context: string | null
          feature: string | null
          id: string
          metadata: Json | null
          outcome: string | null
          role: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          action?: string | null
          company_id: string
          context?: string | null
          feature?: string | null
          id?: string
          metadata?: Json | null
          outcome?: string | null
          role?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          action?: string | null
          company_id?: string
          context?: string | null
          feature?: string | null
          id?: string
          metadata?: Json | null
          outcome?: string | null
          role?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          best_time_end: string | null
          best_time_start: string | null
          burnout_risk: number | null
          call_count: number | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_active: string | null
          mood_score: number | null
          updated_at: string | null
          user_id: string
          win_count: number | null
        }
        Insert: {
          best_time_end?: string | null
          best_time_start?: string | null
          burnout_risk?: number | null
          call_count?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_active?: string | null
          mood_score?: number | null
          updated_at?: string | null
          user_id: string
          win_count?: number | null
        }
        Update: {
          best_time_end?: string | null
          best_time_start?: string | null
          burnout_risk?: number | null
          call_count?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_active?: string | null
          mood_score?: number | null
          updated_at?: string | null
          user_id?: string
          win_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      execute_vector_search: {
        Args: {
          query_embedding: string
          company_filter: string
          industry_filter: string
          match_limit: number
        }
        Returns: {
          content: string
          source_type: string
          source_id: string
        }[]
      }
      get_current_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      user_role: "manager" | "sales_rep" | "developer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["manager", "sales_rep", "developer", "admin"],
    },
  },
} as const
