export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      company_settings: {
        Row: {
          agent_name: string | null
          company_id: string
          created_at: string | null
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
      profiles: {
        Row: {
          company_id: string | null
          created_at: string | null
          email_account: string | null
          email_connected: boolean | null
          email_provider: string | null
          full_name: string | null
          id: string
          last_login: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          email_account?: string | null
          email_connected?: boolean | null
          email_provider?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          email_account?: string | null
          email_connected?: boolean | null
          email_provider?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
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
      stats_history: {
        Row: {
          chunk_count: number
          created_at: string
          document_count: number
          id: string
        }
        Insert: {
          chunk_count?: number
          created_at?: string
          document_count?: number
          id?: string
        }
        Update: {
          chunk_count?: number
          created_at?: string
          document_count?: number
          id?: string
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
      user_role: "manager" | "sales_rep"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["manager", "sales_rep"],
    },
  },
} as const
